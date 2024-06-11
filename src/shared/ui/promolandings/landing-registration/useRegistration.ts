import { computed, ref } from 'vue'
import { useRouter, useRoute} from "#app";
import { SignupMethods } from '~/src/shared/constants/signupMethods';
import { SignupSteps } from './SignupSteps';
import { PurchaseSteps } from './PurchaseSteps';
import { useMetamask } from '~/src/app/composables/useMetamask';
import { useApple } from '~/src/app/composables/useApple';
import { useWalletConnect } from '~/src/app/composables/useWalletConnect';

export const useRegistration = ($app) => {

    const { initMetamask } = useMetamask($app);
    const { initApple } = useApple($app);
    const { openWalletConnect } = useWalletConnect($app);

    const router = useRouter()
    
    const token = ref('')
    const siteKey = ref(window.location.host === 'bitcoinetf.org' ? '0x4AAAAAAAO0YJKv_riZdNZX' : '1x00000000000000000000AA');
   
    const discountPercent = $app.store.user.statistic?.trc_bonus?.percent ? $app.store.user.statistic?.trc_bonus?.percent : 0;
    
    const handleMetamaskConnect = async () => {
        const {msg,resMsg,signer} = await initMetamask();

        if(msg && resMsg && signer) {
            $app.store.registration.metamaskData.metamaskSignatureMessage = resMsg?.message;
            $app.store.registration.metamaskData.metamaskWalletAddress = signer.address;
            $app.store.registration.metamaskData.metamaskSignature = msg;
            $app.store.tetherspecial.signupStep = SignupSteps.Signup;
            $app.store.tetherspecial.signupMethod = SignupMethods.Metamask;
        }
    }
    
    const defaultBuyAmount = $app.store.user.investAmount - ($app.store.user.investAmount/100)*discountPercent;
    const amountDiscount = computed(() => {
        return isNaN(defaultBuyAmount) ? 100 : defaultBuyAmount;
    })
    
    const isUserAuthenticated = computed(() => {
        return $app.store.auth.isUserAuthenticated
    })
    const refCode = ref('')
   
    // sign up
    const signupToggle = (method: any) => {
        if($app.store.tetherspecial.signupStep === SignupSteps.Default) {
            $app.store.tetherspecial.signupStep = SignupSteps.Signup;
            $app.store.tetherspecial.signupMethod = method;
        } else {
            if(method === $app.store.tetherspecial.signupMethod) {
                $app.store.tetherspecial.signupStep = SignupSteps.Default;
                $app.store.tetherspecial.signupMethod = SignupMethods.None;
            } else {
                $app.store.tetherspecial.signupStep = SignupSteps.Signup;
                $app.store.tetherspecial.signupMethod = method;
            }
        }
    }
    
    const scrollToSignup = () => {
        const element = document.querySelector(".landing-calculation__signup");
        let headerOffset
        if (window.innerWidth < 768) {
            headerOffset = 145;
        } else {
            headerOffset = 155;
        }
        const elementPosition = element.offsetTop;
        const offsetPosition = elementPosition  - headerOffset; //+ window.pageYOffset
    
        setTimeout(()=>{
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        },1)
    }
    
    const scrollToSignupFields = () => {
        const element = document.querySelector(".landing-calculation__signup-main");
        let headerOffset
        if (window.innerWidth < 768) {
            headerOffset = 145;
        } else {
            headerOffset = 155;
        }
        const elementPosition = element?.offsetTop;
        const offsetPosition = elementPosition  - headerOffset; //+ window.pageYOffset
    
        setTimeout(()=>{
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        },1)
    }
    
    
    const investBuySignup = () => {
        $app.store.tetherspecial.signupStep = SignupSteps.Signup;
        $app.store.tetherspecial.signupMethod = SignupMethods.Email;
        scrollToSignup();
      }
    
    const handleOpenPurchase = () => {
        $app.store.purchase.amountUS = amountDiscount.value;
        $app.store.tetherspecial.signupStep = SignupSteps.Default;
        $app.store.tetherspecial.purchaseStep = PurchaseSteps.Purchase;
        scrollToPurchase();
    }

    const investBuy = async () => {
        if($app.store.user.investAmount < 100) return
      
        $app.store.tetherspecial.signupStep = SignupSteps.Default;
        $app.store.tetherspecial.signupMethod = SignupMethods.None;
        handleOpenPurchase();
      
        await $app.api.eth.auth.getUser().then((resp) => {
          $app.store.user.info = resp?.data
        })
      
        await $app.api.info.blockchainProxy.getUserBlockchainWallet().then((resp) => {
          $app.store.user.blockchainUserWallet = resp?.data.uid
        })
    }
    
    const scrollToPurchase = () => {
        // const element = document.querySelector(".w-buy-shares-payment");
        const element = document.querySelector(".w-buy-shares-payment-short-tether");
        let headerOffset
        if (window.innerWidth < 768) {
            headerOffset = 145;
        } else {
            headerOffset = 155;
        }
        const elementPosition = element.offsetTop;
        const offsetPosition = elementPosition  - headerOffset; //+ window.pageYOffset
    
    
        setTimeout(()=>{
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        },1)
    }
    
    const email = ref('')
    const isEmailDisabled = ref(false);
    const countryCode = ref(null);

    const countryChanged = (country) => {
        countryCode.value = country.dialCode;
    }

    const emailErrorText = ref('')
    const isEmailValid = ref(false)
    
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
    
    // sign up / terms
    function openTermsModal() {
        $app.store.tetherspecial.isOpenTermsModal = true;
    }
    
    
    // telegram
    const isTelegramConnection = ref(false);
    
    const testTG = async () => {
        const dataTelegram = await $app.api.eth.auth.getCredintialsTelegram();
        const telegramBotId = dataTelegram?.data?.bot_id;
        let data = null;
        await (window as any).Telegram.Login.init('widget_login', telegramBotId, {"origin":"https:\/\/core.telegram.org"}, false, "en");
    
        await (window as any).Telegram.Login.auth(
        { bot_id: telegramBotId, request_access: true },
        (tgData: any) => {
            data = tgData;
            if (!tgData) {
                // authorization failed
                isTelegramConnection.value = true;
            } else {
                $app.api.eth.auth.telegramGetAuthType({
                    telegram_data: JSON.stringify(tgData),
                }).then((r: any) => {
                    if(r.data.auth_type === 'registration') {
                        $app.store.authTelegram.setResponse({response: tgData, method: SignupMethods.Telegram});
                        $app.store.tetherspecial.signupStep = SignupSteps.Signup;
                        $app.store.tetherspecial.signupMethod = SignupMethods.Telegram;
                        $app.store.tetherspecial.firstName = $app.store.authTelegram.response.first_name;
                        $app.store.tetherspecial.lastName = $app.store.authTelegram.response.last_name;
                        $app.store.tetherspecial.email = $app.store.authTelegram.response.email;
                        scrollToSignupFields();
                    } else {
                        $app.api.eth.auth.
                            loginTelegram({
                            telegram_data: JSON.stringify(tgData),
                            })
                            .then((jwtResponse: any) => {
                                handleContinueLogin(jwtResponse);
                            });
                    }
                }).catch((err) => {
                    console.error(err);
                    isTelegramConnection.value = true;
                })
            }
        }
        );
        return data;
    }
    
    
    const handleGoogleConnect = async () => {
        $app.api.eth.auth.getGoogleRedirectUrl().then((url: any) => {
            localStorage.setItem('googleRedirect', router.currentRoute.value.fullPath)
            window.location.href = url.url;
        });
    }
    
    // apple
    const handleAppleConnect = async () => {
        const data = await initApple();

        $app.api.eth.auth
        .getAppleAuthType({apple_token: data.authorization.id_token})
        .then(async (res) => {
            if(res.data.auth_type === 'registration') {
                
                $app.store.tetherspecial.signupStep = SignupSteps.Signup;
                $app.store.tetherspecial.signupMethod= SignupMethods.Apple;
    
                if(data?.user?.email) {
                    $app.store.tetherspecial.email = data?.user?.email;
                    isEmailDisabled.value = true;
                }
    
                if(data?.user?.name) {
                    $app.store.tetherspecial.firstName = data?.user?.name?.firstName ? data?.user?.name?.firstName : '';
                    $app.store.tetherspecial.lastName = data?.user?.name?.lastName ? data?.user?.name?.lastName : '';
                }
    
                scrollToSignupFields();
            } else {
                $app.api.eth.auth.
                loginApple({
                    apple_token: $app.store.authTemp.response,
                })
                    .then((jwtResponse: any) => {
                        handleContinueLogin(jwtResponse);
                    });
            }
        });
    }
    
    // facebook
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
                            $app.store.tetherspecial.signupStep = SignupSteps.Signup;
                            $app.store.tetherspecial.signupMethod = SignupMethods.Facebook;
                            scrollToSignupFields();
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
                                });
                        }
            
                    })
                    .catch((e) => {
                        // Todo: notify something went wrond
                        console.error(e)
                    })
        
                }
            });
        })
        .catch((e) => {
            // Todo: notify something went wrond
            console.error(e)
        })
    
    }
    
    // walletConnect
    const handleWalletConnect = async () => {
        openWalletConnect();
    }

    const sendCodeLoading = ref(false)
    const codeSended = ref(false);
    const timerStarted = ref(false);
    const codeSendBuyText = ref('Get Confirmation Code');

    const handleContinueLogin = async (jwtResponse) => {
        handleContinue(jwtResponse, true);
    }

    const handleContinue = async (jwtResponse, isLogin = false) => {
        // TODO falling user/me
        $app.store.auth.setTokens(jwtResponse.data)
        $app.store.tetherspecial.confirmResponse = jwtResponse.data;
        // isOpenModal.value = true;
        $app.store.tetherspecial.dataDisabled = true;

        await $app.api.eth.auth.getUser().then((resp) => {
            $app.store.user.info = resp?.data
        });

        handleOpenPurchase();

        await $app.api.info.blockchainProxy.getUserBlockchainWallet().then((resp) => {
            $app.store.user.blockchainUserWallet = resp?.data.uid
        })

        const aAid = window.localStorage.getItem('PAPVisitorId');
        if(aAid && !isLogin) {
            $app.api.eth.auth.papSignUp({
            payload: {
                pap_id: aAid,
                utm_label: window.localStorage.getItem('a_utm'),
            }}).then((r: any) => {
                //window.localStorage.removeItem('a_aid');
                //window.localStorage.removeItem('a_utm');
            });
        }
    }

    const handleCatch = (e) => {
        if (e?.errors?.error?.message) {
            $app.store.tetherspecial.backendError = {value: e.errors.error.message, field: 'default'}

            if(e?.errors?.error?.validation) {
                if(e?.errors?.error?.validation?.first_name) {
                    $app.store.tetherspecial.backendError = {value: e?.errors?.error?.validation?.first_name[0], field: 'first_name'};
                }
                if(e?.errors?.error?.validation?.last_name) {
                    $app.store.tetherspecial.backendError = {value: e?.errors?.error?.validation?.last_name[0], field: 'last_name'};
                }
            }
        } else {
            $app.store.tetherspecial.backendError = {value: 'Something went wrong', field: 'default'}
        }
    }

    const sendCode = async () => {
        var re = /(?:\+)[\d\-\(\) ]{9,}\d/g;
        var valid = re.test($app.store.tetherspecial.phone);

        if(!valid) {
            $app.store.tetherspecial.backendError = {value: 'Phone number is not valid', field: 'phone'};
            return;
        }
        if($app.store.tetherspecial.firstName === '' || $app.store.tetherspecial.lastName === '' || $app.store.tetherspecial.email === '' || !isEmailValid.value || token.value === '') {
            $app.store.tetherspecial.backendError = {value: 'Fill in all the fields', field: 'default'};
            return;
        }
        if(timerStarted.value) {
            return;
        }

        $app.store.tetherspecial.isMainInputDisabled = true;

        const timer = (sec: number) => {
            if(sec <= 0) {
                codeSendBuyText.value = 'Get Confirmation Code';
                timerStarted.value = false;
                return;
            }
            if(sec == 60 * 5) {
                codeSendBuyText.value = "Resend " + 60 * 5 + "s";
            }
            setTimeout(()=>{
                sec -= 1;
                codeSendBuyText.value = "Resend " + sec + "s";
                timer(sec);
            },1000);
        }

        timer(60 * 5);
        timerStarted.value = true;

        const tempPhone = $app.store.tetherspecial.phone.slice(countryCode.value.length+1);
        $app.store.tetherspecial.backendError = {value: '', field: 'default'};
        sendCodeLoading.value = true;

        const initPayload = { first_name: $app.filters.trimSpaceIntoString($app.store.tetherspecial.firstName), last_name: $app.filters.trimSpaceIntoString($app.store.tetherspecial.lastName), email: $app.filters.trimSpaceIntoString($app.store.tetherspecial.email), phone_number: $app.filters.trimSpaceIntoString(tempPhone), phone_number_code: $app.filters.trimSpaceIntoString(countryCode.value) , refcode: $app.filters.trimSpaceIntoString(refCode.value) }

        localStorage.setItem('verifyLinkRedirect', String(router.currentRoute.value.path));

        if($app.store.tetherspecial.signupMethod === SignupMethods.Metamask) {
            initPayload.message = $app.store.registration.metamaskData.metamaskSignatureMessage
            initPayload.signature = $app.store.registration.metamaskData.metamaskSignature
            initPayload.wallet_address = $app.store.registration.metamaskData.metamaskWalletAddress

            await $app.api.eth.auth
            .initMetamask(initPayload)
            .then(() => {
                $app.store.auth.accountMethod = "metamask";
            })
            .catch((e) => {
                $app.store.tetherspecial.isMainInputDisabled = false;
                handleCatch(e);
            })
        } else if($app.store.tetherspecial.signupMethod === SignupMethods.Telegram) {
            initPayload.telegram_data = JSON.stringify($app.store.authTelegram.response);
            $app.api.eth.auth
            .initTelegram(initPayload).then((r: any) => {
                $app.store.auth.accountMethod = "telegram";
            }).catch((e) => {
                handleCatch(e);
            })
        } else if ($app.store.tetherspecial.signupMethod === SignupMethods.Apple) {
            initPayload.apple_token = $app.store.authTemp.response;
            $app.api.eth.auth
            .initApple(initPayload).then((r: any) => {
                $app.store.auth.accountMethod = "apple";
            }).catch((e) => {
                handleCatch(e);
            })
        } else if ($app.store.tetherspecial.signupMethod === SignupMethods.Facebook) {
            initPayload.facebook_id = $app.store.authTemp.response?.userID;
            $app.api.eth.auth
            .initFacebook(initPayload).then((r: any) => {
                $app.store.auth.accountMethod = "facebook";
            }).catch((e) => {
                handleCatch(e);
            })
        } else if ($app.store.tetherspecial.signupMethod === SignupMethods.WalletConnect) {
            initPayload.wallet_connect_data =  JSON.stringify({
                signature: $app.store.registration.walletConnectData.signature,
                address: $app.store.registration.walletConnectData.walletAddress,
                message: $app.store.registration.walletConnectData?.signatureMessage,
            });
            $app.api.eth.auth
            .walletConnectInit(initPayload).then((r: any) => {
                $app.store.auth.accountMethod = "walletConnect";
                $app.store.authTemp.response =  {
                    signature: $app.store.registration.walletConnectData.signature,
                    address: $app.store.registration.walletConnectData.walletAddress,
                    message: $app.store.registration.walletConnectData?.signatureMessage,
                };
            }).catch((e) => {
                handleCatch(e);
            })
        } else {
            initPayload.fast = true;
            await $app.api.eth.auth
            .init(initPayload).then(()=>{
                sendCodeLoading.value = false
                codeSended.value = true;
                $app.store.auth.accountMethod = "email";
            })
            .catch((e) => {
                $app.store.tetherspecial.isMainInputDisabled = false;
                handleCatch(e);
            })
        }
    }
  
    const isSignupAndBuyGoogle = ref(false);

    const signupAndBuyGoogle = () => {
        var re = /(?:\+)[\d\-\(\) ]{9,}\d/g;
        var valid = re.test($app.store.tetherspecial.phone);

        if(!valid) {
            $app.store.tetherspecial.backendError = {value: 'Phone number is not valid', field: 'phone'};
            return;
        }
        if($app.store.tetherspecial.firstName === '' || $app.store.tetherspecial.lastName === '' || $app.store.tetherspecial.email === '' || !isEmailValid.value  || token.value === '') {
            $app.store.tetherspecial.backendError = {value: 'Fill in all the fields', field: 'default'};
            return;
        }

        if(isSignupAndBuyGoogle.value) return;
        isSignupAndBuyGoogle.value = true;

        const tempPhone = $app.store.tetherspecial.phone.slice(countryCode.value.length+1);

        const initPayload = {
            method: $app.store.tetherspecial.signupMethod,
            first_name: $app.filters.trimSpaceIntoString($app.store.tetherspecial.firstName),
            last_name: $app.filters.trimSpaceIntoString($app.store.tetherspecial.lastName),
            email: $app.filters.trimSpaceIntoString($app.store.tetherspecial.email),
            phone_number: $app.filters.trimSpaceIntoString(tempPhone),
            phone_number_code: $app.filters.trimSpaceIntoString(countryCode.value)
        }

        if (refCode.value ) {
            initPayload.ref_code = refCode.value
        }

        if ($app.store.auth.refCode !== "") {
            initPayload.ref_code = $app.store.auth.refCode
            $app.store.auth.setRefCode("");
        }

        $app.api.eth.auth
            .initGoogle(initPayload)
            .then((tokens: any) => {
                $app.store.authGoogle.setResponse({}, SignupMethods.Google);
                handleContinueLogin(tokens);
            })
            .catch((e) => {
                handleCatch(e);
            })

        return;
    }

    // success purchase modal
    const closeModal = () =>{
        $app.store.tetherspecail.isOpenModal = false
    }
    
    return {
        signupToggle,
        handleMetamaskConnect,
        handleGoogleConnect,
        testTG,
        handleAppleConnect,
        handleFacebookConnect,
        handleWalletConnect,
        scrollToSignup,
        scrollToSignupFields,
        emailErrorText,
        emailFieldBlurHandler,
        isEmailValid,
        sendCode,
        token,
        siteKey,
        codeSendBuyText,
        timerStarted,
        countryCode,
        countryChanged,
        signupAndBuyGoogle,
        amountDiscount,
        openTermsModal,
        isUserAuthenticated,
        handleCatch,
        scrollToPurchase,
        handleOpenPurchase,
        investBuySignup,
        investBuy,
        handleContinue,
        closeModal
    }

}