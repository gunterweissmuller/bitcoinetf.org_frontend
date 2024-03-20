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
                          class="aspect-square w-[18px]" loading="lazy" />
                      <div class="grow">Sign up with Email</div>
                  </div>
              </div>



              <div @click="handleMetamaskConnect"
                  class="flex justify-center items-center px-16 py-5 mt-4 max-w-full text-base font-bold whitespace-nowrap bg-white rounded-lg shadow-sm text-zinc-800 max-w-[410px] w-full max-md:px-5 cursor-pointer">
                  <div class="flex gap-2 items-center">
                      <NuxtImg src="/img/icons/colorful/metamask.svg" width="18" height="18"
                          class="aspect-square w-[18px]" loading="lazy" />
                      <div v-if="isMetamaskSupported" class="grow">Sign up with Metamask</div>
                      <div v-else class="grow">Install Metamask Extension</div>
                  </div>
              </div>

              <div @click="handleGoogleConnect"
                  class="flex justify-center items-center px-16 py-5 mt-4 max-w-full text-base font-bold whitespace-nowrap bg-white rounded-lg shadow-sm text-zinc-800 max-w-[410px] w-full max-md:px-5 cursor-pointer">
                  <div class="flex gap-2 items-center">
                      <NuxtImg src="/img/icons/colorful/google.svg" width="18" height="18"
                          class="aspect-square w-[18px]" loading="lazy" />
                      <div class="grow">Sign up with Google</div>
                  </div>
              </div>


            <div @click="handleTelegramConnect"
                 class="flex justify-center items-center px-16 py-5 mt-4 max-w-full text-base font-bold whitespace-nowrap bg-white rounded-lg shadow-sm text-zinc-800 max-w-[410px] w-full max-md:px-5 cursor-pointer">
              <div class="flex gap-2 items-center">
                <NuxtImg src="/img/icons/colorful/telegram2.svg" width="18" height="18"
                         class="aspect-square w-[18px]" loading="lazy" />
                <div class="grow">Sign up with Telegram</div>
              </div>
            </div>

            <!-- <component :is="'script'" async src="https://telegram.org/js/telegram-widget.js?22" :data-telegram-login="telegramBotName" data-size="large" :data-auth-url="telegramRedirectUrl" data-request-access="write"></component> -->

              <!--<div
                  class="flex justify-center items-center px-16 py-5 mt-4 max-w-full text-base font-bold whitespace-nowrap bg-white rounded-lg shadow-sm text-zinc-800 max-w-[410px] w-full max-md:px-5">
                  <div class="flex gap-2 items-center">
                      <NuxtImg src="/img/icons/mono/apple.svg" width="18" height="18"
                          class="self-start aspect-square w-[18px]" />
                      <div class="grow">Sign up with Apple</div>
                  </div>
              </div>-->
          </div>


      </template>
      
      <template v-else-if="currentStep === Steps.Email">
          <div class='f-registration__back' @click='handleEmailBack'>
              <a-icon class='f-registration__back-icon' width='24' :name='Icon.MonoChevronLeft' />
          </div>
          <h3 class="f-registration__title">Sign up with {{ currentSignup }}</h3>
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
              <a-input class="f-registration__email" label="Email" validation-reg-exp-key="email" :disabled="currentSignup === SignupMethods.Google ? true : false" required
                  :error-text="emailErrorText" @blur="emailFieldBlurHandler" @update:is-valid="isEmailValid = $event"
                  v-model="email" />

            <div class="f-registration__wrap_phone">
              <vue-tel-input  mode='international' v-on:country-changed="countryChanged" v-model="phone" validCharactersOnly autoFormat :inputOptions="{'showDialCode':true, 'placeholder': 'Phone Number', 'required': true}" ></vue-tel-input>
            </div>

            <vue-turnstile :site-key="siteKey" v-model="token" class="captchaTurn" />
              <!-- <m-accordion ref="accordionRef" class="f-registration__ref" title="Referral code">
                  <a-input label="Referral code" class="f-registration__ref-code" v-model="refCode" />
                  <a href="/" target="_blank" class="f-registration__ref-link">How to get referral codes</a>
              </m-accordion> -->

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
import 'vue-tel-input/vue-tel-input.css';
import { BrowserProvider, parseUnits } from "ethers";
import { googleSdkLoaded, googleLogout  } from "vue3-google-login";
import axios from "axios";
import { SignupMethods } from '~/src/shared/constants/signupMethods'
import { hostname } from '~/src/app/adapters/ethAdapter'
import { document } from 'postcss'

const { $app } = useNuxtApp()
const router = useRouter()
const route = useRoute()
const token = ref('')
const siteKey = ref(window.location.host === 'bitcoinetf.org' ? '0x4AAAAAAAO0YJKv_riZdNZX' : '1x00000000000000000000AA');
const enum Steps {
  Terms = 'Terms',
  Choice = 'Choice',
  Email = 'Email',
  Code = 'Code',
  Password = 'Password',
  Bonus = 'Bonus',
  TelegramSign = 'TelegramSign'
}

const phone = ref(null);
const countryCode = ref(null);

const countryChanged = (country) => {
  // console.log(country, phone);
  countryCode.value = country.dialCode;
}

const confirmResponse = ref(null)

const currentSignup = ref(SignupMethods.Email);
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

const isMetamaskConnecting = ref(false);

const handleMetamaskConnect = async () => {
  // if metamask button is already clicked
  if(isMetamaskConnecting.value) return;
  isMetamaskConnecting.value = true;

  //if metamask is not installed
  if (!isMetamaskSupported.value) {
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

    console.log("SIGNED MSG", signedMsg);
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

  // if($app.store.authTelegram.response?.id) {
  //   currentStep.value = Steps.Email;
  //   currentSignup.value = SignupMethods.Telegram;
  //   firstName.value = $app.store.authTelegram.response.first_name;
  //   lastName.value = $app.store.authTelegram.response.last_name;
  //   email.value = $app.store.authTelegram.response.email;
  // }
});

const handleGoogleDisconnect = () => {
    googleData.value = null;

    googleLogout();
}

const handleGoogleConnect = async () => {
    currentSignup.value = SignupMethods.Google;
    window.location.href = googleUrl.value;
}



const handleTelegramAuth = async () => {

  (window as any).Telegram.Login.auth(
    { bot_id: telegramBotId.value, request_access: true },
    (tgData: any) => {
      console.log(tgData);
      if (!tgData) {
        // authorization failed
      } else {

        console.log(tgData);

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

                  await router.push('/personal/analytics/performance')
                });
          }
        })

        

      }
      
      // Here you would want to validate data like described there https://core.telegram.org/widgets/login#checking-authorization
    }
  );
}

const handleTelegramConnect = async () => {
  axios.get(`https://${hostname}/v1/auth/provider/telegram/credentials`).then((r: any) => {
    console.log(r);
    telegramRedirectUrl.value = r.data.data.redirect_url;
    telegramBotName.value = r.data.data.bot_name;
    telegramBotId.value = r.data.data.bot_id;

    handleTelegramAuth().then((res) => {
      console.log(res);
    })
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
    backendError.value = 'Phone number is not valid';
    return;
  }

  if(isSubmitEmailForm.value) return;
  isSubmitEmailForm.value = true;

  const tempPhone = phone.value.slice(countryCode.value.length+1);

  backendError.value = ''
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

  if (refCode.value ) {
      initPayload.ref_code = refCode.value
  }

  console.log(currentSignup.value, initPayload.ref_code);

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
        currentStep.value = Steps.Bonus
      })
      .then(async () => {
            await $app.api.eth.auth.getUser().then((resp) => {
                $app.store.user.info = resp?.data
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
              backendError.value = e.errors.error.message
          } else {
              backendError.value = 'Something went wrong'
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
        console.log('ww');
        isSubmitEmailForm.value = false;
        currentStep.value = Steps.Code;
    }).catch((e) => {
      isSubmitEmailForm.value = false;
      if (e?.errors?.error?.message) {
        backendError.value = e.errors.error.message
      } else {
        backendError.value = 'Something went wrong'
      }
    })

    return;
  }

  if (currentSignup.value === SignupMethods.Metamask) {
    await $app.api.eth.auth
      .initMetamask(initPayload)
      .then(() => {
        isSubmitEmailForm.value = false;
        currentStep.value = Steps.Code;
      })
      .catch((e) => {
        isSubmitEmailForm.value = false;
        if (e?.errors?.error?.message) {
          backendError.value = e.errors.error.message
        } else {
          backendError.value = 'Something went wrong'
        }
      })
  } else {

    await $app.api.eth.auth
      .init(initPayload)
      .then(() => {
        isSubmitEmailForm.value = false;
        currentStep.value = Steps.Code
      })
      .catch((e) => {
        isSubmitEmailForm.value = false;
        if (e?.errors?.error?.message) {
          backendError.value = e.errors.error.message
        } else {
          backendError.value = 'Something went wrong'
        }
      })
  }
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

const isCodeContinueProcess = ref(false);

const codeContinue = async () => {

  if(isCodeContinueProcess.value) return;
  isCodeContinueProcess.value = true;

  if(currentSignup.value === SignupMethods.Metamask) {
    backendError.value = ''
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
          currentStep.value = Steps.Bonus
        })
        .then(async () => {
          await $app.api.eth.auth.getUser().then((resp) => {
            $app.store.user.info = resp?.data
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
            backendError.value = e.errors.error.message
          } else {
            backendError.value = 'Something went wrong'
          }
        })
  } else if(currentSignup.value === SignupMethods.Telegram) {
    backendError.value = ''
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
        currentStep.value = Steps.Bonus
      })
      .then(async () => {
        await $app.api.eth.auth.getUser().then((resp) => {
          $app.store.user.info = resp?.data
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
          backendError.value = e.errors.error.message
        } else {
          backendError.value = 'Something went wrong'
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

const isSubmitPasswordForm = ref(false);

const onSubmitPasswordForm = async () => {

  if(isSubmitPasswordForm.value) return;
  isSubmitPasswordForm.value = true;

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
          isSubmitPasswordForm.value = false;
          currentStep.value = Steps.Bonus
      })
      .then(async () => {
          await $app.api.eth.auth.getUser().then((resp) => {
              $app.store.user.info = resp?.data
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
      $app.store.auth.setRefCode({ref_code: route.query.referral});
      refCode.value = route.query.referral
      accordionRef.value?.open()
  }
})
</script>

<style lang="scss" src="./f-registration.scss" />

