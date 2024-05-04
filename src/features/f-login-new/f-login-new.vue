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

      <!-- old -->

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
                Please enter your email and password to get started. No account?
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
                  <span class="f-login__forgot-text" @click="onForgotPasswordClick">Forgot your password?</span>
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

const { $app } = useNuxtApp()
const router = useRouter()
const route = useRoute()

const { connectToReplenishment } = useConnectReplenishmentChannel($app)

const enum Steps {
  Choice = 'Choice',
  Login = 'Login',
  Loading = 'Loading',
  OneTimeLink = 'OneTimeLink',
  Check = 'Check',
  Error = 'Error',
}
const currentLogin = ref(SignupMethods.Email)
const currentStep = ref(Steps.Choice)

// Choice step

const choiceToEmail = () => {
  currentStep.value = Steps.Login
}

// Email Field
const backendError = ref('')
const email = ref(process.dev ? 'emard.roselyn11136@yahoo.com' : '')
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
      $app.store.auth.setTokens(jwtResponse.data)
    })
    .then(async () => {
      isSubmitEmailForm.value = false

      await $app.api.eth.auth.getUser().then((resp) => {
        $app.store.user.info = resp?.data
      })

      await $app.store.auth.reInitData()
      console.log('from here')
      router.push('/personal/fund/portfolio')
    })
    .catch((e) => {
      isSubmitEmailForm.value = false
      if (e?.errors?.error?.message) {
        backendError.value = e.errors.error.message
      } else {
        backendError.value = 'Something went wrong'
      }

      if (e?.errors === HttpStatusCode.CONFLICT) {
        backendError.value = 'email is already in use'
      }
    })
}

const isSubmitOneTimeLink = ref(false)

const onSubmitOneTimeLink = () => {
  if (isSubmitOneTimeLink.value) return
  isSubmitOneTimeLink.value = true

  $app.api.eth.auth
    .initOneTimeLink({ email: $app.filters.trimSpaceIntoString(email.value) })
    .then((res: any) => {
      console.log('res', res)
      isSubmitOneTimeLink.value = false
      currentStep.value = Steps.Check
      startTimer()
    })
    .catch((e) => {
      isSubmitOneTimeLink.value = false
      if (e?.errors?.error?.message) {
        backendError.value = e.errors.error.message
      } else {
        backendError.value = 'Something went wrong'
      }
    })
}

// google

const googleUrl = ref('')

const isMetamaskSupported = ref(false)
const address = ref('')
const metamaskError = ref('')
const computedAddress = computed(() => address.value.substring(0, 8) + '...')

onMounted(() => {
  // one time link

  if (route.query.code && route.query.email) {
    email.value = String(route.query.email)
    const pass = String(route.query.code)

    router.replace({ query: '' })

    currentStep.value = Steps.Loading

    // email

    $app.api.eth.auth
      .loginOneTimeLink({
        email: $app.filters.trimSpaceIntoString(email.value),
        password: $app.filters.trimSpaceIntoString(pass),
      })
      .then((jwtResponse: any) => {
        // TODO falling user/me
        $app.store.auth.setTokens(jwtResponse.data)
      })
      .then(async () => {
        await $app.api.eth.auth.getUser().then((resp) => {
          $app.store.user.info = resp?.data
        })

        const aAid = window.localStorage.getItem('PAPVisitorId')
        if (aAid) {
          $app.api.eth.auth
            .papSignUp({
              payload: {
                pap_id: aAid,
                utm_label: window.localStorage.getItem('a_utm'),
              },
            })
            .then((r: any) => {
              //window.localStorage.removeItem('a_aid');
              //window.localStorage.removeItem('a_utm');
            })
        }

        await $app.api.info.blockchainProxy.getUserBlockchainWallet().then((resp) => {
          $app.store.user.blockchainUserWallet = resp?.data.uid
        })
      })
      .then(async () => {
        await $app.store.auth.reInitData()
        connectToReplenishment()
        router.push('/personal/fund/portfolio')
      })
      .catch((e) => {
        currentStep.value = Steps.Error
        if (e?.errors?.error?.message) {
          backendError.value = e.errors.error.message
        } else {
          backendError.value = 'Something went wrong'
        }
      })
  }

  // metamask

  isMetamaskSupported.value = typeof (window as any).ethereum !== 'undefined'

  if (isMetamaskSupported.value) {
    ;(window as any).ethereum.on('chainChanged', (chainId: string) => {
      console.log(chainId)
      if (chainId !== '0x1') {
        metamaskError.value = 'This network is not supported. Please change the network to Ethereum.'
      } else if (chainId === '0x1') {
        metamaskError.value = ''
      }
    })
  } else {
    console.log('Metamask is not installed')
  }

  axios.get(`https://${hostname}/v1/auth/provider/google-auth/redirect-url`).then((url: any) => {
    googleUrl.value = url.data.url //.replace("https%3A%2F%2Ffront.stage.techetf.org", "http%3A%2F%2Flocalhost:3000");
  })

  if ($app.store.authGoogle.response?.access_token) {
    currentStep.value = Steps.Loading

    $app.store.auth.setTokens($app.store.authGoogle.response)
    $app.store.authGoogle.setResponse({}, SignupMethods.Google)
    $app.api.eth.auth.getUser().then((resp) => {
      $app.store.user.info = resp?.data
    })

    $app.store.auth.reInitData()
    router.push('/personal/analytics/performance')
  }
})

const handleGoogleConnect = () => {
  currentLogin.value = SignupMethods.Google
  window.location.href = googleUrl.value
}

//telegram

const telegramRedirectUrl = ref('')
const telegramBotName = ref('')
const telegramBotId = ref('')

const handleTelegramAuth = async () => {
  ;(window as any).Telegram.Login.auth({ bot_id: telegramBotId.value, request_access: true }, (tgData: any) => {
    console.log(tgData)
    if (!tgData) {
      // authorization failed
    } else {
      console.log(tgData)

      $app.api.eth.auth
        .telegramGetAuthType({
          telegram_data: JSON.stringify(tgData),
        })
        .then((r: any) => {
          if (r.data.auth_type === 'registration') {
            $app.store.authTelegram.setResponse({ response: tgData, method: SignupMethods.Telegram })
            router.push('/personal/registration')
          } else {
            $app.api.eth.auth
              .loginTelegram({
                telegram_data: JSON.stringify(tgData),
              })
              .then((jwtResponse: any) => {
                $app.store.auth.setTokens(jwtResponse.data)
              })
              .then(async () => {
                await $app.api.eth.auth.getUser().then((resp) => {
                  $app.store.user.info = resp?.data
                })
                connectToReplenishment()
                router.push('/personal/fund/portfolio')
              })
          }
        })
    }

    // Here you would want to validate data like described there https://core.telegram.org/widgets/login#checking-authorization
  })
}

onMounted(() => {
  axios.get(`https://${hostname}/v1/auth/provider/telegram/credentials`).then((r: any) => {
    console.log(r)
    telegramRedirectUrl.value = r.data.data.redirect_url
    telegramBotName.value = r.data.data.bot_name
    telegramBotId.value = r.data.data.bot_id
  })
})

const testTG = async () => {
  let data = null
  await (window as any).Telegram.Login.init(
    'widget_login',
    telegramBotId.value,
    { origin: 'https:\/\/core.telegram.org' },
    false,
    'en',
  )

  await (window as any).Telegram.Login.auth({ bot_id: telegramBotId.value, request_access: true }, (tgData: any) => {
    data = tgData
    console.log(tgData)

    if (!tgData) {
      // authorization failed
    } else {
      console.log(tgData)

      $app.api.eth.auth
        .telegramGetAuthType({
          telegram_data: JSON.stringify(tgData),
        })
        .then((r: any) => {
          if (r.data.auth_type === 'registration') {
            $app.store.authTelegram.setResponse({ response: tgData, method: SignupMethods.Telegram })
            router.push('/personal/registration')
          } else {
            $app.api.eth.auth
              .loginTelegram({
                telegram_data: JSON.stringify(tgData),
              })
              .then((jwtResponse: any) => {
                $app.store.auth.setTokens(jwtResponse.data)
              })
              .then(async () => {
                await $app.api.eth.auth.getUser().then((resp) => {
                  $app.store.user.info = resp?.data
                })

                connectToReplenishment()
                router.push('/personal/fund/portfolio')
              })
          }
        })
    }

    // Here you would want to validate data like described there https://core.telegram.org/widgets/login#checking-authorization
  })
  return data
}

const handleTelegramConnect = () => {
  axios.get(`https://${hostname}/v1/auth/provider/telegram/credentials`).then((r: any) => {
    console.log(r)
    telegramRedirectUrl.value = r.data.data.redirect_url
    telegramBotName.value = r.data.data.bot_name
    telegramBotId.value = r.data.data.bot_id

    handleTelegramAuth().then((res) => {
      console.log(res)
    })
  })
}

//apple

onMounted(() => {
  $app.api.eth.auth
    .getAppleRedirect()
    .then(async (res) => {
      console.log(res)

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

      const parsedUrl = getJsonFromUrl(res.url)

      console.log(parsedUrl, window.AppleID)
      ;(window as any).AppleID.auth.init({
        clientId: parsedUrl.client_id,
        scope: parsedUrl.scope,
        redirectURI: parsedUrl.redirect_uri,
        usePopup: true,
      })
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
    console.log('test123', data)

    $app.store.authTemp.response = data.authorization.id_token

    console.log($app.store.authTemp.response, $app.api.eth.auth)

    $app.api.eth.auth
      .getAppleAuthType({ apple_token: data.authorization.id_token })
      .then(async (res) => {
        console.log(res)

        if (res.data.auth_type === 'registration') {
          router.push('/personal/registration')
        } else {
          //todo login apple request

          $app.api.eth.auth
            .loginApple({
              apple_token: $app.store.authTemp.response,
            })
            .then((jwtResponse: any) => {
              $app.store.auth.setTokens(jwtResponse.data)
            })
            .then(async () => {
              await $app.api.eth.auth.getUser().then((resp) => {
                $app.store.user.info = resp?.data
              })

              connectToReplenishment()
              router.push('/personal/fund/portfolio')
            })
        }
      })
      .catch((e) => {
        // Todo: notify something went wrond
        console.error(e)
      })
  } catch (error) {
    // Handle error.
    console.error(error)
  }
}

//metamask

const metamaskSignatureMessage = ref('')
const metamaskSignature = ref('')
const metamaskWalletAddress = ref('')

const handleMetamaskConnect = async () => {
  //if metamask is not installed
  if (!isMetamaskSupported.value) {
    // window.location.href = 'https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn';
    window.open('https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn')
    return
  }

  //currentSignup.value = SignupMethods.Metamask;

  //get accounts
  ;(window as any).ethereum
    .request({ method: 'eth_requestAccounts' })
    .then((accounts: string[]) => {
      address.value = accounts[0]

      //get chain id
      ;(window as any).ethereum
        .request({
          method: 'eth_chainId',
          params: [],
        })
        .then((chainId: string) => {
          // let chainIdDec = parseInt(chainId, 16);

          //switch to eth chain
          ;(window as any).ethereum
            .request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x1' }] })
            .then(async () => {
              axios
                .get(`https://${hostname}/v1/auth/provider/metamask/message`)
                .then(async (res: any) => {
                  metamaskSignatureMessage.value = res.data.message

                  const provider = new BrowserProvider((window as any).ethereum)
                  const signer = await provider.getSigner()
                  metamaskWalletAddress.value = signer.address

                  const message = new SiweMessage({
                    domain: window.location.host,
                    address: signer.address, // error with accounts[0] ?
                    statement: res.data.message,
                    uri: window.location.origin,
                    version: '1',
                    chainId: 1,
                  })
                  //message.prepareMessage()

                  const msg = `${window.location.host} wants you to sign in with your Ethereum account:\n${accounts[0]}\n\nI accept the MetaMask Terms of Service: https://community.metamask.io/tos\n\nURI: ${window.location.origin}\nVersion: 1\nChain ID: 1\nNonce: 32891757\nIssued At: 2021-09-30T16:25:24.000Z`

                  //sign message
                  ;(window as any).ethereum
                    .request({
                      method: 'personal_sign',
                      params: [
                        //   msg,
                        res.data.message,
                        accounts[0],
                      ],
                    })
                    .then((msg: string) => {
                      console.log('SIGNED MSG', msg)
                      metamaskSignature.value = msg
                      $app.api.eth.auth
                        .loginMetamask({ signature: msg, message: res.data.message, wallet_address: signer.address })
                        .then((jwtResponse: any) => {
                          // TODO falling user/me
                          $app.store.auth.setTokens(jwtResponse.data)
                          //confirmResponse.value = jwtResponse.data
                          //currentStep.value = Steps.Bonus
                        })
                        .then(async () => {
                          await $app.api.eth.auth.getUser().then((resp) => {
                            $app.store.user.info = resp?.data
                          })

                          $app.store.auth.reInitData()
                          router.push('/personal/analytics/performance')
                        })
                        .catch((e) => {
                          if (e?.errors?.error?.message) {
                            backendError.value = e.errors.error.message
                          } else {
                            backendError.value = 'Something went wrong'
                          }
                        })
                      //currentStep.value = Steps.Email;
                    })
                    .catch((err: any) => {
                      console.error(err)
                    })
                })
                .catch((err: any) => {
                  console.log(err)
                })
            })
            .catch((err: any) => {
              console.log(err)
            })
        })
        .catch((err: any) => {
          console.error(err)
        })
    })
    .catch((err: any) => {
      console.error(err)
    })
}

const onForgotPasswordClick = () => {
  router.push('/personal/reset')
}

// methods

const methods = [
  {
    name: 'Email',
    img: $app.store.user.theme === 'dark' ? '/img/icons/mono/mail-light.svg' : '/img/icons/mono/mail.svg',
    onClick: choiceToEmail,
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
    .then(() => {
      // currentStep.value = Steps.Password
    })
    .catch((e) => {
      if (e?.errors?.error?.message) {
        backendError.value = e.errors.error.message
      } else {
        backendError.value = 'Something went wrong'
      }
    })
}
</script>

<style lang="scss" src="./f-login-new.scss" />
