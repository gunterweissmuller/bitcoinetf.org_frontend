<template>
  <div class="landing-calculation">
    <div class="landing-calculation__preferences" v-if="!isFiatLanding">
      <div class="landing-calculation__preferences-box">
        <a-icon :name="Icon.ColorfulLangindrocket"/>
        <div class="landing-calculation__preferences-title">Your Investment Deserves More!</div>
        <div class="landing-calculation__preferences-description">With<a-icon :name="Icon.ColorfulUsdttron"/>USDT, not only do you enjoy seamless transactions, but now you also get more out of your investment!</div>
      </div>
      <div class="landing-calculation__preferences-box">
        <a-icon :name="Icon.ColorfulLandingshield"/>
        <div class="landing-calculation__preferences-title">Safe, Secure, and Rewarding</div>
        <div class="landing-calculation__preferences-description">Trust in the safety of your investments with us. Along with robust security, enjoy the added benefit of a substantial bonus.</div>
      </div>
      <div class="landing-calculation__preferences-box">
        <a-icon :name="Icon.ColorfulLandingtimer"/>
        <div class="landing-calculation__preferences-title">Time is Ticking! Act Now!</div>
        <div class="landing-calculation__preferences-description">This exclusive offer is only available for a short period. Don't miss out on this opportunity!</div>
      </div>
    </div>
    <div class="landing-calculation__fiat" v-if="isFiatLanding">
      <div class="landing-calculation__fiat-wrapper">
        <h1>Уважаемые российские инвесторы!</h1>
        <p>Мы, команда Bitcoin ETF, приложили значительные усилия, чтобы, несмотря на беспрецедентные политические и регуляторные трудности, предоставить вам возможность приобрести Bitcoin ETF одновременно с инвесторами по всему миру.<br><br>К сожалению, текущее решение влечет за собой дополнительные издержки: из-за валютных различий и комиссий платёжных систем P2P, поддерживающих карты "МИР" для международных транзакций, <span>наши российские клиенты столкнутся с комиссией в размере 5%.</span><br><br>        Мы рекомендуем вам <nuxt-link to="/tetherspecial">воспользоваться</nuxt-link> нашим методом оплаты через стейблкоин USDT. При такой форме оплаты мы не взимаем комиссию, и вы мгновенно получите бонус в размере до
          {{ $app.store.user.statistic?.trc_bonus?.percent }}% от суммы вашего депозита.<br><br>Благодарим за внимание!<br><br>С уважением,<br><b>Команда Bitcoin ETF</b></p>
      </div>
    </div>

    <!-- JOURNEY LAYOUT -->
    <!-- <m-profit-calculator :hiddenBottomButton="true" :visibleTronLabel="isFiatLanding" @calculator-amount="calcAmountUpdated" @refCode="refcodeUpdated" :is-fiat="isFiatLanding"/> -->
    <m-profit-calculator-new :isUserAuth="isUserAuth" :isInputDisbled="purchaseStep == PurchaseSteps.Purchase" :openPurchase="investBuy" :openSignup="investBuySignup" @calculator-amount="calcAmountUpdated" @refCode="refcodeUpdated"></m-profit-calculator-new>



    <!-- SIGNUP LAYOUT -->
    <div  class="landing-calculation__signup">

      <div v-if="!isUserAuth">
        <div class="landing-calculation__signup-title landing-calculation--text-normal">Select Preferred Method of Authentication.</div>
        <div class="landing-calculation__signup-subtitle landing-calculation--text-normal">If you already have an account, you can <nuxt-link class="landing-calculation__signup-subtitle-link" to="/personal/login">log in here</nuxt-link>.</div>
        <div class="landing-calculation__signup-buttons">
          <div @click="() => signupToggle(SignupMethods.Email)" class="landing-calculation__signup-buttons-item" :class="[{'landing-calculation__signup-buttons-item-active': signupMethod === SignupMethods.Email}]">
            <nuxt-img src="/img/icons/colorful/mail-shiny.svg" class="landing-calculation__signup-buttons-item-img" ></nuxt-img>
          </div>

          <div @click="() => handleMetamaskConnect()" class="landing-calculation__signup-buttons-item"  :class="[{'landing-calculation__signup-buttons-item-active': signupMethod === SignupMethods.Metamask}]">
            <nuxt-img src="/img/icons/colorful/metamask.svg" class="landing-calculation__signup-buttons-item-img"></nuxt-img>
          </div>

          <div @click="() => handleGoogleConnect()" class="landing-calculation__signup-buttons-item"  :class="[{'landing-calculation__signup-buttons-item-active': signupMethod === SignupMethods.Google}]">
            <nuxt-img src="/img/icons/colorful/google.svg" class="landing-calculation__signup-buttons-item-img"></nuxt-img>
          </div>

          <!-- <div @click="() => handleTelegramConnect()" class="landing-calculation__signup-buttons-item"  :class="[{'landing-calculation__signup-buttons-item-active': signupMethod === SignupMethods.Telegram}]">
            <nuxt-img src="/img/icons/colorful/telegram3.svg" class="landing-calculation__signup-buttons-item-img"></nuxt-img>
          </div>
          <component :is="'script'" async src="https://telegram.org/js/telegram-widget.js?22"></component> -->
        </div>
        <div class="landing-calculation__signup-line"></div>
      </div>

      
      <template v-if="signupStep === SignupSteps.TelegramButton">
        <h3 class="f-registration__title">Sign up with Telegram</h3>
        <h5 class="f-registration__subtitle">
        </h5>

        <div class="flex flex-col items-center pb-12">
          <component :is="'script'" async src="https://telegram.org/js/telegram-widget.js?22" :data-telegram-login="telegramBotName" data-size="large" :data-auth-url="telegramRedirectUrl" data-request-access="write"></component>
        </div>
      </template>
      <template v-else-if="signupStep === SignupSteps.Signup">
        <div class="landing-calculation__signup-main">
          <vue-turnstile :site-key="siteKey" v-model="token" class="captchaTurn" />
          <a-input bgColor="tetherspecial" :disabled="dataDisabled || isMainInputDisabled" v-model="firstName" label="First Name" required class="landing-calculation__signup-main-input landing-calculation__signup-main-input-first-name" />
          <a-input bgColor="tetherspecial" :disabled="dataDisabled || isMainInputDisabled" v-model="lastName" label="Last Name" required class="landing-calculation__signup-main-input landing-calculation__signup-main-input-last-name" />
          <vue-tel-input :disabled="dataDisabled || isMainInputDisabled"  mode='international' v-on:country-changed="countryChanged" v-model="phone" validCharactersOnly autoFormat :inputOptions="{'showDialCode':true, 'placeholder': 'Phone Number', 'required': true}" ></vue-tel-input>

          <a-input-with-button
            bgColor="tetherspecial"
            class="landing-calculation__signup-main-input landing-calculation__signup-main-input-email"
            label="Email"
            v-model="email"
            :buttonText="codeSendText"
            :buttonClick="() => {sendCode()}"
            validation-reg-exp-key="email"
            :disabled="dataDisabled"
            required
            :error-text="emailErrorText"
            @blur="emailFieldBlurHandler"
            @update:is-valid="isEmailValid = $event"
          />
          <a-input bgColor="tetherspecial" :disabled="dataDisabled" v-model="codeEmail" label="Email Confirmation Code" class="landing-calculation__signup-main-input landing-calculation__signup-main-input-code" />
          <p class="landing-calculation__error" v-if="backendError">{{ backendError }}</p>

          <div class="landing-calculation__signup-main__agree">
              <div class="mb-10">
                  <a-checkbox v-model="registrationAgreedUS" id="with_email" label="<p >I declare that I am neither a U.S. citizen nor a resident, nor am I subject to U.S. tax or legal jurisdiction.</p>" single />
              </div>
              <a-checkbox v-model="registrationAgreedTerms" id="with_email1" label="<p>I Agree to the <span class='link'>Terms & Conditions</a></p>" @label-click="openTermsModal" single />
          </div>

          <a-button class="landing-calculation__signup-main__button" :disabled="!registrationAgreedUS || !registrationAgreedTerms || buyAmount === 0 || isSignupAndBuy || buyAmountOriginal < 100" @click="signupAndBuy" :text=" '$' + buyAmountOriginal + ' BUY'"></a-button>
        </div>
      </template>

      <template v-if="signupStep === SignupSteps.Google">
        <div class="landing-calculation__signup-main">
          <vue-turnstile :site-key="siteKey" v-model="token" class="captchaTurn" />

          <a-input
            bgColor="tetherspecial"
            class="landing-calculation__signup-main-input landing-calculation__signup-main-input-email"
            label="Email"
            v-model="email"
            validation-reg-exp-key="email"
            :disabled="true"
            required
          />
          <a-input bgColor="tetherspecial" :disabled="dataDisabled" v-model="firstName" label="First Name" required class="landing-calculation__signup-main-input landing-calculation__signup-main-input-first-name" />
          <a-input bgColor="tetherspecial" :disabled="dataDisabled" v-model="lastName" label="Last Name" required class="landing-calculation__signup-main-input landing-calculation__signup-main-input-last-name" />
          <vue-tel-input :disabled="dataDisabled"  mode='international' v-on:country-changed="countryChanged" v-model="phone" validCharactersOnly autoFormat :inputOptions="{'showDialCode':true, 'placeholder': 'Phone Number', 'required': true}" ></vue-tel-input>
          <p class="landing-calculation__error" v-if="backendError">{{ backendError }}</p>

          <div class="landing-calculation__signup-main__agree">
              <div class="mb-10">
                  <a-checkbox v-model="registrationAgreedUS" id="with_email" label="<p >I declare that I am neither a U.S. citizen nor a resident, nor am I subject to U.S. tax or legal jurisdiction.</p>" single />
              </div>
              <a-checkbox v-model="registrationAgreedTerms" id="with_email1" label="<p>I Agree to the <span class='link'>Terms & Conditions</a></p>" @label-click="openTermsModal" single />
          </div>

          <a-button class="landing-calculation__signup-main__button" :disabled="!registrationAgreedUS || !registrationAgreedTerms || buyAmount === 0 || isSignupAndBuyGoogle || buyAmountOriginal < 100" @click="signupAndBuyGoogle" :text=" '$' + buyAmountOriginal + ' BUY'"></a-button>
        </div>
      </template>

      <div class="w-buy-shares-payment-short-new"></div>
      <template v-if="purchaseStep === PurchaseSteps.Purchase">
        <w-buy-shares-payment-short-new v-if="isUserAuthenticated" :calc-value-original="buyAmountOriginal" :calc-value="buyAmount" :is-fiat="isFiatLanding"/>

        <div class="langing-calculation__chat" v-if="width > 767">
          <iframe src="https://secure.livechatinc.com/licence/16652127/open_chat.cgi"></iframe>
        </div>
        <div class="w-buy-shares-payment__divider">Or</div>
        <div class="langing-calculation__processWith">
          <span>Proceed with</span>
          <nuxt-link to="/tetherspecial" v-if="isFiatLanding">
            <a-icon :name="Icon.ColorfulUsdttron" class="langing-calculation__processWith--tron"/>
          </nuxt-link>
          <nuxt-link to="/weloverussia" v-if="!isFiatLanding">
            <a-icon :name="Icon.ColorfulVisawhite"/>
            <a-icon :name="Icon.ColorfulMastercard"/>
          </nuxt-link>
        </div>
      </template>


    </div>

  </div>

  <f-terms-modal v-model="isOpenTermsModal" />
  <e-registration-bonus-modal
    :confirmData="confirmResponse"
    v-model="isOpenModal"
    @close="closeModal"
    :onComplete="scrollToPurchase"
  />
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
import {useNuxtApp, useRouter, useRoute} from "#app";
import MProfitCalculator from "~/src/shared/ui/molecules/m-profit-calculator/m-profit-calculator.vue";
import MProfitCalculatorNew from "~/src/shared/ui/molecules/m-profit-calculator-new/m-profit-calculator-new.vue";
import WBuySharesPaymentShortNew from "~/src/widgets/w-buy-shares-payment-short-new/w-buy-shares-payment-short-new.vue";
import {Icon} from "~/src/shared/constants/icons";
import AIcon from "~/src/shared/ui/atoms/a-icon/a-icon.vue";
import VueWriter from 'vue-writer'
import { useWindowSize } from '@vueuse/core'
import VueTurnstile from 'vue-turnstile';
import AInput from '~/src/shared/ui/atoms/a-input/a-input.vue'
import AInputWithButton from '~/src/shared/ui/atoms/a-input-with-button/a-input-with-button.vue'
import FTermsModal from '~/src/features/f-terms-modal/f-terms-modal.vue'
import ACheckbox from '~/src/shared/ui/atoms/a-checkbox/a-checkbox.vue'
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
import aInputPhoneCountry from "../../atoms/a-input-phone-country/a-input-phone-country.vue";
import 'vue-tel-input/vue-tel-input.css';
import ERegistrationBonusModal from "~/src/entities/e-registration-bonus-modal/e-registration-bonus-modal.vue";
import axios from "axios";
import { hostname } from '~/src/app/adapters/ethAdapter'
import { BrowserProvider, parseUnits } from "ethers";

const router = useRouter()
const route = useRoute()
const { $app } = useNuxtApp()
const { width } = useWindowSize()
const props = withDefaults(
  defineProps<{
    isFiatLanding: boolean
  }>(),
  {
    isFiatLanding: false,
  },
)

const isUserAuth = computed(()=>{
  return $app.store.auth?.refreshToken ? true : false;
});


const isMetamaskSupported = ref(false);
const address = ref("");
const metamaskError = ref("");
const computedAddress = computed(() => address.value.substring(0, 8) + '...');


const token = ref('')
const siteKey = ref(window.location.host === 'bitcoinetf.org' ? '0x4AAAAAAAO0YJKv_riZdNZX' : '1x00000000000000000000AA');
onMounted(()=>{
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

  localStorage.setItem('theme', 'dark');
  $app.store.user.setTheme({theme: 'dark'});
  initializeTronClock()
})

// watch(
//   () => (window as any).ethereum,
//   () => {
//     isMetamaskSupported.value = typeof (window as any).ethereum !== "undefined";
//     console.log("NEWWW", isMetamaskSupported.value);
//   }
// )

const discountPercent = $app.store.user.statistic?.trc_bonus?.percent ? $app.store.user.statistic?.trc_bonus?.percent : 5;

console.log("Percent", discountPercent);

const isMetamaskConnecting = ref(false);
const metamaskSignatureMessage = ref('');
const metamaskSignature = ref('');
const metamaskWalletAddress = ref('');
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

  //currentSignup.value = SignupMethods.Metamask;

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
    //currentStep.value = Steps.Email;
    signupStep.value = SignupSteps.Signup;
    signupMethod.value = SignupMethods.Metamask;

  } catch (e) {
    console.error(e);
    isMetamaskConnecting.value = false;
  }

}

// const buyAmount = ref(localStorage.getItem('investmentAmount') == null || localStorage.getItem('investmentAmount') == undefined || isNaN(Number(localStorage.getItem('investmentAmount'))) ? 2500 : Number(localStorage.getItem('investmentAmount')));
const defaultBuyAmount = $app.store.user.investAmount - ($app.store.user.investAmount/100)*discountPercent;
const buyAmount = ref(isNaN(defaultBuyAmount) ? 100 : defaultBuyAmount);
const buyAmountOriginal = ref($app.store.user.investAmount);
// tether special discount 5%

watch(
  () => $app.store.user.investAmount,
  (newValue) => {
    buyAmountOriginal.value = newValue;
    const tempValue = newValue-(newValue/100)*discountPercent;

    if(isNaN(tempValue)) {
      buyAmount.value = 100;
    } else {
      buyAmount.value = tempValue;
    }
  }
)

const backendError = ref('')

function getTimeTron() {
  let createdDate = $app.filters.dayjs($app.store.user.statistic?.trc_bonus?.decrease)
  const nowDate = $app.filters.dayjs()
  let total = createdDate.diff(nowDate, 'minutes') - new Date().getTimezoneOffset()
  const minutes = Math.floor((total) % 60);
  const hours = Math.floor((total / 60) % 24);
  const days = Math.floor(total / (60 * 24));

  return {
    total,
    days,
    hours,
    minutes
  };
}
const tronTimerDays = ref(0)
const tronTimerHours = ref(0)
const tronTimerMinutes = ref(0)
function initializeTronClock() {
  let timeinterval = null
  function updateClockTron() {
    const t = getTimeTron();

    tronTimerDays.value = ('0' + t.days).slice(-2);
    tronTimerHours.value = ('0' + t.hours).slice(-2);
    tronTimerMinutes.value = ('0' + t.minutes).slice(-2);

    if (t.total <= 0) {
      if (timeinterval) {
        clearInterval(timeinterval);
      }
    }
  }

  updateClockTron();
  timeinterval = setInterval(updateClockTron, 30000);
}

// const calcAmount = ref(2500)
const calcAmount = ref(($app.store.user.investAmount.original !== 0 && $app.store.user.investAmount.original) ? $app.store.user.investAmount.original : 2500);
const calcAmountUpdated = (e) =>{
  calcAmount.value = e
}
const isUserAuthenticated = computed(() => {
  return $app.store.auth.isUserAuthenticated
})
const refCode = ref('')
const refcodeUpdated = (e) => {
  refCode.value = e
}
const scrollToChat = () =>{
  if (window.innerWidth > 767) {
    const element = document.querySelector(".landing-calculation__chat");
    let headerOffset
    if (window.innerWidth < 768) {
      headerOffset = 155;
    } else {
      headerOffset = 155;

    }
    const elementPosition = element.offsetTop;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  } else {
    window?.LiveChatWidget.call('maximize')
  }
}

// sign up

enum SignupSteps {
  Default = "Default",
  Signup = "Signup",
  Google = "Google",
  TelegramButton = 'TelegramButton',
}

enum PurchaseSteps {
  Default = "Default",
  Purchase = "Purchase",
}

enum SignupMethods {
  None = "None",
  Email = "Email",
  Metamask = "Metamask",
  Google = "Google",
  Telegram = "Telegram",
}

const signupStep = ref(SignupSteps.Default);
const purchaseStep = ref(PurchaseSteps.Default);
const signupMethod = ref(SignupMethods.None);

const signupToggle = (method: any) => {
  if(signupStep.value === SignupSteps.Default) {
      signupStep.value = SignupSteps.Signup;
      signupMethod.value = method;
  } else {

    if(method === signupMethod.value) {
      signupStep.value = SignupSteps.Default;
      signupMethod.value = SignupMethods.None;
    } else {
      signupStep.value = SignupSteps.Signup;
      signupMethod.value = method;
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

const investBuySignup = () => {
  signupStep.value = SignupSteps.Signup;
  signupMethod.value = SignupMethods.Email;
  scrollToSignup();
}

const investBuy = async () => {

  if(buyAmountOriginal.value < 100) return

  signupStep.value = SignupSteps.Default;
  signupMethod.value = SignupMethods.None;
  purchaseStep.value = PurchaseSteps.Purchase;
  scrollToPurchase();

  await $app.api.eth.auth.getUser().then((resp) => {
    $app.store.user.info = resp?.data
  })

  await $app.api.info.blockchainProxy.getUserBlockchainWallet().then((resp) => {
    $app.store.user.blockchainUserWallet = resp?.data.uid
  })

  console.log($app.store.user?.info?.account?.uuid)

}



const scrollToPurchase = () => {
  // const element = document.querySelector(".w-buy-shares-payment");
  const element = document.querySelector(".w-buy-shares-payment-short-new");
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
const codeEmail = ref('')
const firstName = ref('')
const lastName = ref('')
const phone = ref(null);
const countryCode = ref(null);

const dataDisabled = ref(false);

const countryChanged = (country) => {
  // console.log(country, phone);
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
const registrationAgreedUS = ref(false)
const registrationAgreedTerms = ref(false)
const isOpenTermsModal = ref(false)

function openTermsModal() {
  isOpenTermsModal.value = true
}

// signup / google

const googleData : any = ref();
const googleUrl = ref("");

onMounted(() => {
  axios.get(`https://${hostname}/v1/auth/provider/google-auth/redirect-url`).then((url: any) => {
    googleUrl.value = url.data.url //.replace("https%3A%2F%2Ffront.stage.techetf.org", "http%3A%2F%2Flocalhost:3000");
  });

  console.log($app.store.authGoogle);

  if($app.store.authGoogle.response?.email) {
    signupStep.value = SignupSteps.Google;
    signupMethod.value = SignupMethods.Google;
    firstName.value = $app.store.authGoogle.response.first_name;
    lastName.value = $app.store.authGoogle.response.last_name;
    email.value = $app.store.authGoogle.response.email;

    scrollToSignup()
  }

});

const telegramRedirectUrl = ref('')
const telegramBotName = ref('')
const currentStep = ref('')
const isTelegramConnection = ref(false);


const handleTelegramAuth = async () => {
(window as any).Telegram.Login.auth(
  { bot_id: '6888906996', request_access: true },
  (tgData: any) => {
    console.log(tgData);
    if (!tgData) {
      // authorization failed
      isTelegramConnection.value = true;
    } else {

      console.log(tgData);

      $app.api.eth.auth.telegramGetAuthType({
        telegram_data: JSON.stringify(tgData),
      }).then((r: any) => {
        if(r.data.auth_type === 'registration') {
          $app.store.authTelegram.setResponse({response: tgData, method: SignupMethods.Telegram});

          //registration
          signupStep.value = SignupSteps.Signup;
          signupMethod.value = SignupMethods.Telegram;
          firstName.value = $app.store.authTelegram.response.first_name;
          lastName.value = $app.store.authTelegram.response.last_name;
          email.value = $app.store.authTelegram.response.email;

          // currentStep.value = Steps.Email;
          // currentSignup.value = SignupMethods.Telegram;
          // firstName.value = $app.store.authTelegram.response.first_name;
          // lastName.value = $app.store.authTelegram.response.last_name;
          // email.value = $app.store.authTelegram.response.email;
          // router.push("/personal/registration");
        } else {
          $app.api.eth.auth.
            loginTelegram({
              telegram_data: JSON.stringify(tgData),
            })
              .then((jwtResponse: any) => {
                $app.store.auth.setTokens(jwtResponse.data)
                confirmResponse.value = jwtResponse.data;
              })
              .then(async () => {
                await $app.api.eth.auth.getUser().then((resp) => {
                  $app.store.user.info = resp?.data
                  //purchase
                  purchaseStep.value = PurchaseSteps.Purchase;
                });

                // await router.push('/personal/analytics/performance')
              });
        }
      }).catch((err) => {
        console.error(err);
        isTelegramConnection.value = true;
      })

      

    }
    
    // Here you would want to validate data like described there https://core.telegram.org/widgets/login#checking-authorization
  }
);
}


const handleTelegramConnect = async () => {

  if(isTelegramConnection.value) return;
  isTelegramConnection.value = true;

  axios.get(`https://${hostname}/v1/auth/provider/telegram/credentials`).then((r: any) => {

    telegramRedirectUrl.value = r.data.data.redirect_url;
    telegramBotName.value = r.data.data.bot_name;

    handleTelegramAuth().then((res) => {
      console.log(res);
      // signupStep.value = SignupSteps.TelegramButton;
    })


    //console.log(r);

  })
}

const handleGoogleConnect = async () => {
  localStorage.setItem('googleRedirect', router.currentRoute.value.fullPath)
  window.location.href = googleUrl.value;
}



const sendCodeLoading = ref(false)
const codeSended = ref(false);
const timerStarted = ref(false);
const codeSendText = ref('Get Confirmation Code');
const codeSendedText = ref('Resend');
const isMainInputDisabled = ref(false);



const sendCode = async () => {
  var re = /(?:\+)[\d\-\(\) ]{9,}\d/g;
  var valid = re.test(phone.value);

  if(!valid) {
    backendError.value = 'Phone number is not valid';
    return;
  }
  if(firstName.value === '' || lastName.value === '' || email.value === '' || !isEmailValid || token.value === '') {
    backendError.value = 'Fill in all the fields';
    return;
  }
  if(timerStarted.value) {
    return;
  }

  isMainInputDisabled.value = true;
  
  const timer = (sec: number) => {
    if(sec <= 0) {
      codeSendText.value = 'Get Confirmation Code';
      timerStarted.value = false;
      return;
    }

    if(sec == 30) {
      codeSendText.value =  "Resend " + 30 + "s";
    }
    setTimeout(()=>{
      sec -= 1;
      codeSendText.value =  "Resend " + sec + "s";
      timer(sec);
    },1000);
  }

  timer(30);
  timerStarted.value = true;

  const tempPhone = phone.value.slice(countryCode.value.length+1);
  backendError.value = '';
  sendCodeLoading.value = true;

  const initPayload = { first_name: $app.filters.trimSpaceIntoString(firstName.value), last_name: $app.filters.trimSpaceIntoString(lastName.value), email: $app.filters.trimSpaceIntoString(email.value), phone_number: $app.filters.trimSpaceIntoString(tempPhone), phone_number_code: $app.filters.trimSpaceIntoString(countryCode.value) , refcode: $app.filters.trimSpaceIntoString(refCode.value) }

  if(signupMethod.value === SignupMethods.Metamask) {
    initPayload.message = metamaskSignatureMessage.value
    initPayload.signature = metamaskSignature.value
    initPayload.wallet_address = metamaskWalletAddress.value

    await $app.api.eth.auth
      .initMetamask(initPayload)
      .then(() => {
        //isSubmitEmailForm.value = false;
        //currentStep.value = Steps.Code;
      })
      .catch((e) => {
        //isSubmitEmailForm.value = false;
        isMainInputDisabled.value = false;
        if (e?.errors?.error?.message) {
          backendError.value = e.errors.error.message
        } else {
          backendError.value = 'Something went wrong'
        }
      })
  } else if(signupMethod.value === SignupMethods.Telegram) {

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

  } else {

  await $app.api.eth.auth
    .init(initPayload).then(()=>{
      sendCodeLoading.value = false
      codeSended.value = true
    })
    .catch((e) => {
      isMainInputDisabled.value = false;
      console.error("ERROR", e);
      if (e?.errors?.error?.message) {
        if (e.errors.error.code === 'ETF:011002') {
          //email is already in use
          router.push('/personal/login')
        }
      }
    })
  }
}

const isOpenModal = ref(false)
const closeModal = () =>{
  isOpenModal.value = false
}

const confirmResponse = ref(null)
const isSignupAndBuy = ref(false);

const signupAndBuy = async () => {

  if(isSignupAndBuy.value) return;
  isSignupAndBuy.value = true;

  backendError.value = ''

  if(signupMethod.value === SignupMethods.Metamask) {
    await $app.api.eth.auth.
    confirmMetamask({
      email: $app.filters.trimSpaceIntoString(email.value),
      code: $app.filters.trimSpaceIntoString(codeEmail.value),
      fast: true,
    })
      .then((jwtResponse: any) => {
        // TODO falling user/me
        $app.store.auth.setTokens(jwtResponse.data)
        confirmResponse.value = jwtResponse.data
        // isOpenModal.value = true;
        dataDisabled.value = true;
      })
      .then(async () => {
        await $app.api.eth.auth.getUser().then((resp) => {
          $app.store.user.info = resp?.data
          console.log("$app.store.user.info", $app.store.user.info);
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
        purchaseStep.value = PurchaseSteps.Purchase;
        


        if (props.isFiat) {
        //   console.log("TRUE IS FIAT");
          await $app.api.eth.billingEth
            .buyShares({
              amount: 1000,
              dividends: false,
              referral: false,
              bonus: false,
            })
            .then(({ data }) => {
              if (data) {
                router.replace({
                  query: { replenishment: data.uuid }
                })
                $app.store.user.buyShares = data
              }
            })
        }
      })
      .catch((e) => {
        if (e?.errors?.error?.message) {
          backendError.value = e.errors.error.message
        } else {
          backendError.value = 'Something went wrong'
        }
      })
  } else if (signupMethod.value === SignupMethods.Telegram) {

    backendError.value = ''
    await $app.api.eth.auth.
      confirmTelegram({
        telegram_data: JSON.stringify($app.store.authTelegram.response),
        email: $app.filters.trimSpaceIntoString(email.value),
        code: $app.filters.trimSpaceIntoString(codeEmail.value),
      })
      .then((jwtResponse: any) => {
        // TODO falling user/me
        $app.store.auth.setTokens(jwtResponse.data);
        confirmResponse.value = jwtResponse.data;
        // isOpenModal.value = true;
        dataDisabled.value = true;
      })
      .then(async () => {
        await $app.api.eth.auth.getUser().then((resp) => {
          $app.store.user.info = resp?.data;
          purchaseStep.value = PurchaseSteps.Purchase;
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
    await $app.api.eth.auth
      .confirmFast({
        email: $app.filters.trimSpaceIntoString(email.value),
        code: $app.filters.trimSpaceIntoString(codeEmail.value),
      })
      .then((jwtResponse: any) => {
        // TODO falling user/me
        $app.store.auth.setTokens(jwtResponse.data)
        confirmResponse.value = jwtResponse.data
        // isOpenModal.value = true;
        dataDisabled.value = true;
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
        purchaseStep.value = PurchaseSteps.Purchase;
        console.log("UUID123", $app.store.user?.info?.account?.uuid)

        if (props.isFiat) {
        //   console.log("TRUE IS FIAT");
          await $app.api.eth.billingEth
            .buyShares({
              amount: 1000,
              dividends: false,
              referral: false,
              bonus: false,
            })
            .then(({ data }) => {
              if (data) {
                router.replace({
                  query: { replenishment: data.uuid }
                })
                $app.store.user.buyShares = data
              }
            })
        }
      })
      .catch((e) => {
        isSignupAndBuy.value = false;
        if (e?.errors?.error?.message) {
          backendError.value = e.errors.error.message
        } else {
          backendError.value = 'Something went wrong'
        }
      })
  }

}

const isSignupAndBuyGoogle = ref(false);

const signupAndBuyGoogle = () => {

  if(isSignupAndBuyGoogle.value) return;
  isSignupAndBuyGoogle.value = true;

  var re = /(?:\+)[\d\-\(\) ]{9,}\d/g;
  var valid = re.test(phone.value);

  if(!valid) {
    backendError.value = 'Phone number is not valid';
    isSignupAndBuyGoogle.value = false;
    return;
  }

  if(firstName.value === '' || lastName.value === '' ) {
    backendError.value = 'Fill in all the fields';
    isSignupAndBuyGoogle.value = false;
    return;
  }

  const tempPhone = phone.value.slice(countryCode.value.length+1);

  const initPayload = {
    method: signupMethod.value,
    first_name: $app.filters.trimSpaceIntoString(firstName.value),
    last_name: $app.filters.trimSpaceIntoString(lastName.value),
    email: $app.filters.trimSpaceIntoString(email.value),
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

  console.log(initPayload);

  $app.api.eth.auth
    .initGoogle(initPayload)
    .then((tokens: any) => {
      $app.store.auth.setTokens(tokens.data)
      $app.store.authGoogle.setResponse({}, SignupMethods.Google);
      confirmResponse.value = tokens.data
      // isSignupAndBuyGoogle.value = false;
      // firstName.value = '';
      // lastName.value = '';
      // email.value = '';
      dataDisabled.value = true;
      // isOpenModal.value = true;
      scrollToPurchase();
    })
    .then(async () => {
        await $app.api.eth.auth.getUser().then((resp) => {
            $app.store.user.info = resp?.data
            purchaseStep.value = PurchaseSteps.Purchase;

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

        await $app.api.info.blockchainProxy.getUserBlockchainWallet().then((resp) => {
          $app.store.user.blockchainUserWallet = resp?.data.uid
        })
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

</script>

<style lang="scss" src="./landing-calculation-new.scss" />
