import { useNuxtApp, useRouter, useRoute } from '#app'
import AInput from '~/src/shared/ui/atoms/a-input/a-input.vue'
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
import APincodeInput from '~/src/shared/ui/atoms/a-pincode-input/a-pincode-input.vue'
import ACheckbox from '~/src/shared/ui/atoms/a-checkbox/a-checkbox.vue'
import { computed, ref } from 'vue'
import MAccordion from '~/src/shared/ui/molecules/m-accordion/m-accordion.vue'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import { Icon } from '~/src/shared/constants/icons'
import FTermsModal from '~/src/features/f-terms-modal/f-terms-modal.vue'
import VueTurnstile from 'vue-turnstile';
import { SiweMessage } from 'siwe';
import 'vue-tel-input/vue-tel-input.css';
import { BrowserProvider, parseUnits } from "ethers";
import { googleSdkLoaded, googleLogout  } from "vue3-google-login";
import axios from "axios";
import { SignupMethods } from '~/src/shared/constants/signupMethods'
import { hostname } from '~/src/app/adapters/ethAdapter'
import { document } from 'postcss'
import { useConnectReplenishmentChannel } from '~/src/app/composables/useConnectReplenishmentChannel'

export function useRegistration($app) {
    const router = useRouter()
    const route = useRoute()

    const {connectToReplenishment} = useConnectReplenishmentChannel($app)

    const token = ref('')
    const siteKey = ref(window.location.host === 'bitcoinetf.org' ? '0x4AAAAAAAO0YJKv_riZdNZX' : '1x00000000000000000000AA');
    const enum Steps {
        Terms = 'Terms',
        Choice = 'Choice',
        Email = 'Email',
        Code = 'Code',
        Link = 'Link',
        Password = 'Password',
        TelegramSign = 'TelegramSign',
        Loading = 'Loading',
        Error = 'Error',
        Success = 'Success'
    }

    const phone = ref(null);
    const countryCode = ref(null);

    const countryChanged = (country) => {
        // console.log(country, phone);
        countryCode.value = country.dialCode;
    }

    const confirmResponse = ref(null)
    const currentSignup = ref(SignupMethods.Email);
    const currentStep = ref(Steps.Choice)
    const backendError = ref({value: '', field: 'default'})
    const accordionRef = ref(null)
    const isOpenTermsModal = ref(false)

    function openTermsModal() {
        isOpenTermsModal.value = true
    }

    // Terms step
    const registrationAgreedUS = ref(false)
    const registrationAgreedTerms = ref(false)

    const termsContinueDisabled = computed<boolean>(() => {
        return !registrationAgreedUS.value || !registrationAgreedTerms.value
    })

    const termsContinue = () => {
        currentStep.value = Steps.Choice
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

        if (email.value) {
            emailErrorText.value = 'Invalid email address'
            return
        }

        emailErrorText.value = 'Required'
    }

    const handleEmailBack = () => {
        currentStep.value = Steps.Choice;
        firstName.value = '';
        lastName.value = '';
        email.value = '';
        emailErrorText.value = '';
        isEmailValid.value = false;
    }

    // Choice step
    const choiceToEmail = () => {
        currentStep.value = Steps.Email;
        currentSignup.value = SignupMethods.Email;
    }

    const isMetamaskSupported = ref(false);
    const address = ref("");
    const metamaskError = ref("");
    const computedAddress = computed(() => address.value.substring(0, 8) + '...');

    onMounted(() => {

        // if verify link

        if (route.query.code && route.query.email) {
            email.value = String(route.query.email);
            emailCode.value = String(route.query.code);

            router.replace({'query': ''});

            currentStep.value = Steps.Loading;

            if($app.store.auth.accountMethod === 'metamask') {

            $app.api.eth.auth.
                confirmMetamask({
                email: $app.filters.trimSpaceIntoString(email.value),
                code: $app.filters.trimSpaceIntoString(emailCode.value),
                fast: true,
            })
                .then((jwtResponse: any) => {
                // TODO falling user/me
                $app.store.auth.setTokens(jwtResponse.data)
                confirmResponse.value = jwtResponse.data
                currentStep.value = Steps.Success;

                
                })
                .then(async () => {
                await $app.api.eth.auth.getUser().then((resp) => {
                    $app.store.user.info = resp?.data;
                    setTimeout(() => {
                    router.push('/personal/fund/portfolio');
                    },3000);
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
                })
                .catch((e) => {
                isCodeContinueProcess.value = false;

                if (e?.errors?.error?.message) {
                    backendError.value = {value: e.errors.error.message, field: 'default'};

                    if(e?.errors?.error?.validation) {
                    if(e?.errors?.error?.validation?.first_name) {
                        backendError.value = {value: e?.errors?.error?.validation?.first_name[0], field: 'first_name'};
                    }
                    if(e?.errors?.error?.validation?.last_name) {
                        backendError.value = {value: e?.errors?.error?.validation?.last_name[0], field: 'last_name'};
                    }
                    }
                } else {
                    backendError.value = {value: 'Something went wrong', field: 'default'};
                }
                })

            } else if ($app.store.auth.accountMethod === 'telegram') {
                $app.api.eth.auth.
                confirmTelegram({
                    telegram_data: JSON.stringify($app.store.authTelegram?.response),
                    email: $app.filters.trimSpaceIntoString(email.value),
                    code: $app.filters.trimSpaceIntoString(emailCode.value),
                })
                .then((jwtResponse: any) => {
                    // TODO falling user/me
                    $app.store.auth.setTokens(jwtResponse.data)
                    confirmResponse.value = jwtResponse.data
                    currentStep.value = Steps.Success;

                    
                })
                .then(async () => {
                    await $app.api.eth.auth.getUser().then((resp) => {
                    $app.store.user.info = resp?.data;
                    setTimeout(() => {
                        router.push('/personal/fund/portfolio');
                    },3000);
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
                })
                .catch((e) => {
                    isCodeContinueProcess.value = false;
                    if (e?.errors?.error?.message) {
                        backendError.value = {value: e.errors.error.message, field: 'default'};

                        if(e?.errors?.error?.validation) {
                        if(e?.errors?.error?.validation?.first_name) {
                            backendError.value = {value: e?.errors?.error?.validation?.first_name[0], field: 'first_name'};
                        }
                        if(e?.errors?.error?.validation?.last_name) {
                            backendError.value = {value: e?.errors?.error?.validation?.last_name[0], field: 'last_name'};
                        }
                        }
                    } else {
                        backendError.value = {value: 'Something went wrong', field: 'default'};
                    }
                })
            } else if ($app.store.auth.accountMethod === 'apple') {
                $app.api.eth.auth.
                confirmApple({
                    apple_token: $app.store.authTemp?.response,
                    email: $app.filters.trimSpaceIntoString(email.value),
                    code: $app.filters.trimSpaceIntoString(emailCode.value),
                })
                .then((jwtResponse: any) => {
                    // TODO falling user/me
                    $app.store.auth.setTokens(jwtResponse.data)
                    confirmResponse.value = jwtResponse.data
                    currentStep.value = Steps.Success;

                    
                })
                .then(async () => {
                    await $app.api.eth.auth.getUser().then((resp) => {
                    $app.store.user.info = resp?.data;
                    setTimeout(() => {
                        router.push('/personal/fund/portfolio');
                    },3000);
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
                })
                .catch((e) => {
                    isCodeContinueProcess.value = false;
                    if (e?.errors?.error?.message) {
                        backendError.value = {value: e.errors.error.message, field: 'default'};

                        if(e?.errors?.error?.validation) {
                        if(e?.errors?.error?.validation?.first_name) {
                            backendError.value = {value: e?.errors?.error?.validation?.first_name[0], field: 'first_name'};
                        }
                        if(e?.errors?.error?.validation?.last_name) {
                            backendError.value = {value: e?.errors?.error?.validation?.last_name[0], field: 'last_name'};
                        }
                        }
                    } else {
                        backendError.value = {value: 'Something went wrong', field: 'default'};
                    }
                })
            } else if ($app.store.auth.accountMethod === 'facebook') {
                backendError.value = {value: '', field: 'default'};

                $app.api.eth.auth.
                    confirmFacebook({
                    facebook_id: $app.store.authTemp.response?.userID,
                    email: $app.filters.trimSpaceIntoString(email.value),
                    code: $app.filters.trimSpaceIntoString(emailCode.value),
                    })
                    .then((jwtResponse: any) => {
                    // TODO falling user/me
                    $app.store.auth.setTokens(jwtResponse.data)
                    confirmResponse.value = jwtResponse.data;
                    currentStep.value = Steps.Success;
                    })
                    .then(async () => {
                    await $app.api.eth.auth.getUser().then((resp) => {
                        $app.store.user.info = resp?.data;
                        setTimeout(() => {
                        router.push('/personal/fund/portfolio');
                        },3000);
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
                    })
                    .catch((e) => {
                    isCodeContinueProcess.value = false;
                    if (e?.errors?.error?.message) {
                        backendError.value = {value: e.errors.error.message, field: 'default'};

                        if(e?.errors?.error?.validation) {
                        if(e?.errors?.error?.validation?.first_name) {
                            backendError.value = {value: e?.errors?.error?.validation?.first_name[0], field: 'first_name'};
                        }
                        if(e?.errors?.error?.validation?.last_name) {
                            backendError.value = {value: e?.errors?.error?.validation?.last_name[0], field: 'last_name'};
                        }
                        }
                    } else {
                        backendError.value = {value: 'Something went wrong', field: 'default'};
                    }
                    })
            } else {
                // email

                $app.api.eth.auth
                .confirmFast({
                    email: $app.filters.trimSpaceIntoString(email.value),
                    code: $app.filters.trimSpaceIntoString(emailCode.value),
                })
                .then((jwtResponse: any) => {
                    // TODO falling user/me
                    $app.store.auth.setTokens(jwtResponse.data)
                    confirmResponse.value = jwtResponse.data
                })
                .then(async () => {
                    await $app.api.eth.auth.getUser().then((resp) => {
                    $app.store.user.info = resp?.data
                    })

                    const aAid = window.localStorage.getItem('PAPVisitorId');
                    if (aAid) {
                    $app.api.eth.auth.papSignUp({
                        payload: {
                        pap_id: aAid,
                        utm_label: window.localStorage.getItem('a_utm'),
                        }
                    }).then((r: any) => {
                        //window.localStorage.removeItem('a_aid');
                        //window.localStorage.removeItem('a_utm');
                    });
                    }

                    await $app.api.info.blockchainProxy.getUserBlockchainWallet().then((resp) => {
                    $app.store.user.blockchainUserWallet = resp?.data.uid
                    })
                })
                .then(async () => {
                    currentStep.value = Steps.Success;

                
                    setTimeout(() => {
                    router.push('/personal/fund/portfolio');
                    },3000);
                })
                .catch((e) => {
                    currentStep.value = Steps.Error;
                    if (e?.errors?.error?.message) {
                        backendError.value = {value: e.errors.error.message, field: 'default'};

                        if(e?.errors?.error?.validation) {
                        if(e?.errors?.error?.validation?.first_name) {
                            backendError.value = {value: e?.errors?.error?.validation?.first_name[0], field: 'first_name'};
                        }
                        if(e?.errors?.error?.validation?.last_name) {
                            backendError.value = {value: e?.errors?.error?.validation?.last_name[0], field: 'last_name'};
                        }
                        }
                    } else {
                        backendError.value = {value: 'Something went wrong', field: 'default'};
                    }
                })

            }

        }

        // metamask

        isMetamaskSupported.value = typeof (window as any).ethereum !== "undefined";

        if(isMetamaskSupported.value) {
            (window as any).ethereum.on("chainChanged", (chainId: string) => {
                if (chainId !== "0x1") {
                    metamaskError.value = "This network is not supported. Please change the network to Ethereum."
                } else if (chainId === "0x1") {
                    metamaskError.value = "";
                }
            });
        } else {
            console.log("Metamask is not installed");
        }

    })

    const isMetamaskConnecting = ref(false);
    const isReload = ref(false);

    const handleMetamaskConnect = async () => {
        // if metamask button is already clicked
        if(isMetamaskConnecting.value) return;
        isMetamaskConnecting.value = true;

        //if metamask is not installed
        if (!isMetamaskSupported.value) {
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

    currentSignup.value = SignupMethods.Metamask;

    try {
        const accounts: string[] = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
        const chainId: string = await (window as any).ethereum.request({"method": "eth_chainId","params": []});
        const responseSwitchChain: any = await(window as any).ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: "0x1" }] });
        const responseBackend: any = await axios.get(`https://${hostname}/v1/auth/provider/metamask/message`);

        metamaskSignatureMessage.value = responseBackend.data.message;
        address.value = accounts[0];
        const provider = new BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();
        metamaskWalletAddress.value = signer.address;

        const signedMsg = await (window as any).ethereum.request({"method": "personal_sign","params": [responseBackend.data.message, accounts[0],]});

        metamaskSignature.value = signedMsg;
        isMetamaskConnecting.value = false;
        currentStep.value = Steps.Email;

    } catch (e) {
        console.error(e);
        isMetamaskConnecting.value = false;
    }

    }

    const googleData : any = ref();
    const googleUrl = ref("");

    const telegramRedirectUrl = ref('');
    const telegramBotName = ref('');
    const telegramBotId = ref('');

    onMounted(() => {
        axios.get(`https://${hostname}/v1/auth/provider/google-auth/redirect-url`).then((url: any) => {
            googleUrl.value = url.data.url //.replace("https%3A%2F%2Ffront.stage.techetf.org", "http%3A%2F%2Flocalhost:3000");
        });



        if($app.store.authGoogle.response?.email) {
            currentStep.value = Steps.Email;
            currentSignup.value = SignupMethods.Google;
            firstName.value = $app.store.authGoogle.response.first_name;
            lastName.value = $app.store.authGoogle.response.last_name;
            email.value =$app.store.authGoogle.response.email;
        }

    });

    const handleGoogleConnect = async () => {
        currentSignup.value = SignupMethods.Google;
        window.location.href = googleUrl.value;
    }

    // telegram

    onMounted(() => {
    axios.get(`https://${hostname}/v1/auth/provider/telegram/credentials`).then((r: any) => {
        telegramRedirectUrl.value = r.data.data.redirect_url;
        telegramBotName.value = r.data.data.bot_name;
        telegramBotId.value = r.data.data.bot_id;
    })
    })

    const handleTelegramAuth = async () => {
    await (window as any).Telegram.Login.auth(
        { bot_id: telegramBotId.value, request_access: true },
        (tgData: any) => {
        if (!tgData) {
            // authorization failed
        } else {


            $app.api.eth.auth.telegramGetAuthType({
            telegram_data: JSON.stringify(tgData),
            }).then((r: any) => {
            if(r.data.auth_type === 'registration') {
                $app.store.authTelegram.setResponse({response: tgData, method: SignupMethods.Telegram});

                currentStep.value = Steps.Email;
                currentSignup.value = SignupMethods.Telegram;
                firstName.value = $app.store.authTelegram.response.first_name;
                lastName.value = $app.store.authTelegram.response.last_name;
                email.value = $app.store.authTelegram.response.email;
                // router.push("/personal/registration");
            } else {
                $app.api.eth.auth.
                loginTelegram({
                    telegram_data: JSON.stringify(tgData),
                })
                    .then((jwtResponse: any) => {
                    $app.store.auth.setTokens(jwtResponse.data)
                    })
                    .then(async () => {
                    await $app.api.eth.auth.getUser().then((resp) => {
                        $app.store.user.info = resp?.data
                    });

                    await router.push('/personal/fund/portfolio')
                    });
            }
            })



        }

        // Here you would want to validate data like described there https://core.telegram.org/widgets/login#checking-authorization
        }
    );
    }

    const testTG = async () => {

        let data = null;
        await (window as any).Telegram.Login.init('widget_login', telegramBotId.value, {"origin":"https:\/\/core.telegram.org"}, false, "en");

        await (window as any).Telegram.Login.auth(
            { bot_id: telegramBotId.value, request_access: true },
            (tgData: any) => {
            data = tgData;

            if (!tgData) {
                // authorization failed
            } else {

                $app.api.eth.auth.telegramGetAuthType({
                telegram_data: JSON.stringify(tgData),
                }).then((r: any) => {
                if(r.data.auth_type === 'registration') {
                    $app.store.authTelegram.setResponse({response: tgData, method: SignupMethods.Telegram});

                    currentStep.value = Steps.Email;
                    currentSignup.value = SignupMethods.Telegram;
                    firstName.value = $app.store.authTelegram.response.first_name;
                    lastName.value = $app.store.authTelegram.response.last_name;
                    email.value = $app.store.authTelegram.response.email;
                    // router.push("/personal/registration");
                } else {
                    $app.api.eth.auth.
                    loginTelegram({
                        telegram_data: JSON.stringify(tgData),
                    })
                        .then((jwtResponse: any) => {
                        $app.store.auth.setTokens(jwtResponse.data)
                        })
                        .then(async () => {
                        await $app.api.eth.auth.getUser().then((resp) => {
                            $app.store.user.info = resp?.data
                        });

                        await router.push('/personal/fund/portfolio')

                        });
                }
                })
            }

            // Here you would want to validate data like described there https://core.telegram.org/widgets/login#checking-authorization
            }
        );
        return data;
    }

    // apple

    onMounted(() => {

        $app.api.eth.auth
            .getAppleRedirect()
            .then(async (res) => {

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

            const parsedUrl = getJsonFromUrl(res.url);


            (window as any).AppleID.auth.init({
                clientId : parsedUrl.client_id,
                scope : parsedUrl.scope,
                redirectURI : parsedUrl.redirect_uri,
                usePopup : true
            });

            })
            .catch((e) => {
            // Todo: notify something went wrond
            console.error(e)
            })
    })

    const handleAppleConnect = async () => {

        try {
            const data = await (window as any).AppleID.auth.signIn()
            // Handle successful response.

            $app.store.authTemp.response = data.authorization.id_token;


            
            $app.api.eth.auth
            .getAppleAuthType({apple_token: data.authorization.id_token})
            .then(async (res) => {

                if(res.data.auth_type === 'registration') {

                    if(data?.user?.email) {
                    email.value = data?.user?.email;
                    isEmailDisabled.value = true;
                    }

                    if(data?.user?.name) {
                    firstName.value = data?.user?.name?.firstName ? data?.user?.name?.firstName : '';
                    lastName.value = data?.user?.name?.lastName ? data?.user?.name?.lastName : '';
                    }

                    currentStep.value = Steps.Email;
                    currentSignup.value = SignupMethods.Apple;

                    //todo autofill email?

                    // firstName.value = $app.store.authTelegram.response.first_name;
                    // lastName.value = $app.store.authTelegram.response.last_name;
                    // email.value = $app.store.authTelegram.response.email;
                    // router.push("/personal/registration");
                } else {

                    //todo login apple request

                    $app.api.eth.auth.
                    loginApple({
                        apple_token: $app.store.authTemp.response,
                    })
                        .then((jwtResponse: any) => {
                        $app.store.auth.setTokens(jwtResponse.data)
                        })
                        .then(async () => {
                        await $app.api.eth.auth.getUser().then((resp) => {
                            $app.store.user.info = resp?.data
                        });

                        await router.push('/personal/fund/portfolio')
                        });
                }

            })
            .catch((e) => {
                // Todo: notify something went wrond
                console.error(e)
            })


        } catch ( error ) {
            // Handle error.
            console.error(error);
        }

    }

    //facebook

    const handleFacebookConnect = async () => {

        const initFacebook = async (id) => {
            (window as any).FB.init({
                appId: id, //You will need to change this
                cookie: true, // This is important, it's not enabled by default
                version: "v13.0"
            });
            }

            $app.api.eth.auth
            .getCredintialsFacebook()
            .then(async (res) => {
            console.log(res);

            await initFacebook(res?.data?.client_id);

            (window as any).FB.login(function(response) {
                console.log(response);
                if (response?.authResponse) {
                $app.store.authTemp.response = response.authResponse;

                $app.api.eth.auth
                .getAuthTypeFacebook({facebook_id: $app.store.authTemp.response?.userID})
                .then(async (res) => {
                    console.log(res);

                    if(res.data.auth_type === 'registration') {
                        currentStep.value = Steps.Email;
                        currentSignup.value = SignupMethods.Facebook;
                    } else {
                        $app.api.eth.auth.
                        loginFacebook({
                            facebook_id: $app.store.authTemp.response?.userID,
                            facebook_data: $app.store.authTemp.response?.accessToken,
                        })
                            .then((jwtResponse: any) => {
                            $app.store.auth.setTokens(jwtResponse.data)
                            })
                            .then(async () => {
                            await $app.api.eth.auth.getUser().then((resp) => {
                                $app.store.user.info = resp?.data
                            });

                            await router.push('/personal/analytics/performance')
                            });
                    }

                })
                .catch((e) => {
                    // Todo: notify something went wrond
                    console.error(e)
                })

                } else {
                }
            });

            })
            .catch((e) => {
            // Todo: notify something went wrond
            console.error(e)
            })
    }

    // Ref code field
    const emailCode = ref('')
    const pincodeErrorText = ref('')
    const refCode = ref('')
    const metamaskSignatureMessage = ref('')
    const metamaskSignature = ref('')
    const metamaskWalletAddress = ref('')

    const isSubmitEmailForm = ref(false);

    const onSubmitEmailForm = async () => {

    var re = /(?:\+)[\d\-\(\) ]{9,}\d/g;
    var valid = re.test(phone.value);

    if(!valid) {
        backendError.value = {value: 'Phone number is not valid', field: 'phone'};
        return;
    }

    if(isSubmitEmailForm.value) return;
    isSubmitEmailForm.value = true;

    const tempPhone = phone.value.slice(countryCode.value.length+1);

    localStorage.setItem('verifyLinkRedirect', String(router.currentRoute.value.path));

    backendError.value = {value: '', field: 'default'};
    const initPayload = {
        method: currentSignup.value,
        first_name: $app.filters.trimSpaceIntoString(firstName.value),
        last_name: $app.filters.trimSpaceIntoString(lastName.value),
        email: $app.filters.trimSpaceIntoString(email.value),
        phone_number: tempPhone,
        phone_number_code: countryCode.value,
    }

    if(currentSignup.value === SignupMethods.Metamask) {
        initPayload.message = metamaskSignatureMessage.value
        initPayload.signature = metamaskSignature.value
        initPayload.wallet_address = metamaskWalletAddress.value
    }

    if(currentSignup.value === SignupMethods.Facebook) {

        $app.api.eth.auth
        .initFacebook({
            facebook_id: $app.store.authTemp.response?.userID,
            first_name: firstName.value,
            last_name: lastName.value,
            email: email.value,
            ref_code: $app.store.auth.refCode,
            phone_number: tempPhone,
            phone_number_code: countryCode.value,
        }).then((r: any) => {
            isSubmitEmailForm.value = false;
            currentStep.value = Steps.Link;
            $app.store.auth.accountMethod = "facebook";
        }).catch((e) => {
        isSubmitEmailForm.value = false;
        if (e?.errors?.error?.message) {
            backendError.value = {value: e.errors.error.message, field: 'default'};

            if(e?.errors?.error?.validation) {
            if(e?.errors?.error?.validation?.first_name) {
                backendError.value = {value: e?.errors?.error?.validation?.first_name[0], field: 'first_name'};
            }
            if(e?.errors?.error?.validation?.last_name) {
                backendError.value = {value: e?.errors?.error?.validation?.last_name[0], field: 'last_name'};
            }
            }
        } else {
            backendError.value = {value: 'Something went wrong', field: 'default'};
        }
        })

        return;
    }

    if(currentSignup.value === SignupMethods.Apple) {


        $app.api.eth.auth
        .initApple({
            apple_token: $app.store.authTemp.response,
            first_name: firstName.value,
            last_name: lastName.value,
            email: email.value,
            ref_code: $app.store.auth.refCode,
            phone_number: tempPhone,
            phone_number_code: countryCode.value,
        }).then((r: any) => {
            isSubmitEmailForm.value = false;
            // currentStep.value = Steps.Code;
            currentStep.value = Steps.Link;
            $app.store.auth.accountMethod = "apple";
            startTimer()
        }).catch((e) => {
        isSubmitEmailForm.value = false;
        if (e?.errors?.error?.message) {
                backendError.value = {value: e.errors.error.message, field: 'default'};

                if(e?.errors?.error?.validation) {
                if(e?.errors?.error?.validation?.first_name) {
                    backendError.value = {value: e?.errors?.error?.validation?.first_name[0], field: 'first_name'};
                }
                if(e?.errors?.error?.validation?.last_name) {
                    backendError.value = {value: e?.errors?.error?.validation?.last_name[0], field: 'last_name'};
                }
                }
            } else {
                backendError.value = {value: 'Something went wrong', field: 'default'};
            }
        })

        return;
    }

    if (currentSignup.value === SignupMethods.Google) {

        if ($app.store.auth.refCode !== "") {
            initPayload.ref_code = $app.store.auth.refCode
            $app.store.auth.setRefCode("");
        }

        $app.api.eth.auth
        .initGoogle(initPayload)
        .then((tokens: any) => {
            $app.store.auth.setTokens(tokens.data)
            $app.store.authGoogle.setResponse({}, SignupMethods.Google);
            confirmResponse.value = tokens.data
            isSubmitEmailForm.value = false;
            firstName.value = '';
            lastName.value = '';
            email.value = '';
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
            console.error(e);
            isSubmitEmailForm.value = false;
            if (e?.errors?.error?.message) {
                backendError.value = {value: e.errors.error.message, field: 'default'};

                if(e?.errors?.error?.validation) {
                if(e?.errors?.error?.validation?.first_name) {
                    backendError.value = {value: e?.errors?.error?.validation?.first_name[0], field: 'first_name'};
                }
                if(e?.errors?.error?.validation?.last_name) {
                    backendError.value = {value: e?.errors?.error?.validation?.last_name[0], field: 'last_name'};
                }
                }
            } else {
                backendError.value = {value: 'Something went wrong', field: 'default'};
            }
        })

        return;
    }

    if(currentSignup.value === SignupMethods.Telegram) {
        $app.api.eth.auth
        .initTelegram({
            telegram_data: JSON.stringify($app.store.authTelegram.response),
            first_name: firstName.value,
            last_name: lastName.value,
            email: email.value,
            ref_code: $app.store.auth.refCode,
            phone_number: tempPhone,
            phone_number_code: countryCode.value,
        }).then((r: any) => {
            isSubmitEmailForm.value = false;
            // currentStep.value = Steps.Code;
            currentStep.value = Steps.Link;
            $app.store.auth.accountMethod = "telegram";
            startTimer()
        }).catch((e) => {
        isSubmitEmailForm.value = false;
        if (e?.errors?.error?.message) {
                backendError.value = {value: e.errors.error.message, field: 'default'};

                if(e?.errors?.error?.validation) {
                if(e?.errors?.error?.validation?.first_name) {
                    backendError.value = {value: e?.errors?.error?.validation?.first_name[0], field: 'first_name'};
                }
                if(e?.errors?.error?.validation?.last_name) {
                    backendError.value = {value: e?.errors?.error?.validation?.last_name[0], field: 'last_name'};
                }
                }
            } else {
                backendError.value = {value: 'Something went wrong', field: 'default'};
            }
        })

        return;
    }

    if (currentSignup.value === SignupMethods.Metamask) {
        await $app.api.eth.auth
        .initMetamask(initPayload)
        .then(() => {
            isSubmitEmailForm.value = false;
            // currentStep.value = Steps.Code;
            currentStep.value = Steps.Link;
            $app.store.auth.accountMethod = "metamask";
            startTimer()
        })
        .catch((e) => {
            isSubmitEmailForm.value = false;
            if (e?.errors?.error?.message) {
                backendError.value = {value: e.errors.error.message, field: 'default'};

                if(e?.errors?.error?.validation) {
                if(e?.errors?.error?.validation?.first_name) {
                    backendError.value = {value: e?.errors?.error?.validation?.first_name[0], field: 'first_name'};
                }
                if(e?.errors?.error?.validation?.last_name) {
                    backendError.value = {value: e?.errors?.error?.validation?.last_name[0], field: 'last_name'};
                }
                }
            } else {
                backendError.value = {value: 'Something went wrong', field: 'default'};
            }
        })
    } else {

        await $app.api.eth.auth
        .init(initPayload)
        .then(() => {
            isSubmitEmailForm.value = false;
            // currentStep.value = Steps.Code;
            currentStep.value = Steps.Link;
            $app.store.auth.accountMethod = "email";
            startTimer()
        })
        .catch((e) => {
            isSubmitEmailForm.value = false;
            if (e?.errors?.error?.message) {
                backendError.value = {value: e.errors.error.message, field: 'default'};

                if(e?.errors?.error?.validation) {
                if(e?.errors?.error?.validation?.first_name) {
                    backendError.value = {value: e?.errors?.error?.validation?.first_name[0], field: 'first_name'};
                }
                if(e?.errors?.error?.validation?.last_name) {
                    backendError.value = {value: e?.errors?.error?.validation?.last_name[0], field: 'last_name'};
                }
                }
            } else {
                backendError.value = {value: 'Something went wrong', field: 'default'};
            }
        })
    }
    }

    const timer = ref<NodeJS.Timer | null>(null)
    const timerStarted = ref<boolean>(false)
    const timeLeft = ref<number>(0)

    const startTimer = () => {
    clearInterval(timer.value)
    const stopDate = Date.now() + 60 * 5 * 1000
    timerStarted.value = true

    timer.value = setInterval(() => {
        timeLeft.value = parseInt((stopDate - Date.now()) / 1000)
        if (timeLeft.value < 1) {
            timerStarted.value = false
            clearInterval(timer.value)
        }
    }, 1000 / 25)
    }

    const emailButtonDisabled = computed<boolean>(() => {
    return !isEmailValid.value || !firstName.value || !lastName.value || !Boolean(token.value) //!registrationAgreed.value
    })

    // Code Step

    const isCodeCorrect = ref(false)

    const pincodeTrigger = ref(false)
    const onCodeInput = async (codePayload) => {
    backendError.value = {value: '', field: 'default'};

    if (codePayload.isCompleted) {
        pincodeTrigger.value = true
        await $app.api.eth.auth
            .check({ email: $app.filters.trimSpaceIntoString(email.value), code: $app.filters.trimSpaceIntoString(emailCode.value) })
            .then((checkResponse) => {
                // currentStep.value = Steps.Password
                isCodeCorrect.value = true
            })
            .catch((e) => {
                pincodeTrigger.value = false

                if (e?.errors?.error?.message) {
                    backendError.value = {value: e.errors.error.message, field: 'default'};

                    if(e?.errors?.error?.validation) {
                    if(e?.errors?.error?.validation?.first_name) {
                        backendError.value = {value: e?.errors?.error?.validation?.first_name[0], field: 'first_name'};
                    }
                    if(e?.errors?.error?.validation?.last_name) {
                        backendError.value = {value: e?.errors?.error?.validation?.last_name[0], field: 'last_name'};
                    }
                    }
                } else {
                    backendError.value = {value: 'Something went wrong', field: 'default'};
                }
            })
    }
    }

    const isCodeContinueProcess = ref(false);

    const codeContinue = async () => {

    if(isCodeContinueProcess.value) return;
    isCodeContinueProcess.value = true;

    if(currentSignup.value === SignupMethods.Metamask) {
        backendError.value = {value: '', field: 'default'};
        await $app.api.eth.auth.
            confirmMetamask({
            email: $app.filters.trimSpaceIntoString(email.value),
            code: $app.filters.trimSpaceIntoString(emailCode.value),
            fast: true,
        })
            .then((jwtResponse: any) => {
            // TODO falling user/me
            $app.store.auth.setTokens(jwtResponse.data)
            confirmResponse.value = jwtResponse.data
            })
            .then(async () => {
            await $app.api.eth.auth.getUser().then((resp) => {
                $app.store.user.info = resp?.data;
                router.push('/personal/fund/portfolio');
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
            })
            .catch((e) => {
            isCodeContinueProcess.value = false;
            if (e?.errors?.error?.message) {
                backendError.value = {value: e.errors.error.message, field: 'default'};

                if(e?.errors?.error?.validation) {
                if(e?.errors?.error?.validation?.first_name) {
                    backendError.value = {value: e?.errors?.error?.validation?.first_name[0], field: 'first_name'};
                }
                if(e?.errors?.error?.validation?.last_name) {
                    backendError.value = {value: e?.errors?.error?.validation?.last_name[0], field: 'last_name'};
                }
                }
            } else {
                backendError.value = {value: 'Something went wrong', field: 'default'};
            }
            })
    } else if(currentSignup.value === SignupMethods.Telegram) {
        backendError.value = {value: '', field: 'default'};
        await $app.api.eth.auth.
        confirmTelegram({
            telegram_data: JSON.stringify($app.store.authTelegram.response),
            email: $app.filters.trimSpaceIntoString(email.value),
            code: $app.filters.trimSpaceIntoString(emailCode.value),
        })
        .then((jwtResponse: any) => {
            // TODO falling user/me
            $app.store.auth.setTokens(jwtResponse.data)
            confirmResponse.value = jwtResponse.data
        })
        .then(async () => {
            await $app.api.eth.auth.getUser().then((resp) => {
            $app.store.user.info = resp?.data;
            router.push('/personal/fund/portfolio');
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
        })
        .catch((e) => {
            isCodeContinueProcess.value = false;
            if (e?.errors?.error?.message) {
                backendError.value = {value: e.errors.error.message, field: 'default'};

                if(e?.errors?.error?.validation) {
                if(e?.errors?.error?.validation?.first_name) {
                    backendError.value = {value: e?.errors?.error?.validation?.first_name[0], field: 'first_name'};
                }
                if(e?.errors?.error?.validation?.last_name) {
                    backendError.value = {value: e?.errors?.error?.validation?.last_name[0], field: 'last_name'};
                }
                }
            } else {
                backendError.value = {value: 'Something went wrong', field: 'default'};
            }
        })
    } else if(currentSignup.value === SignupMethods.Apple) {
        backendError.value = {value: '', field: 'default'};

        await $app.api.eth.auth.
        confirmApple({
            apple_token: $app.store.authTemp.response,
            email: $app.filters.trimSpaceIntoString(email.value),
            code: $app.filters.trimSpaceIntoString(emailCode.value),
        })
        .then((jwtResponse: any) => {
            // TODO falling user/me
            $app.store.auth.setTokens(jwtResponse.data)
            confirmResponse.value = jwtResponse.data
        })
        .then(async () => {
            await $app.api.eth.auth.getUser().then((resp) => {
            $app.store.user.info = resp?.data;
            router.push('/personal/fund/portfolio');
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
        })
        .catch((e) => {
            isCodeContinueProcess.value = false;
            if (e?.errors?.error?.message) {
                backendError.value = {value: e.errors.error.message, field: 'default'};

                if(e?.errors?.error?.validation) {
                if(e?.errors?.error?.validation?.first_name) {
                    backendError.value = {value: e?.errors?.error?.validation?.first_name[0], field: 'first_name'};
                }
                if(e?.errors?.error?.validation?.last_name) {
                    backendError.value = {value: e?.errors?.error?.validation?.last_name[0], field: 'last_name'};
                }
                }
            } else {
                backendError.value = {value: 'Something went wrong', field: 'default'};
            }
        })
    } else if (currentSignup.value === SignupMethods.Facebook) {
        backendError.value = {value: '', field: 'default'};

        await $app.api.eth.auth.
        confirmFacebook({
            facebook_id: $app.store.authTemp.response?.userID,
            email: $app.filters.trimSpaceIntoString(email.value),
            code: $app.filters.trimSpaceIntoString(emailCode.value),
        })
        .then((jwtResponse: any) => {
            // TODO falling user/me
            $app.store.auth.setTokens(jwtResponse.data)
            confirmResponse.value = jwtResponse.data
        })
        .then(async () => {
            await $app.api.eth.auth.getUser().then((resp) => {
            $app.store.user.info = resp?.data;
            router.push('/personal/fund/portfolio');
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
        })
        .catch((e) => {
            isCodeContinueProcess.value = false;
            if (e?.errors?.error?.message) {
            backendError.value = {value: e.errors.error.message, field: 'default'};

            if(e?.errors?.error?.validation) {
                if(e?.errors?.error?.validation?.first_name) {
                backendError.value = {value: e?.errors?.error?.validation?.first_name[0], field: 'first_name'};
                }
                if(e?.errors?.error?.validation?.last_name) {
                backendError.value = {value: e?.errors?.error?.validation?.last_name[0], field: 'last_name'};
                }
            }
            } else {
            backendError.value = {value: 'Something went wrong', field: 'default'};
            }
        })
    } else {
        currentStep.value = Steps.Password
    }
    isCodeContinueProcess.value = false;
    }

    const resendCodeClick = async () => {
    if (timerStarted.value) {
        return
    }

    backendError.value = {value: '', field: 'default'};

    startTimer()

    await $app.api.eth.auth
        .resend({ email: email.value })
        .then(() => {
            // currentStep.value = Steps.Password
        })
        .catch((e) => {
            if (e?.errors?.error?.message) {
                backendError.value = {value: e.errors.error.message, field: 'default'};

                if(e?.errors?.error?.validation) {
                if(e?.errors?.error?.validation?.first_name) {
                    backendError.value = {value: e?.errors?.error?.validation?.first_name[0], field: 'first_name'};
                }
                if(e?.errors?.error?.validation?.last_name) {
                    backendError.value = {value: e?.errors?.error?.validation?.last_name[0], field: 'last_name'};
                }
                }
            } else {
                backendError.value = {value: 'Something went wrong', field: 'default'};
            }
        })
    }

    // Password Step


    const password = ref('')
    const passwordErrorText = ref('')
    const isPasswordValid = ref(false)
    const isPasswordType = ref(true)

    const passwordIconClickHandler = () => {
    isPasswordType.value = !isPasswordType.value;
    }


    function passwordFieldBlurHandler() {
    if (isPasswordValid.value) {
        passwordErrorText.value = ''
        return
    }

    if (password.value) {
        passwordErrorText.value = 'Must include a mix of upper case, lower case, numeric and special character.'
        return
    }

    passwordErrorText.value = 'Required'
    }

    const isSubmitPasswordForm = ref(false);

    const onSubmitPasswordForm = async () => {

    if(isSubmitPasswordForm.value) return;
    isSubmitPasswordForm.value = true;

    backendError.value = {value: '', field: 'default'};
    await $app.api.eth.auth
        .confirm({
            email: $app.filters.trimSpaceIntoString(email.value),
            code: $app.filters.trimSpaceIntoString(emailCode.value),
            password: $app.filters.trimSpaceIntoString(password.value),
        })
        .then((jwtResponse: any) => {
            // TODO falling user/me
            $app.store.auth.setTokens(jwtResponse.data)
            confirmResponse.value = jwtResponse.data
            isSubmitPasswordForm.value = false;
        })
        .then(async () => {
            await $app.api.eth.auth.getUser().then((resp) => {
                $app.store.user.info = resp?.data;
                router.push('/personal/fund/portfolio');
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
        })
        .catch((e) => {
            console.error(e);
            isSubmitPasswordForm.value = false;
            if (e?.errors?.error?.message) {
                backendError.value = {value: e.errors.error.message, field: 'default'};

                if(e?.errors?.error?.validation) {
                if(e?.errors?.error?.validation?.first_name) {
                    backendError.value = {value: e?.errors?.error?.validation?.first_name[0], field: 'first_name'};
                }
                if(e?.errors?.error?.validation?.last_name) {
                    backendError.value = {value: e?.errors?.error?.validation?.last_name[0], field: 'last_name'};
                }
                }
            } else {
                backendError.value = {value: 'Something went wrong', field: 'default'};
            }
        })
    }


    onMounted(() => {
        if (route.query.referral) {
            $app.store.auth.setRefCode({ref_code: route.query.referral});
            refCode.value = route.query.referral
            accordionRef.value?.open()
        }
    })

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
    ]


    return {
        onSubmitEmailForm,
        emailErrorText,
        emailFieldBlurHandler,
        isEmailValid,
        email,
        password,
        passwordFieldBlurHandler,
        isPasswordValid,
        backendError,
        timerStarted,
        timeLeft,
        resendCodeClick,
        methods
    };
}
