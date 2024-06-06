import { useRouter, useRoute } from '#app'
import { SignupMethods } from '~/src/shared/constants/signupMethods'
import { Steps } from './steps'
import { useConnectReplenishmentChannel } from '~/src/app/composables/useConnectReplenishmentChannel'
import { HttpStatusCode } from '~/src/shared/constants/httpStatusCodes'
import { useMetamask } from '~/src/app/composables/useMetamask'
import { useApple } from '~/src/app/composables/useApple'
import { useTelegram } from '~/src/app/composables/useTelegram'
import { useFacebook } from '~/src/app/composables/useFacebook'
import { useWalletConnect } from '~/src/app/composables/useWalletConnect'

export function useLogin($app) {
    const { connectToReplenishment } = useConnectReplenishmentChannel($app)
    const router = useRouter()
    const route = useRoute()
    const {initMetamask} = useMetamask($app);
    const {initApple} = useApple($app); 
    const {initTelegram} = useTelegram($app);
    const {initFacebook} = useFacebook($app);
    const {openWalletConnect} = useWalletConnect($app);

    // Email Field
    const backendError = ref('')
    const emailErrorText = ref('')
    const isEmailValid = ref(false)

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
        
        if ($app.store.login.email) {
            emailErrorText.value = 'Invalid email address'
            return
        }
        
        emailErrorText.value = 'Required'
    }

    // Password Field
    const passwordErrorText = ref('')
    const isPasswordValid = ref(false)

    function passwordFieldBlurHandler() {
        if (isPasswordValid.value) {
            passwordErrorText.value = ''
            return
        }

        passwordErrorText.value = 'Required'
    }

    //

    const continueLogin = async (response) => {
        $app.store.login.currentStep = Steps.Loading;
        $app.store.auth.setTokens(response.data)
        isSubmitEmailForm.value = false

        await $app.api.eth.auth.getUser().then((resp) => {
            $app.store.user.info = resp?.data
        })

        await $app.api.info.blockchainProxy.getUserBlockchainWallet().then((resp) => {
            $app.store.user.blockchainUserWallet = resp?.data.uid
        })

        await $app.store.auth.reInitData()
        connectToReplenishment()
        router.push('/personal/fund/portfolio')

    }

    const catchLogin = (e) => {
        if (e?.errors?.error?.message) {
            backendError.value = e.errors.error.message
        } else {
            backendError.value = 'Something went wrong'
        }

        if (e?.errors === HttpStatusCode.CONFLICT) {
            backendError.value = 'email is already in use'
        }
    }

    const checkAuthType = (type, callBack) => {
        if(type.data.auth_type === 'registration') {
            router.push("/personal/registration");
        } else {
            callBack();
        }
    }

    // login

    const isSubmitEmailForm = ref(false)

    const onSubmitEmailForm = () => {
        if (isSubmitEmailForm.value) return
        isSubmitEmailForm.value = true;

        $app.api.eth.auth
        .login({
            email: $app.filters.trimSpaceIntoString($app.store.login.email),
            password: $app.filters.trimSpaceIntoString($app.store.login.password),
        })
        .then((jwtResponse: any) => {
            isSubmitEmailForm.value = false;
            continueLogin(jwtResponse);
        })
        .catch((e) => {
            isSubmitEmailForm.value = false;
            catchLogin(e);
        })
    }

    // reset

    const goToReset = () => {
        router.push('/personal/reset')
    }

    // login one time link

    const isSubmitOneTimeLink = ref(false)

    const onSubmitOneTimeLink = () => {
        if (isSubmitOneTimeLink.value) return
        isSubmitOneTimeLink.value = true

        $app.api.eth.auth
        .initOneTimeLink({ email: $app.filters.trimSpaceIntoString($app.store.login.email) })
        .then(() => {
            isSubmitOneTimeLink.value = false
            $app.store.login.currentStep = Steps.Check
            startTimer()
        })
        .catch((e) => {
            isSubmitOneTimeLink.value = false;
            catchLogin(e);
        })
    }

    const startTimer = () => {
        
        clearInterval($app.store.login.timer)
        const stopDate = Date.now() + 60 * 6 * 1000
        $app.store.login.timerStarted = true

        $app.store.login.timer = setInterval(() => {
            $app.store.login.timeLeft = parseInt((stopDate - Date.now()) / 1000)
            if ($app.store.login.timeLeft < 1) {
                $app.store.login.timerStarted = false
                clearInterval($app.store.login.timer)
            }
        }, 1000 / 25)
    }

    // resend one time link

    const resendCodeClick = async () => {
        if ($app.store.login.timerStarted) {
            return
        }

        backendError.value = ''
        startTimer()
        await $app.api.eth.auth
            .resendOneTimeLink({ email: $app.store.login.email })
            .catch((e) => {
                catchLogin(e);
            })
    }

    onMounted(() => {
        // login one time link after redirect
        if (route.query.code && route.query.email) {
            router.replace({ query: '' })
            $app.store.login.currentStep = Steps.Loading

            $app.api.eth.auth
            .loginOneTimeLink({
                email: $app.filters.trimSpaceIntoString(route.query.email),
                password: $app.filters.trimSpaceIntoString(route.query.code),
            })
            .then((jwtResponse: any) => {
                // TODO falling user/me
                continueLogin(jwtResponse);
            })
            .catch((e) => {
                $app.store.login.currentStep = Steps.Error;
                catchLogin(e);
            })
        }

        // login google after redirect
        if ($app.store.authGoogle.response?.access_token) {
            $app.store.login.currentStep = Steps.Loading;
            continueLogin({data : $app.store.authGoogle.response})
            $app.store.authGoogle.setResponse({}, SignupMethods.Google);
        }
    })

    // google 
    const handleGoogleConnect = () => {
        $app.api.eth.auth.getGoogleRedirectUrl().then((url: any) => {
            window.location.href = url.url;
        });
    }

    // facebook
    const handleFacebookConnect = async () => {
        const response = await initFacebook();

        console.log(response);

        if (response?.authResponse) {
            console.log("truee")
            $app.store.authTemp.response = response.authResponse;

            $app.api.eth.auth
            .getAuthTypeFacebook({facebook_id: $app.store.authTemp.response?.userID})
            .then(async (res) => {
                const tempLogin = () => {
                    $app.api.eth.auth.
                    loginFacebook({
                        facebook_id: $app.store.authTemp.response?.userID,
                        facebook_data: $app.store.authTemp.response?.accessToken,
                    })
                    .then((jwtResponse: any) => {
                        continueLogin(jwtResponse);
                    })
                }

                checkAuthType(res, tempLogin);
            })
            .catch((e) => {
                // Todo: notify something went wrond
                console.error(e)
            })
        }

    }

    //telegram
    const testTG = async () => {
        let data : any = await initTelegram();

        console.log(data)

        if(data) {
            console.log("TRUE")
            $app.api.eth.auth
            .telegramGetAuthType({
                telegram_data: JSON.stringify(data),
            })
            .then((r: any) => {
                const tempLogin = () => {
                    $app.api.eth.auth
                    .loginTelegram({
                        telegram_data: JSON.stringify(data),
                    })
                    .then((jwtResponse: any) => {
                        continueLogin(jwtResponse);
                    })
                }

                checkAuthType(r, tempLogin);
                $app.store.authTelegram.setResponse({ response: data, method: SignupMethods.Telegram })
            })
            return data
        }
    }

    //apple
    const handleAppleConnect = async () => {
        const data = await initApple();

        $app.api.eth.auth
        .getAppleAuthType({ apple_token: data.authorization.id_token })
        .then(async (res) => {
            const tempLogin = () => {
            $app.api.eth.auth
                .loginApple({
                apple_token: $app.store.authTemp.response,
                })
                .then((jwtResponse: any) => {
                continueLogin(jwtResponse);
                })
            }

            checkAuthType(res, tempLogin);
        })

       
    }

    //metamask
    const handleMetamaskConnect = async () => {
        const {msg,resMsg,signer} = await initMetamask();

        if(msg && resMsg && signer) {
            $app.api.eth.auth
            .loginMetamask({ signature: msg, message: resMsg?.message, wallet_address: signer?.address })
            .then((jwtResponse: any) => {
                // TODO falling user/me
                continueLogin(jwtResponse);
            })
            .catch((e) => {
                catchLogin(e);
            })
        }
    }

    // walletConnect
    const handleWalletConnect = async () => {
        openWalletConnect();
    }

    // methods
    const methods = [
        {
            name: 'Email',
            img: $app.store.user.theme === 'dark' ? '/img/icons/mono/mail-light.svg' : '/img/icons/mono/mail.svg',
            onClick: () => $app.store.login.currentStep = Steps.Login,
        },
        {
            name: 'Metamask',
            img: '/img/icons/colorful/metamask.svg',
            onClick: handleMetamaskConnect,
        },
        {
            name: 'Google',
            img: '/img/icons/colorful/google.svg',
            onClick: handleGoogleConnect,
        },
        {
            name: 'Telegram',
            img: '/img/icons/colorful/telegram3.svg',
            onClick: testTG,
        },
        {
            name: 'Apple',
            img: $app.store.user.theme === 'dark' ? '/img/icons/colorful/apple.svg' : '/img/icons/mono/apple.svg',
            onClick: handleAppleConnect,
        },
        {
            name: 'Facebook',
            img: '/img/icons/colorful/facebook-circle.svg',
            onClick: handleFacebookConnect,
        },
        {
            name: 'WalletConnect',
            img: '/img/icons/colorful/walletConnect.svg',
            onClick: handleWalletConnect,
        },
    ]


    return {
        onSubmitEmailForm,
        emailErrorText,
        emailFieldBlurHandler,
        isEmailValid,
        passwordFieldBlurHandler,
        isPasswordValid,
        backendError,
        goToReset,
        onSubmitOneTimeLink,
        resendCodeClick,
        methods,
        continueLogin,
        checkAuthType
    };
}
