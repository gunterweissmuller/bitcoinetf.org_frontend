import { useNuxtApp, useRouter, useRoute } from '#app'
import { computed, ref } from 'vue'
import { BrowserProvider, parseUnits } from "ethers";
import axios from "axios";
import { SignupMethods } from '~/src/shared/constants/signupMethods'
import { hostname } from '~/src/app/adapters/ethAdapter'
import { Steps } from './steps'
import { useConnectReplenishmentChannel } from '~/src/app/composables/useConnectReplenishmentChannel'
import { getCookie, deleteCookie } from '../../shared/helpers/cookie.helpers';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/vue'
import { useWeb3Modal, useWeb3ModalProvider, useWeb3ModalAccount, useWeb3ModalEvents } from '@web3modal/ethers/vue'
  

export function useRegistration($app) {
    const router = useRouter()
    const route = useRoute()
    const {connectToReplenishment} = useConnectReplenishmentChannel($app)
    const siteKey = ref(window.location.host === 'bitcoinetf.org' ? '0x4AAAAAAAO0YJKv_riZdNZX' : '1x00000000000000000000AA');
    const phone = ref(null);
    const countryCode = ref(null);

    const countryChanged = (country) => {
        countryCode.value = country.dialCode;
    }

    function openTermsModal() {
        $app.store.registration.isOpenTermsModal = true;
    }

    // Email Field
    const firstName = ref('')
    const lastName = ref('')
    const email = ref('')
    const emailErrorText = ref('')
    const isEmailValid = ref(false)
    const isEmailDisabled = ref(false);

    watch(
        () => isEmailValid.value,
        () => {
            if(isEmailValid.value) {
                emailErrorText.value = ''
            }
        }
    )

    function emailFieldBlurHandler() {
        if (isEmailValid.value) {
            emailErrorText.value = ''
            return
        }

        if ($app.store.registration.email) {
            emailErrorText.value = 'Invalid email address'
            return
        }

        emailErrorText.value = 'Required'
    }

    const handleEmailBack = () => {
        $app.store.registration.currentStep = Steps.Choice;
        $app.store.registration.firstName = '';
        $app.store.registration.lastName = '';
        $app.store.registration.email = '';
        emailErrorText.value = '';
        isEmailValid.value = false;
    }

    // Choice step
    const choiceToEmail = () => {
        $app.store.registration.currentStep = Steps.Email
        $app.store.registration.currentSignup = SignupMethods.Email;
    }

    //
    const continueLogin = async (response) => {
        $app.store.registration.currentStep = Steps.Success
        $app.store.auth.setTokens(response.data);

        await $app.api.eth.auth.getUser().then((resp) => {
            $app.store.user.info = resp?.data;
            connectToReplenishment();
            setTimeout(() => {
                router.push('/personal/fund/portfolio');
            },2000);
        });

        const aAid = window.localStorage.getItem('PAPVisitorId');
        if(aAid) {
            $app.api.eth.auth.papSignUp({
            payload: {
                pap_id: aAid,
                utm_label: window.localStorage.getItem('a_utm'),
            }}).then((r: any) => {
                //window.localStorage.removeItem('a_aid');
                //window.localStorage.removeItem('a_utm');
            });
        }

        await $app.api.info.blockchainProxy.getUserBlockchainWallet().then((resp) => {
            $app.store.user.blockchainUserWallet = resp?.data.uid
        })
    }

    const catchRegistration = async (e) => {
        if (e?.errors?.error?.message) {
            $app.store.registration.backendError = {value: e.errors.error.message, field: 'default'};
            if(e?.errors?.error?.validation) {
                if(e?.errors?.error?.validation?.first_name) {
                    $app.store.registration.backendError = {value: e?.errors?.error?.validation?.first_name[0], field: 'first_name'};
                }
                if(e?.errors?.error?.validation?.last_name) {
                    $app.store.registration.backendError = {value: e?.errors?.error?.validation?.last_name[0], field: 'last_name'};
                }
            }

            if(e?.errors?.error?.message === 'email is already in use') {
                $app.store.registration.backendError = {value: 'Email is already in use', field: 'email'};
            }
        } else {
            $app.store.registration.backendError = {value: 'Something went wrong', field: 'default'};
        }
    }
    //

    //metamask
    const isMetamaskConnecting = ref(false);
    const isReload = ref(false);

    const handleMetamaskConnect = async () => {
        // if metamask button is already clicked
        if(isMetamaskConnecting.value) return;
        isMetamaskConnecting.value = true;

        //if metamask is not installed
        if (!$app.store.user.isMetamaskSupported) {
            if(isReload.value) {
                isReload.value = false;
                location.reload();
            } else {
                isReload.value = true;
            }

            // window.location.href = 'https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn';
            window.open('https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn');
            isMetamaskConnecting.value = false;
            return;
        }

        $app.store.registration.currentSignup = SignupMethods.Metamask;

        try {
            const provider = new BrowserProvider((window as any).ethereum);
            const signer = await provider.getSigner();
            const accounts: string[] = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
            const chainId: string = await (window as any).ethereum.request({"method": "eth_chainId","params": []});
            const responseSwitchChain: any = await(window as any).ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: "0x1" }] });
            const responseBackend: any = await axios.get(`https://${hostname}/v1/auth/provider/metamask/message`);

            $app.store.registration.metamaskData.metamaskSignatureMessage = responseBackend.data.message;
            $app.store.registration.metamaskData.metamaskWalletAddress = signer.address;

            const signedMsg = await (window as any).ethereum.request({"method": "personal_sign","params": [responseBackend.data.message, accounts[0],]});

            $app.store.registration.metamaskData.metamaskSignature = signedMsg;
            isMetamaskConnecting.value = false;
            $app.store.registration.currentStep = Steps.Email;
        } catch (e) {
            console.error(e);
            isMetamaskConnecting.value = false;
        }

    }

    // google
    const handleGoogleConnect = async () => {
        $app.api.eth.auth.getGoogleRedirectUrl().then((url: any) => {
            window.location.href = url.url;
        });
    }

    // telegram
    const testTG = async () => {
        const dataTelegram = await $app.api.eth.auth.getCredintialsTelegram();
        const telegramBotId = dataTelegram?.data?.bot_id;

        let data = null;
        await (window as any).Telegram.Login.init('widget_login', telegramBotId, {"origin":"https:\/\/core.telegram.org"}, false, "en");

        await (window as any).Telegram.Login.auth(
            { bot_id: telegramBotId, request_access: true },
            (tgData: any) => {
                if (tgData) {
                    $app.api.eth.auth.telegramGetAuthType({
                        telegram_data: JSON.stringify(tgData),
                    }).then((r: any) => {
                        if(r.data.auth_type === 'registration') {
                            $app.store.authTelegram.setResponse({response: tgData, method: SignupMethods.Telegram});
                            $app.store.registration.currentStep = Steps.Email
                            $app.store.registration.currentSignup = SignupMethods.Telegram;
                            $app.store.registration.firstName = $app.store.authTelegram.response.first_name;
                            $app.store.registration.lastName = $app.store.authTelegram.response.last_name;
                            $app.store.registration.email = $app.store.authTelegram.response.email;
                        } else {
                            $app.api.eth.auth.
                            loginTelegram({
                                telegram_data: JSON.stringify(tgData),
                            })
                            .then((jwtResponse: any) => {
                                continueLogin(jwtResponse);
                            })
                        }
                    })
                }
            }
        );
        return data;
    }

    // apple
    const handleAppleConnect = async () => {

        try {
            const urlApple = await $app.api.eth.auth.getAppleRedirect();

            function getJsonFromUrl(url) {
                if(!url) url = location.search;
                var query = url.substr(1).split("?")[1];
                var result = {};
                query.split("&").forEach(function(part) {
                var item = part.split("=");
                result[item[0]] = decodeURIComponent(item[1]);
                });
                return result;
            }

            const parsedUrl = getJsonFromUrl(urlApple.url);
            (window as any).AppleID.auth.init({
                clientId : parsedUrl.client_id,
                scope : parsedUrl.scope,
                redirectURI : parsedUrl.redirect_uri,
                usePopup : false
            });
            
            const data = await (window as any).AppleID.auth.signIn()
            $app.store.authTemp.response = data.authorization.id_token;
            
            $app.api.eth.auth
            .getAppleAuthType({apple_token: data.authorization.id_token})
            .then(async (res) => {
                if(res.data.auth_type === 'registration') {

                    if(data?.user?.email) {
                        $app.store.registration.email = data?.user?.email;
                        isEmailDisabled.value = true;
                    }

                    if(data?.user?.name) {
                        $app.store.registration.firstName = data?.user?.name?.firstName ? data?.user?.name?.firstName : '';
                        $app.store.registration.lastName = data?.user?.name?.lastName ? data?.user?.name?.lastName : '';
                    }

                    $app.store.registration.currentStep = Steps.Email
                    $app.store.registration.currentSignup = SignupMethods.Apple;
                } else {
                    $app.api.eth.auth.
                    loginApple({
                        apple_token: $app.store.authTemp.response,
                    })
                    .then((jwtResponse: any) => {
                        continueLogin(jwtResponse);
                    })
                }

            })
        } catch ( error ) {
            // Handle error.
            console.error(error);
        }

    }

    //facebook
    function initFbSdk(options) {
        return new Promise(resolve => {
            window.fbAsyncInit = function () {
                const defaults = { cookie: true, xfbml: true }
                options = { ...defaults, ...options }
                window.FB.init(options)
                resolve()
            };
            /* eslint-disable */
            (function (d, s, id) {
                const fjs = d.getElementsByTagName(s)[0]
                if (d.getElementById(id)) { return; }
                const js = d.createElement(s); js.id = id
                js.src = '//connect.facebook.net/zh_TW/sdk.js'
                fjs.parentNode.insertBefore(js, fjs)
            }(document, 'script', 'facebook-jssdk'))
            /* eslint-enable */
        })
    }

    function getFbSdk(options) {
        return new Promise(async resolve => {
            if (window.FB) {
                resolve(window.FB)
            } else {
            await initFbSdk(options)
                resolve(window.FB)
            }
        })
    }

    const handleFacebookConnect = async () => {

        $app.api.eth.auth
        .getCredintialsFacebook()
        .then(async (res) => {
            const facebookId = res?.data?.client_id; // 934423128173330; //  res?.data?.client_id;

            const sdk = await getFbSdk(
                {
                    appId: facebookId, //You will need to change this
                    cookie: true, // This is important, it's not enabled by default
                    version: "v13.0"
                }
            ) //sdk === FB in this case

            sdk.init(
                {
                    appId: facebookId, //You will need to change this
                    cookie: true, // This is important, it's not enabled by default
                    version: "v13.0"
                }
            );

            sdk.login((response) => {
                if (response?.authResponse) {
                    $app.store.authTemp.response = response.authResponse;

                    $app.api.eth.auth
                    .getAuthTypeFacebook({facebook_id: $app.store.authTemp.response?.userID})
                    .then(async (res) => {
                        if(res.data.auth_type === 'registration') {
                            $app.store.registration.currentStep = Steps.Email
                            $app.store.registration.currentSignup = SignupMethods.Facebook;
                        } else {
                            $app.api.eth.auth.
                            loginFacebook({
                                facebook_id: $app.store.authTemp.response?.userID,
                                facebook_data: $app.store.authTemp.response?.accessToken,
                            })
                            .then((jwtResponse: any) => {
                                continueLogin(jwtResponse);
                            })
                        }

                    })
                }
            });
        })
        .catch((e) => {
            // Todo: notify something went wrond
            console.error(e)
        })
    }

    // Ref code field
    const isSubmitEmailForm = ref(false);

    const onSubmitEmailForm = async () => {

        var re = /(?:\+)[\d\-\(\) ]{9,}\d/g;
        var valid = re.test($app.store.registration.phone);

        if(!valid) {
            $app.store.registration.backendError = {value: 'Phone number is not valid', field: 'phone'};
            return;
        }

        if(isSubmitEmailForm.value) return;
        isSubmitEmailForm.value = true;

        const tempPhone = $app.store.registration.phone.slice(countryCode.value.length+1);

        localStorage.setItem('verifyLinkRedirect', String(router.currentRoute.value.path));

        $app.store.registration.backendError = {value: '', field: 'default'};
        const initPayload = {
            method: $app.store.registration.currentSignup,
            first_name: $app.filters.trimSpaceIntoString($app.store.registration.firstName),
            last_name: $app.filters.trimSpaceIntoString($app.store.registration.lastName),
            email: $app.filters.trimSpaceIntoString($app.store.registration.email),
            phone_number: tempPhone,
            phone_number_code: countryCode.value,
        }
        const referralCode = getCookie('referral_code')

        if (referralCode) {
            initPayload.ref_code = referralCode
            deleteCookie('referral_code')
        }
        
        if($app.store.registration.currentSignup === SignupMethods.Facebook) {

            $app.api.eth.auth
            .initFacebook({
                facebook_id: $app.store.authTemp.response?.userID,
                first_name: $app.store.registration.firstName,
                last_name: $app.store.registration.lastName,
                email: $app.store.registration.email,
                ref_code: $app.store.auth.refCode,
                phone_number: tempPhone,
                phone_number_code: countryCode.value,
            }).then((r: any) => {
                isSubmitEmailForm.value = false;
                $app.store.registration.currentStep = Steps.Link
                $app.store.auth.accountMethod = "facebook";
                startTimer()
            }).catch((e) => {
                isSubmitEmailForm.value = false;
                catchRegistration(e);
            })

            return;
        }

        if($app.store.registration.currentSignup === SignupMethods.Apple) {
            $app.api.eth.auth
            .initApple({
                apple_token: $app.store.authTemp.response,
                first_name: $app.store.registration.firstName,
                last_name: $app.store.registration.lastName,
                email: $app.store.registration.email,
                ref_code: $app.store.auth.refCode,
                phone_number: tempPhone,
                phone_number_code: countryCode.value,
            }).then((r: any) => {
                isSubmitEmailForm.value = false;
                $app.store.registration.currentStep = Steps.Link
                $app.store.auth.accountMethod = "apple";
                startTimer()
            }).catch((e) => {
                isSubmitEmailForm.value = false;
                catchRegistration(e);
            })

            return;
        }

        if ($app.store.registration.currentSignup === SignupMethods.Google) {
            if ($app.store.auth.refCode !== "") {
                initPayload.ref_code = $app.store.auth.refCode
                $app.store.auth.setRefCode("");
            }

            $app.api.eth.auth
            .initGoogle(initPayload)
            .then((tokens: any) => {
                $app.store.auth.setTokens(tokens.data)
                $app.store.authGoogle.setResponse({}, SignupMethods.Google);
                isSubmitEmailForm.value = false;
                $app.store.registration.firstName = '';
                $app.store.registration.lastName = '';
                $app.store.registration.email = '';
            })
            .then(async () => {
                    await $app.api.eth.auth.getUser().then((resp) => {
                        $app.store.user.info = resp?.data;
                        router.push('/personal/fund/portfolio');
                    })

                const aAid = window.localStorage.getItem('PAPVisitorId');
                if(aAid) {
                    $app.api.eth.auth.papSignUp({
                    payload: {
                        pap_id: aAid,
                        utm_label: window.localStorage.getItem('a_utm'),
                    }}).then((r: any) => {
                    //window.localStorage.removeItem('a_aid');
                    //window.localStorage.removeItem('a_utm');
                    });
                }
            })
            .catch((e) => {
                isSubmitEmailForm.value = false;
                catchRegistration(e);
            })

            return;
        }

        if($app.store.registration.currentSignup === SignupMethods.Telegram) {
            $app.api.eth.auth
            .initTelegram({
                telegram_data: JSON.stringify($app.store.authTelegram.response),
                first_name: $app.store.registration.firstName,
                last_name: $app.store.registration.lastName,
                email: $app.store.registration.email,
                ref_code: $app.store.auth.refCode,
                phone_number: tempPhone,
                phone_number_code: countryCode.value,
            }).then((r: any) => {
                isSubmitEmailForm.value = false;
                $app.store.registration.currentStep = Steps.Link
                $app.store.auth.accountMethod = "telegram";
                startTimer()
            }).catch((e) => {
                isSubmitEmailForm.value = false;
                catchRegistration(e);
            })

            return;
        }

        if ($app.store.registration.currentSignup === SignupMethods.Metamask) {
            initPayload.message = $app.store.registration.metamaskData.metamaskSignatureMessage;
            initPayload.signature = $app.store.registration.metamaskData.metamaskSignature;
            initPayload.wallet_address = $app.store.registration.metamaskData.metamaskWalletAddress;
            await $app.api.eth.auth
            .initMetamask(initPayload)
            .then(() => {
                isSubmitEmailForm.value = false;
                $app.store.registration.currentStep = Steps.Link
                $app.store.auth.accountMethod = "metamask";
                startTimer()
            })
            .catch((e) => {
                isSubmitEmailForm.value = false;
                catchRegistration(e);
            })
        } 

        if($app.store.registration.currentSignup === SignupMethods.Email) {
            initPayload.fast = true;
            await $app.api.eth.auth
            .init(initPayload)
            .then(() => {
                isSubmitEmailForm.value = false;
                $app.store.registration.currentStep = Steps.Link
                $app.store.auth.accountMethod = "email";
                startTimer()
            })
            .catch((e) => {
                isSubmitEmailForm.value = false;
                catchRegistration(e);
            })
        }
    }

    // timer 
    const startTimer = () => {
        clearInterval($app.store.registration.timer)
        const stopDate = Date.now() + 60 * 5 * 1000
        
        $app.store.registration.timerStarted = true

        $app.store.registration.timer = setInterval(() => {
            $app.store.registration.timeLeft = parseInt((stopDate - Date.now()) / 1000)
            if ($app.store.registration.timeLeft < 1) {
                $app.store.registration.timerStarted = false
                clearInterval($app.store.registration.timer)
            }
        }, 1000 / 25)
    }

    // Code Step
    const resendCodeClick = async () => {
        if ($app.store.registration.timerStarted) {
            return
        }

        $app.store.registration.backendError = {value: '', field: 'default'};

        startTimer()

        await $app.api.eth.auth
            .resend({ email: $app.store.registration.email })
            .catch((e) => {
                if (e?.errors?.error?.message) {
                    $app.store.registration.backendError = {value: e.errors.error.message, field: 'default'};

                    if(e?.errors?.error?.validation) {
                        if(e?.errors?.error?.validation?.first_name) {
                            $app.store.registration.backendError = {value: e?.errors?.error?.validation?.first_name[0], field: 'first_name'};
                        }
                        if(e?.errors?.error?.validation?.last_name) {
                            $app.store.registration.backendError = {value: e?.errors?.error?.validation?.last_name[0], field: 'last_name'};
                        }
                    }
                } else {
                    $app.store.registration.backendError = {value: 'Something went wrong', field: 'default'};
                }
            })
    }

    // walletConnect

    const handleWalletConnect = async () => {
        // 1. Get projectId at https://cloud.walletconnect.com
        const projectId = '2c405771381e1a1f65a48a216a166f61'

        // 2. Set chains
        const mainnet = {
            chainId: 1,
            name: 'Ethereum',
            currency: 'ETH',
            explorerUrl: 'https://etherscan.io',
            rpcUrl: 'https://cloudflare-eth.com'
        }

        // 3. Create your application's metadata object
        const metadata = {
            name: 'My Website',
            description: 'My Website description',
            url: 'https://mywebsite.com', // url must match your domain & subdomain
            icons: ['https://avatars.githubusercontent.com/u/37784886']
        }

        // 4. Create Ethers config
        const ethersConfig = defaultConfig({
            /*Required*/
            metadata,

            /*Optional*/
            enableEIP6963: true, // true by default
            enableInjected: true, // true by default
            enableCoinbase: true, // true by default
            rpcUrl: '...', // used for the Coinbase SDK
            defaultChainId: 1, // used for the Coinbase SDK
        });

        // 5. Create a Web3Modal instance
        const modal = createWeb3Modal({
            ethersConfig,
            chains: [mainnet],
            projectId,
            enableAnalytics: true, // Optional - defaults to your Cloud configuration
            enableOnramp: true // Optional - false as default
        })

        // 4. Use modal composable
        const modal2 = useWeb3Modal()

        modal.open();
        // modal2.open({ view: 'Networks' })

        const { address, chainId, isConnected } = useWeb3ModalAccount()
        const { walletProvider } = useWeb3ModalProvider()

        async function onSignMessage() {
            const provider = new BrowserProvider(walletProvider)
            const signer = await provider.getSigner()
            const signature = await signer?.signMessage('Hello Web3Modal Ethers')
            console.log(signature)
        }

        const events = useWeb3ModalEvents()


        function handler(props){
            // console.log(address.value, chainId.value, isConnected.value, events);
        }
        
        modal.subscribeWalletInfo(handler)

        // modal.getEvent() // get last event
        // modal.subscribeEvents((event) => {
        //     console.log(event,event.data.event)
        // }) // subscribe to events
    }


    // methods
    const methods = [
        {
            name: 'Email',
            img: $app.store.user.theme === 'dark' ? '/img/icons/mono/mail-light.svg' : '/img/icons/mono/mail.svg',
            onClick: choiceToEmail
        },
        {
            name: 'Metamask',
            img: '/img/icons/colorful/metamask.svg',
            onClick: handleMetamaskConnect
        },
        {
            name: 'Google',
            img: '/img/icons/colorful/google.svg',
            onClick: handleGoogleConnect
        },
        {
            name: 'Telegram',
            img: '/img/icons/colorful/telegram3.svg',
            onClick: testTG
        },
        {
            name: 'Apple',
            img: $app.store.user.theme === 'dark' ? '/img/icons/colorful/apple.svg' : '/img/icons/mono/apple.svg',
            onClick: handleAppleConnect
        },
        {
            name: 'Facebook',
            img: '/img/icons/colorful/facebook-circle.svg',
            onClick: handleFacebookConnect
        },
        {
            name: 'WalletConnect',
            img: '/img/icons/colorful/walletConnect.svg',
            onClick: handleWalletConnect
        },
    ]


    return {
        onSubmitEmailForm,
        emailErrorText,
        emailFieldBlurHandler,
        isEmailValid,
        resendCodeClick,
        methods,
        handleEmailBack,
        isEmailDisabled,
        countryChanged,
        openTermsModal,
        siteKey,
        catchRegistration,
        continueLogin,
    };
}
