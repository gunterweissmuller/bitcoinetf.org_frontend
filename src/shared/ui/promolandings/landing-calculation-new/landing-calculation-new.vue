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
    <m-profit-calculator-new></m-profit-calculator-new>
    


    <!-- SIGNUP LAYOUT -->
    <div class="landing-calculation__signup">
      <div class="landing-calculation__signup-title landing-calculation--text-normal">Select Preferred Method of Authentication.</div>
      <div class="landing-calculation__signup-subtitle landing-calculation--text-normal">If you already have an account, you can <nuxt-link class="landing-calculation__signup-subtitle-link" to="/personal/login">log in here</nuxt-link>.</div>
      <div class="landing-calculation__signup-buttons">
        <div @click="() => signupToggle(SignupMethods.Email)" class="landing-calculation__signup-buttons-item" :class="[{'landing-calculation__signup-buttons-item-active': signupMethod === SignupMethods.Email}]">
          <nuxt-img src="/img/icons/colorful/mail-shiny.svg" class="landing-calculation__signup-buttons-item-img" ></nuxt-img>
        </div>

        <div @click="() => signupToggle(SignupMethods.Metamask)" class="landing-calculation__signup-buttons-item"  :class="[{'landing-calculation__signup-buttons-item-active': signupMethod === SignupMethods.Metamask}]">
          <nuxt-img src="/img/icons/colorful/metamask.svg" class="landing-calculation__signup-buttons-item-img"></nuxt-img>
        </div>

        <div @click="() => signupToggle(SignupMethods.Google)" class="landing-calculation__signup-buttons-item"  :class="[{'landing-calculation__signup-buttons-item-active': signupMethod === SignupMethods.Google}]">
          <nuxt-img src="/img/icons/colorful/google.svg" class="landing-calculation__signup-buttons-item-img"></nuxt-img>
        </div>
      </div>
      <div class="landing-calculation__signup-line"></div>

      <template v-if="signupStep === SignupSteps.Signup">
        <div class="landing-calculation__signup-main">
          <vue-turnstile :site-key="siteKey" v-model="token" class="captchaTurn" />

          <a-input-with-button 
            class="landing-calculation__signup-main-input landing-calculation__signup-main-input-email"
            label="Email"
            v-model="email"
            buttonText="Get Confirmation Code"
            validation-reg-exp-key="email"
            :disabled="false"
            required
            :error-text="emailErrorText"
            @blur="emailFieldBlurHandler"
            @update:is-valid="isEmailValid = $event"
          />
          <a-input v-model="codeEmail" label="Email Confirmation Code" required class="landing-calculation__signup-main-input landing-calculation__signup-main-input-code" />
          <a-input v-model="firstName" label="First Name" required class="landing-calculation__signup-main-input landing-calculation__signup-main-input-first-name" />
          <a-input v-model="lastName" label="Last Name" required class="landing-calculation__signup-main-input landing-calculation__signup-main-input-last-name" />
          <!-- <a-input type="tel" v-model="phone" label="Phone Number" required class="landing-calculation__signup-main-input landing-calculation__signup-main-input-phone" /> -->
          
          <vue-tel-input v-model="phone" validCharactersOnly autoFormat :inputOptions="{'showDialCode':true, 'placeholder': 'Phone Number', 'required': true}" ></vue-tel-input>
          <!-- <VueTelInput></VueTelInput> -->

          <div class="landing-calculation__signup-main__agree">
              <div class="mb-10">
                  <a-checkbox v-model="registrationAgreedUS" id="with_email" label="<p >I declare that I am neither a U.S. citizen nor a resident, nor am I subject to U.S. tax or legal jurisdiction.</p>" single />
              </div>
              <a-checkbox v-model="registrationAgreedTerms" id="with_email1" label="<p>I Agree to the <span class='link'>Terms & Conditions</a></p>" @label-click="openTermsModal" single />
          </div>

          <a-button class="landing-calculation__signup-main__button" :disabled="false" @click="termsContinue" text="$1,000 BUY"></a-button>

        </div>
      </template>

      

    </div>

  </div>

  <f-terms-modal v-model="isOpenTermsModal" />
</template>

<script setup lang="ts">
import {ref} from "vue";
import {useNuxtApp} from "#app";
import MProfitCalculator from "~/src/shared/ui/molecules/m-profit-calculator/m-profit-calculator.vue";
import MProfitCalculatorNew from "~/src/shared/ui/molecules/m-profit-calculator-new/m-profit-calculator-new.vue";
import WBuySharesPaymentShort from "~/src/widgets/w-buy-shares-payment-short/w-buy-shares-payment-short.vue";
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

const token = ref('')
const siteKey = ref(window.location.host === 'bitcoinetf.org' ? '0x4AAAAAAAO0YJKv_riZdNZX' : '1x00000000000000000000AA');
onMounted(()=>{
  localStorage.setItem('theme', 'dark');
  $app.store.user.setTheme({theme: 'dark'});
  initializeTronClock()
})
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

const calcAmount = ref(1000)
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
  // Purchase = "Purchase"
}

enum SignupMethods {
  None = "None",
  Email = "Email",
  Metamask = "Metamask",
  Google = "Google",
}

const signupStep = ref(SignupSteps.Default);
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

const email = ref('')
const codeEmail = ref('')
const firstName = ref('')
const lastName = ref('')
const phone = ref(null)

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

</script>

<style lang="scss" src="./landing-calculation-new.scss" />
