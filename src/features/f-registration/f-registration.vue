<template>
  <div class="f-registration w-full">
      <template v-if="currentStep === Steps.Terms">
          <div class='f-registration__back' @click='$router.back()'>
              <a-icon class='f-registration__back-icon' width='24' :name='Icon.MonoChevronLeft' />
          </div>
          <h3 class="f-registration__title">Sign up</h3>
          <h5 class="f-registration__subtitle">
              If you already have an account, you can
              <nuxt-link to="/personal/login">log in here.</nuxt-link>
          </h5>

          <div class="f-registration__agree">
              <div class="mb-10">
                  <a-checkbox v-model="registrationAgreedUS" id="with_email"
                      label="<p >I declare that I am neither a U.S. citizen nor a resident, nor am I subject to U.S. tax or legal jurisdiction.</p>"
                      single />
              </div>
              <a-checkbox v-model="registrationAgreedTerms" id="with_email1"
                  label="<p>I agree to the <span class='link'>Terms & Conditions</a></p>" @label-click="openTermsModal"
                  single />
          </div>
          <a-button class="f-registration__button" :disabled="termsContinueDisabled" @click="termsContinue"
              text="Continue"></a-button>


      </template>
      <template v-else-if="currentStep === Steps.Choice">
          <div class='f-registration__back' @click='currentStep = Steps.Terms'>
              <a-icon class='f-registration__back-icon' width='24' :name='Icon.MonoChevronLeft' />
          </div>
          <h3 class="f-registration__title">Sign up</h3>
          <h5 class="f-registration__subtitle">
              If you already have an account, you can
              <nuxt-link to="/personal/login">log in here.</nuxt-link>
          </h5>

          <div class="flex flex-col items-center pb-12">
              <div @click="choiceToEmail"
                  class="flex justify-center items-center px-16 py-5 mt-8 max-w-full text-base font-bold text-white whitespace-nowrap bg-blue-600 rounded-lg max-w-[410px] w-full max-md:px-5 cursor-pointer">
                  <div class="flex gap-2 items-center">
                      <NuxtImg src="/img/icons/mono/mail-light.svg" width="18" height="14"
                          class="aspect-square w-[18px]" />
                      <div class="grow">Sign up with Email</div>
                  </div>
              </div>



              <div @click="handleMetamaskConnect"
                  class="flex justify-center items-center px-16 py-5 mt-4 max-w-full text-base font-bold whitespace-nowrap bg-white rounded-lg shadow-sm text-zinc-800 max-w-[410px] w-full max-md:px-5 cursor-pointer">
                  <div class="flex gap-2 items-center">
                      <NuxtImg src="/img/icons/colorful/metamask.svg" width="18" height="18"
                          class="aspect-square w-[18px]" />
                      <div v-if="isMetamaskSupported" class="grow">Sign up with Metamask</div>
                      <div v-else class="grow">Install Metamask Extension</div>
                  </div>
              </div>

              <div v-if="address !== ''">
                  MM Connected : {{ computedAddress }}
                  <button @click="handleDisconnect">Disconnect</button>
                  <br />
                  {{ metamaskError }}
              </div>


              <div
                  class="flex justify-center items-center px-16 py-5 mt-4 max-w-full text-base font-bold whitespace-nowrap bg-white rounded-lg shadow-sm text-zinc-800 max-w-[410px] w-full max-md:px-5">
                  <div class="flex gap-2 items-center">
                      <NuxtImg src="/img/icons/colorful/google.svg" width="18" height="18"
                          class="aspect-square w-[18px]" />
                      <div class="grow">Sign up with Google</div>
                  </div>
              </div>

              <div
                  class="flex justify-center items-center px-16 py-5 mt-4 max-w-full text-base font-bold whitespace-nowrap bg-white rounded-lg shadow-sm text-zinc-800 max-w-[410px] w-full max-md:px-5">
                  <div class="flex gap-2 items-center">
                      <NuxtImg src="/img/icons/mono/apple.svg" width="18" height="18"
                          class="self-start aspect-square w-[18px]" />
                      <div class="grow">Sign up with Apple</div>
                  </div>
              </div>
          </div>


      </template>
      <template v-else-if="currentStep === Steps.Email">
          <div class='f-registration__back' @click='currentStep = Steps.Choice'>
              <a-icon class='f-registration__back-icon' width='24' :name='Icon.MonoChevronLeft' />
          </div>
          <h3 class="f-registration__title">Sign up with Email</h3>
          <h5 class="f-registration__subtitle">
              Enter your details below and press Continue. We will send you a confirmation code shortly.
          </h5>
          <!-- <h5 class="f-registration__subtitle">
              We will send you a confirmation code shortly. If you already have an account, you can
              <nuxt-link to="/personal/login">log in here.</nuxt-link>
          </h5> -->
          <form class="f-registration__form" @submit.prevent="onSubmitEmailForm">

              <a-input v-model="firstName" label="First name" required class="f-registration__name" />
              <a-input v-model="lastName" label="Last name" required class="f-registration__name" />
              <a-input class="f-registration__email" label="Email" validation-reg-exp-key="email" required
                  :error-text="emailErrorText" @blur="emailFieldBlurHandler" @update:is-valid="isEmailValid = $event"
                  v-model="email" />

              <vue-turnstile :site-key="siteKey" v-model="token" class="captchaTurn" />
              <!-- <m-accordion ref="accordionRef" class="f-registration__ref" title="Referral code">
                  <a-input label="Referral code" class="f-registration__ref-code" v-model="refCode" />
                  <a href="/" target="_blank" class="f-registration__ref-link">How to get referral codes</a>
              </m-accordion> -->

              <!-- <div class="f-registration__agree">
                  <a-checkbox v-model="registrationAgreed" id="with_email"
                      label="<p>I agree to the <span class='link'>Terms & Conditions</a></p>"
                      @label-click="openTermsModal" single />
              </div> -->
              <a-button class="f-registration__button" :disabled="emailButtonDisabled" type="submit"
                  text="Continue"></a-button>

              <p class="f-registration__error" v-if="backendError">{{ backendError }}</p>
          </form>
      </template>
      <template v-else-if="currentStep === Steps.Code">
          <div class='f-registration__back' @click='currentStep = Steps.Email'>
              <a-icon class='f-registration__back-icon' width='24' :name='Icon.MonoChevronLeft' />
          </div>
          <h3 class="f-registration__title">
              Enter your <br />
              confirmation code
          </h3>
          <h5 class="f-registration__subtitle">Please enter the 6 digit confirmation code we sent to your email.</h5>

          <a-pincode-input class="f-registration__opt" v-model="emailCode" :error-text="pincodeErrorText"
              :autofocus="true" :number-digits="6" name="pincode" @update:completed="onCodeInput" />
          <p v-show="backendError" class="f-registration__error">{{ backendError }}</p>
          <p v-show="timerStarted" class="f-registration__resend-code">
              You can request the code again via {{ timeLeft }} sec.
          </p>
          <a-button :disabled="timerStarted" class="f-registration__button" text="Resend"
              :loading="pincodeTrigger && !isCodeCorrect" variant="tertiary" @click="resendCodeClick" />

          <a-button class="f-registration__button" :disabled="!isCodeCorrect" @click="() => codeContinue()"
              text="Continue"></a-button>
      </template>
      <template v-else-if="currentStep === Steps.Password">
          <div class='f-registration__back' @click='currentStep = Steps.Code'>
              <a-icon class='f-registration__back-icon' width='24' :name='Icon.MonoChevronLeft' />
          </div>
          <h3 class="f-registration__title">Set your password</h3>
          <h5 class="f-registration__subtitle">Please set a secure password for your account.</h5>

          <form class="f-registration__form" @submit.prevent="onSubmitPasswordForm">

              <a-input class="f-registration__password" label="Password" :type="isPasswordType ? 'password' : 'text'"
                  validation-reg-exp-key="password" required :icon="Icon.MonoEye" iconWithAction
                  @icon-click-handler="passwordIconClickHandler" positionIcon="right" :error-text="passwordErrorText"
                  @blur="passwordFieldBlurHandler" @update:is-valid="isPasswordValid = $event"
                  v-model="password"></a-input>


              <div class="f-registration__password_info">
                  Must include a mix of upper case, lower case, numeric and special character.
              </div>
              <a-button class="f-registration__button" :disabled="!isPasswordValid" type="submit"
                  text="Continue"></a-button>
          </form>
      </template>
      <!--    <template v-else-if="currentStep === Steps.Bonus">-->
      <!--      <div class="f-registration__bonus">-->
      <!--        <div class="f-registration__bonus-wrap">-->
      <!--          <img src="/img/bonus.png" alt="bonus" class="f-registration__bonus-wrap-pic" />-->
      <!--          <div class="f-registration__bonus-wrap-title">$50 Welcome and referral bonus!</div>-->
      <!--          <div class="f-registration__bonus-wrap-text">-->
      <!--            You just earned a $50 bonus for signing up! Your bonus can be accessed in your bonus wallet, and can be-->
      <!--            applied to your ETF purchases.-->
      <!--          </div>-->
      <!--          <a-button class="f-registration__bonus-wrap-btn" @click="getBonus" text="Got it!"></a-button>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--    </template>-->
  </div>
  <e-registration-bonus-modal :confirmData="confirmResponse" v-model="isOpenModal" @accept="getBonus" @close="getBonus" />
  <f-terms-modal v-model="isOpenTermsModal" />
</template>

<script setup lang="ts">
import { useNuxtApp, useRouter, useRoute } from '#app'
import AInput from '~/src/shared/ui/atoms/a-input/a-input.vue'
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
import APincodeInput from '~/src/shared/ui/atoms/a-pincode-input/a-pincode-input.vue'
import ACheckbox from '~/src/shared/ui/atoms/a-checkbox/a-checkbox.vue'
import { computed, ref } from 'vue'
import MAccordion from '~/src/shared/ui/molecules/m-accordion/m-accordion.vue'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import { Icon } from '~/src/shared/constants/icons'
import ERegistrationBonusModal from '~/src/entities/e-registration-bonus-modal/e-registration-bonus-modal.vue'
import FTermsModal from '~/src/features/f-terms-modal/f-terms-modal.vue'
import VueTurnstile from 'vue-turnstile';
import { SiweMessage } from 'siwe';

const { $app } = useNuxtApp()
const router = useRouter()
const route = useRoute()
const token = ref('')
const siteKey = ref(process.dev ? '1x00000000000000000000AA' : '0x4AAAAAAAO0YJKv_riZdNZX')
const enum Steps {
  Terms = 'Terms',
  Choice = 'Choice',
  Email = 'Email',
  Code = 'Code',
  Password = 'Password',
  Bonus = 'Bonus',
}

const currentStep = ref(Steps.Terms)
const backendError = ref('')

const isOpenModal = ref(false)
const accordionRef = ref(null)
const isOpenTermsModal = ref(false)

function openTermsModal() {
  isOpenTermsModal.value = true
}

watch(
  () => currentStep.value,
  (step) => {
      backendError.value = ''
      if (step === Steps.Bonus) {
          isOpenModal.value = true
      }
  },
)

// Terms step
const registrationAgreedUS = ref(false)
const registrationAgreedTerms = ref(false)

const termsContinueDisabled = computed<boolean>(() => {
  return !registrationAgreedUS.value || !registrationAgreedTerms.value
})

const termsContinue = () => {
  currentStep.value = Steps.Choice
}
// Choice step
const choiceToEmail = () => {
  currentStep.value = Steps.Email
}

const isMetamaskSupported = ref(false);
const address = ref("");
const metamaskError = ref("");
const computedAddress = computed(() => address.value.substring(0, 8) + '...');

onMounted(() => {
  isMetamaskSupported.value = typeof (window as any).ethereum !== "undefined";

  (window as any).ethereum.on("chainChanged", (chainId: string) => {
      console.log(chainId);
      if (chainId !== "0x1") {
          metamaskError.value = "This network is not supported. Please change the network to Ethereum."
      } else if (chainId === "0x1") {
          metamaskError.value = "";
      }
  });
})

const handleDisconnect = () => {
  (window as any).ethereum.request({
      method: "wallet_revokePermissions",
      params: [
          {
              eth_accounts: {},
          },
      ],
  });
  address.value = "";
}

const handleMetamaskConnect = async () => {
  //if metamask is not installed
  if (!isMetamaskSupported.value) {
      window.location.href = 'https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn';
      return;
  }

  //get accounts
  (window as any).ethereum.request({ method: "eth_requestAccounts" }).then((accounts: string[]) => {
      address.value = accounts[0];

      //get chain id
      (window as any).ethereum.request({
          "method": "eth_chainId",
          "params": []
      }).then((chainId: string) => {
          // let chainIdDec = parseInt(chainId, 16);

          //switch to eth chain
          (window as any).ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: "0x1" }] }).then(() => {
              const message = new SiweMessage({
                  domain: window.location.host,
                  address: "0x461103cb5Ec52FBc0f20c6a7Ca3Ca5860e11a362", // error with accounts[0] ?
                  statement: "I accept the MetaMask Terms of Service: https://community.metamask.io/tos",
                  uri: window.location.host,
                  version: '1',
                  chainId: 1
              });
              //message.prepareMessage()
              const msg = `${window.location.host} wants you to sign in with your Ethereum account:\n${accounts[0]}\n\nI accept the MetaMask Terms of Service: https://community.metamask.io/tos\n\nURI: https://${window.location.host}\nVersion: 1\nChain ID: 1\nNonce: 32891757\nIssued At: 2021-09-30T16:25:24.000Z`;

              //sign message
              (window as any).ethereum.request({
                  "method": "personal_sign",
                  "params": [
                      msg,
                      accounts[0],
                  ]
              }).then((msg: string) => {
                  console.log("SIGNED MSG", msg);
              }).catch((err: any) => {
                  console.error(err);
              });

          }).catch((err: any) => {
              console.log(err);
          });

      }).catch((err: any) => {
          console.error(err);
      });

  }).catch((err: any) => {
      console.error(err);
  });
}


// Email Field
const firstName = ref('')
const lastName = ref('')
const email = ref('')
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

// Ref code field
const emailCode = ref('')
const pincodeErrorText = ref('')
const refCode = ref('')


const onSubmitEmailForm = async () => {
  backendError.value = ''
  const initPayload = { first_name: $app.filters.trimSpaceIntoString(firstName.value), last_name: $app.filters.trimSpaceIntoString(lastName.value), email: $app.filters.trimSpaceIntoString(email.value) }

  if (refCode.value) {
      initPayload.ref_code = refCode.value
  }

  await $app.api.eth.auth
      .init(initPayload)
      .then(() => {
          currentStep.value = Steps.Code
      })
      .catch((e) => {

          if (e?.errors?.error?.message) {
              backendError.value = e.errors.error.message
          } else {
              backendError.value = 'Something went wrong'
          }
      })
}

const timer = ref<NodeJS.Timer | null>(null)
const timerStarted = ref<boolean>(false)
const timeLeft = ref<number>(0)

const startTimer = () => {
  clearInterval(timer.value)
  const stopDate = Date.now() + 60 * 1000
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
  backendError.value = ''

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
                  backendError.value = e.errors.error.message
              } else {
                  backendError.value = 'Something went wrong'
              }
          })
  }
}

const codeContinue = () => {
  currentStep.value = Steps.Password
}

const resendCodeClick = async () => {
  if (timerStarted.value) {
      return
  }

  backendError.value = ''

  startTimer()

  await $app.api.eth.auth
      .resend({ email: email.value })
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

const confirmResponse = ref(null)

const onSubmitPasswordForm = async () => {
  backendError.value = ''
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
          currentStep.value = Steps.Bonus
      })
      .then(async () => {
          await $app.api.eth.auth.getUser().then((resp) => {
              $app.store.user.info = resp?.data
          })
      })
      .catch((e) => {
          if (e?.errors?.error?.message) {
              backendError.value = e.errors.error.message
          } else {
              backendError.value = 'Something went wrong'
          }
      })
}

// Bonus Step
const getBonus = () => {
  router.push('/personal/analytics')
}

onMounted(() => {
  if (route.query.referral) {
      refCode.value = route.query.referral
      accordionRef.value?.open()
  }
})
</script>

<style lang="scss" src="./f-registration.scss" />

