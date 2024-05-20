<template>
  <div class="f-login-new">
    <div class="f-login-new__bg" :class="{ 'f-login-new__bg-dark': $app.store.user.theme === 'dark' }">
      <nuxt-img src="/img/signup/login_bg_new.png"></nuxt-img>
    </div>

    <div class="f-login-new-content f-login-new-content-left">
      <div class="f-login-new-content__logo">
        <nuxt-link to="/" class="w-header-dark__logo">
          <a-icon class="w-aside__logo-icon" :name="Icon.ColorfulBtcDarkLogo" width="140" height="24" />
        </nuxt-link>
      </div>
      <div class="f-login-new-content__title">Passive Income for Smart Investors</div>
      <div class="f-login-new-content__text">Bitcoin ETF that pays dividends: choose to earn USDT or BTC</div>
      <div class="f-login-new-content__bg">
        <nuxt-img src="/img/signup/rocket.png"></nuxt-img>
      </div>
    </div>

    <div class="f-login-new-content f-login-new-content-right">
      <!-- <div class="f-login-new-content__back"></div>
        <div class="f-login-new-content__subtitle">Sign up</div>
        <div class="f-login-new-content__subtext">
          If you already have an account, you can log in here.
        </div> -->

      <div class="f-login-new-content-right-wrapper">
        <div class="f-registration w-full">
          <template v-if="currentStep === Steps.Choice">
            <div class="f-registration__back" @click="$router.back()">
              <a-icon class="f-registration__back-icon" width="24" :name="Icon.MonoChevronLeft" />
            </div>
            <h3 class="f-registration__title">Log in</h3>
            <h5 class="f-registration__subtitle">
              Chose your log in method. If you already have an account, No account?
              <nuxt-link to="/personal/registration">Create an account here.</nuxt-link>
            </h5>

            <div class="flex flex-col items-center pb-12">
              <div v-for="method in methods" @click="method.onClick" class="f-login-new__button">
                <div class="f-login-new__button-left">
                  <NuxtImg
                    :src="method.img"
                    width="24"
                    height="24"
                    class="f-login-new__button-img-method"
                    loading="lazy"
                  />
                  {{ method.name }}
                </div>
                <NuxtImg
                  :src="
                    $app.store.user.theme === 'dark'
                      ? '/img/icons/mono/chevron-grey-right.svg'
                      : '/img/icons/mono/chevron-grey-right.svg'
                  "
                  width="6"
                  height="11"
                  class="f-login-new__button-img-arrow"
                  loading="lazy"
                />
              </div>

              <component :is="'script'" src="https://telegram.org/js/telegram-widget.js?22"></component>
            </div>
          </template>

          <template v-else-if="currentStep === Steps.Login">
            <div class="f-login">
              <div class="f-login__back" @click="currentStep = Steps.Choice">
                <a-icon class="f-login__back-icon" width="24" :name="Icon.MonoChevronLeft" />
              </div>
              <h3 id="test_1" class="f-login__title">Log in</h3>
              <h5 class="f-login__subtitle">
                Please enter your email and password. No account?
                <nuxt-link to="/personal/registration">Create an account here.</nuxt-link>
              </h5>
              <form class="f-login__form" @submit.prevent="onSubmitEmailForm">
                <div id="test_2">
                  <a-input
                    class="f-login__email"
                    label="Email"
                    validation-reg-exp-key="email"
                    required
                    :error-text="emailErrorText"
                    @blur="emailFieldBlurHandler"
                    @update:is-valid="isEmailValid = $event"
                    v-model="email"
                  />
                </div>

                <a-input
                  id="test_3"
                  class="f-login__password"
                  v-model="password"
                  label="Password"
                  type="password"
                  @blur="passwordFieldBlurHandler"
                  @update:is-valid="isPasswordValid = $event"
                  required
                ></a-input>
                <div id="test_4" class="f-login__forgot">
                  <span class="f-login__forgot-text" @click="() => {router.push('/personal/reset')}">Forgot your password?</span>
                </div>
                <a-button
                  id="test_5"
                  class="f-login__button"
                  text="Log in"
                  :disabled="!isEmailValid || !password"
                  type="submit"
                ></a-button>
                <a-button
                  @click="
                    () => {
                      currentStep = Steps.OneTimeLink
                    }
                  "
                  :icon="Icon.MonoLinkBlue"
                  id="one-time-link"
                  class="f-login__button-one-time"
                  text="Sign in with a one-time link"
                  variant="secondary"
                ></a-button>
                <p v-if="backendError" class="f-login__error">{{ $app.filters.capitalize(backendError) }}</p>
              </form>
            </div>
          </template>

          <template v-else-if="currentStep === Steps.OneTimeLink">
            <div class="f-login">
              <div class="f-login__back" @click="currentStep = Steps.Choice">
                <a-icon class="f-login__back-icon" width="24" :name="Icon.MonoChevronLeft" />
              </div>
              <h3 id="test_1" class="f-login__title">Log in with a one-time link</h3>
              <h5 class="f-login__subtitle">
                Enter the verified email address registered with your account, and we’ll send you a link to log in.
              </h5>
              <form class="f-login__form" @submit.prevent="onSubmitOneTimeLink">
                <div id="test_2">
                  <a-input
                    class="f-login__email"
                    label="Email"
                    validation-reg-exp-key="email"
                    required
                    :error-text="emailErrorText"
                    @blur="emailFieldBlurHandler"
                    @update:is-valid="isEmailValid = $event"
                    v-model="email"
                  />
                </div>

                <a-button
                  id="test_5"
                  class="f-login__button"
                  text="Log in"
                  :disabled="!isEmailValid"
                  type="submit"
                ></a-button>
                <p v-if="backendError" class="f-login__error">{{ $app.filters.capitalize(backendError) }}</p>
              </form>
            </div>
          </template>

          <template v-else-if="currentStep === Steps.Check">
            <div class="f-login__wrapper">
              <nuxt-img
                class="f-login__img-done"
                :src="$app.store.user.theme === 'dark' ? '/img/wallet/done-dark.svg' : '/img/wallet/done.svg'"
              ></nuxt-img>
              <h3 id="test_1" class="f-login__title">Check your email for a one-time link</h3>
              <h5 class="f-login__subtitle">
                Check your inbox for a one-time link at {{ email }}. If you don’t see the email, ensure that your email
                address is verified and check your spam folder.
              </h5>
              <a-button
                class="f-login__button"
                :text="timerStarted ? `Resend Link ${timeLeft} sec.` : 'Resend Link'"
                @click="resendCodeClick"
                :disabled="timerStarted"
                variant="tertiary"
              ></a-button>
            </div>
          </template>

          <template v-else-if="currentStep === Steps.Error">
            <div class="f-login__wrapper">
              <!--todo img-->
              <nuxt-img
                class="f-login__img-cloud"
                :src="$app.store.user.theme === 'dark' ? '/img/cloud-error-dark.svg' : '/img/cloud-error.svg'"
              ></nuxt-img>
              <h3 id="test_1" class="f-login__title">Something went wrong!</h3>
              <h5 class="f-login__subtitle">Something must’ve gone wrong, please try again.</h5>
              <a-button class="f-login__button" text="Go back" @click="currentStep = Steps.Choice"></a-button>
            </div>
          </template>

          <template v-else-if="currentStep === Steps.Loading">
            <div class="f-login__wrapper">Loading...</div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNuxtApp, useRouter, useRoute } from '#app'
import AInput from '~/src/shared/ui/atoms/a-input/a-input.vue'
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
import { Icon } from '~/src/shared/constants/icons'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import axios from 'axios'
import { SignupMethods } from '~/src/shared/constants/signupMethods'
import { HttpStatusCode } from '~/src/shared/constants/httpStatusCodes'
import { SiweMessage } from 'siwe'
import { computed, ref } from 'vue'
import { BrowserProvider, parseUnits } from 'ethers'
import { hostname } from '~/src/app/adapters/ethAdapter'
import { useConnectReplenishmentChannel } from '~/src/app/composables/useConnectReplenishmentChannel'

const enum Steps {
  Choice = 'Choice',
  Login = 'Login',
  Loading = 'Loading',
  OneTimeLink = 'OneTimeLink',
  Check = 'Check',
  Error = 'Error',
}

const { $app } = useNuxtApp()
const router = useRouter()
const route = useRoute()
const { connectToReplenishment } = useConnectReplenishmentChannel($app)
const currentLogin = ref(SignupMethods.Email)
const currentStep = ref(Steps.Choice)

// Email Field
const backendError = ref('')
const email = ref(process.dev ? 'emard.roselyn11136@yahoo.com' : '')
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

  if (email.value) {
    emailErrorText.value = 'Invalid email address'
    return
  }

  emailErrorText.value = 'Required'
}

// Password Field
const password = ref(process.dev ? 'k3kLXI0AEykmcJFc3dV44fSNDA6-jjvtiWDWPuT0n7DjzqmYPIm' : '')
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
  isSubmitEmailForm.value = true

  $app.api.eth.auth
    .login({
      email: $app.filters.trimSpaceIntoString(email.value),
      password: $app.filters.trimSpaceIntoString(password.value),
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

// login one time link

const isSubmitOneTimeLink = ref(false)

const onSubmitOneTimeLink = () => {
  if (isSubmitOneTimeLink.value) return
  isSubmitOneTimeLink.value = true

  $app.api.eth.auth
    .initOneTimeLink({ email: $app.filters.trimSpaceIntoString(email.value) })
    .then(() => {
      isSubmitOneTimeLink.value = false
      currentStep.value = Steps.Check
      startTimer()
    })
    .catch((e) => {
      isSubmitOneTimeLink.value = false;
      catchLogin(e);
    })
}

// ?
const isMetamaskSupported = ref(false)
const metamaskError = ref('')

onMounted(() => {
  // login one time link after redirect
  if (route.query.code && route.query.email) {
    router.replace({ query: '' })
    currentStep.value = Steps.Loading

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
        currentStep.value = Steps.Error;
        catchLogin(e);
      })
  }

  // login google after redirect
  if ($app.store.authGoogle.response?.access_token) {
    currentStep.value = Steps.Loading;
    continueLogin({data : $app.store.authGoogle.response})
    $app.store.authGoogle.setResponse({}, SignupMethods.Google);
  }

  // metamask support
  isMetamaskSupported.value = typeof (window as any).ethereum !== 'undefined'
  if (isMetamaskSupported.value) {
    (window as any).ethereum.on('chainChanged', (chainId: string) => {
      if (chainId !== '0x1') {
        metamaskError.value = 'This network is not supported. Please change the network to Ethereum.'
      } else if (chainId === '0x1') {
        metamaskError.value = ''
      }
    })
  } else {
    console.log('Metamask is not installed')
  }
})

// google 
const handleGoogleConnect = () => {
  $app.api.eth.auth.getGoogleRedirectUrl().then((url: any) => {
    currentLogin.value = SignupMethods.Google;
    window.location.href = url.url;
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


const handleFacebookConnect = () => {

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

    // await initFacebook(res?.data?.client_id);

    const sdk = await getFbSdk(
      {
        appId: res?.data?.client_id, //You will need to change this
        cookie: true, // This is important, it's not enabled by default
        version: "v13.0"
      }
    ) //sdk === FB in this case

    console.log(sdk);

    sdk.init(
      {
        appId: res?.data?.client_id, //You will need to change this
        cookie: true, // This is important, it's not enabled by default
        version: "v13.0"
      }
    );

    sdk.login((resp) => {
      console.log(resp);
    });



    (window as any).FB.login(function(response) {
      console.log(response);
      if (response?.authResponse) {
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
    });

  })
  .catch((e) => {
    // Todo: notify something went wrond
    console.error(e)
  })

}

//telegram

const testTG = async () => {

  const dataTelegram = await $app.api.eth.auth.getCredintialsTelegram();
  const telegramBotId = dataTelegram?.data?.bot_id;

  let data = null
  await (window as any).Telegram.Login.init(
    'widget_login',
    telegramBotId,
    { origin: 'https:\/\/core.telegram.org' },
    false,
    'en',
  )

  await (window as any).Telegram.Login.auth({ bot_id: telegramBotId, request_access: true }, (tgData: any) => {
    data = tgData

    if (!tgData) {
      // authorization failed
    } else {
      $app.api.eth.auth
        .telegramGetAuthType({
          telegram_data: JSON.stringify(tgData),
        })
        .then((r: any) => {
          const tempLogin = () => {
            $app.api.eth.auth
              .loginTelegram({
                telegram_data: JSON.stringify(tgData),
              })
              .then((jwtResponse: any) => {
                continueLogin(jwtResponse);
              })
          }

          checkAuthType(r, tempLogin);
          // ? $app.store.authTelegram.setResponse({ response: tgData, method: SignupMethods.Telegram })
        })
    }
  })
  return data
}

//apple
const handleAppleConnect = async () => {

  try {
    const urlApple = await $app.api.eth.auth.getAppleRedirect();

    function getJsonFromUrl(url) {
      if (!url) url = location.search
      var query = url.substr(1).split('?')[1]
      var result = {}
      query.split('&').forEach(function (part) {
        var item = part.split('=')
        result[item[0]] = decodeURIComponent(item[1])
      })
      return result
    }

    const parsedUrl = getJsonFromUrl(urlApple.url);
    
    await (window as any).AppleID.auth.init({
      clientId: parsedUrl?.client_id,
      scope: parsedUrl?.scope,
      redirectURI: parsedUrl?.redirect_uri,
      usePopup: true,
    })

    const data = await (window as any).AppleID.auth.signIn()
    $app.store.authTemp.response = data.authorization.id_token

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
  } catch (error) {
    console.error(error)
  }
}

//metamask
const handleMetamaskConnect = async () => {
  //if metamask is not installed
  if (!isMetamaskSupported.value) {
    window.open('https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn')
    return;
  }

  try {
    const provider = new BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();

    //get accounts
    const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });

    //switch to eth chain
    await (window as any).ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x1' }] });

    // get metamask message
    const resMsg = await $app.api.eth.auth.getMessageMetamask();

    // sign message
    const msg = await (window as any).ethereum.request({method: 'personal_sign', params: [resMsg?.message, accounts[0]]});

    console.log({ signature: msg, message: resMsg?.message, wallet_address: signer?.address })

    $app.api.eth.auth
      .loginMetamask({ signature: msg, message: resMsg?.message, wallet_address: signer?.address })
      .then((jwtResponse: any) => {
        // TODO falling user/me
        continueLogin(jwtResponse);
      })
      .catch((e) => {
        catchLogin(e);
      })

  } catch (e) {
    console.error(e)
  }
}

// methods

const methods = [
  {
    name: 'Email',
    img: $app.store.user.theme === 'dark' ? '/img/icons/mono/mail-light.svg' : '/img/icons/mono/mail.svg',
    onClick: () => currentStep.value = Steps.Login,
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
  // {
  //   name: 'Facebook',
  //   img: '/img/icons/colorful/facebook-circle.svg',
  //   onClick: handleFacebookConnect,
  // },
]

// resend one time link
const timer = ref<NodeJS.Timer | null>(null)
const timerStarted = ref<boolean>(false)
const timeLeft = ref<number>(0)

const startTimer = () => {
  clearInterval(timer.value)
  const stopDate = Date.now() + 60 * 6 * 1000
  timerStarted.value = true

  timer.value = setInterval(() => {
    timeLeft.value = parseInt((stopDate - Date.now()) / 1000)
    if (timeLeft.value < 1) {
      timerStarted.value = false
      clearInterval(timer.value)
    }
  }, 1000 / 25)
}

const resendCodeClick = async () => {
  if (timerStarted.value) {
    return
  }

  backendError.value = ''
  startTimer()
  await $app.api.eth.auth
    .resendOneTimeLink({ email: email.value })
    .catch((e) => {
      catchLogin(e);
    })
}
</script>

<style lang="scss" src="./f-login.scss" />
