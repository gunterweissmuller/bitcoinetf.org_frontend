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
    <m-profit-calculator-new :isUserAuth="isUserAuth" :isInputDisbled="purchaseStep == PurchaseSteps.Purchase" :openPurchase="investBuy" :openSignup="investBuySignup" @calculator-amount="calcAmountUpdated" @refCode="refcodeUpdated" :disabled-amount="isSignupAndBuy"></m-profit-calculator-new>



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

          <div @click="testTG" class="landing-calculation__signup-buttons-item"  :class="[{'landing-calculation__signup-buttons-item-active': signupMethod === SignupMethods.Telegram}]">
            <nuxt-img src="/img/icons/colorful/telegram3.svg" class="landing-calculation__signup-buttons-item-img"></nuxt-img>
          </div>

          <div @click="handleAppleConnect" class="landing-calculation__signup-buttons-item"  :class="[{'landing-calculation__signup-buttons-item-active': signupMethod === SignupMethods.Apple}]">
            <nuxt-img src="/img/icons/colorful/apple.svg" class="landing-calculation__signup-buttons-item-img"></nuxt-img>
          </div>

          <div @click="handleFacebookConnect" class="landing-calculation__signup-buttons-item"  :class="[{'landing-calculation__signup-buttons-item-active': signupMethod === SignupMethods.Facebook}]">
            <nuxt-img src="/img/icons/colorful/facebook-circle.svg" class="landing-calculation__signup-buttons-item-img"></nuxt-img>
          </div>

          <div @click="handleWalletConnect" class="landing-calculation__signup-buttons-item"  :class="[{'landing-calculation__signup-buttons-item-active': signupMethod === SignupMethods.WalletConnect}]">
            <nuxt-img src="/img/icons/colorful/walletConnect.svg" class="landing-calculation__signup-buttons-item-img"></nuxt-img>
          </div>

        </div>
        <div class="landing-calculation__signup-line"></div>
      </div>

      <template v-if="signupStep === SignupSteps.Signup">
        <div class="landing-calculation__signup-main">
          <vue-turnstile :theme="'dark'" :site-key="siteKey" v-model="token" class="captchaTurn" />
          <a-input bgColor="tetherspecial" :disabled="dataDisabled || isMainInputDisabled" v-model="firstName" label="First Name" required class="landing-calculation__signup-main-input landing-calculation__signup-main-input-first-name" />
          <p class="landing-calculation__error" v-if="backendError.value && backendError.field === 'first_name'">{{ backendError.value }}</p>

          <a-input bgColor="tetherspecial" :disabled="dataDisabled || isMainInputDisabled" v-model="lastName" label="Last Name" required class="landing-calculation__signup-main-input landing-calculation__signup-main-input-last-name" />
          <p class="landing-calculation__error" v-if="backendError.value && backendError.field === 'last_name'">{{ backendError.value }}</p>

          <vue-tel-input :disabled="dataDisabled || isMainInputDisabled"  mode='international' v-on:country-changed="countryChanged" v-model="phone" validCharactersOnly autoFormat :inputOptions="{'showDialCode':true, 'placeholder': 'Phone Number', 'required': true}" ></vue-tel-input>
          <p class="landing-calculation__error" v-if="backendError.value && backendError.field === 'phone'">{{ backendError.value }}</p>

          <!-- <a-input-with-button
            bgColor="tetherspecial"
            class="landing-calculation__signup-main-input landing-calculation__signup-main-input-email"
            label="Email"
            v-model="email"
            :buttonText="codeSendText"
            :buttonClickEnable="Boolean(email) && isEmailValid"
            :buttonClick="() => {sendCode()}"
            validation-reg-exp-key="email"
            :disabled="dataDisabled || isEmailDisabled"
            required
            :error-text="emailErrorText"
            @blur="emailFieldBlurHandler"
            @update:is-valid="isEmailValid = $event"
          /> -->

          <a-input
            bgColor="tetherspecial"
            class="landing-calculation__signup-main-input landing-calculation__signup-main-input-email"
            label="Email"
            v-model="email"
            validation-reg-exp-key="email"
            :disabled="dataDisabled || isEmailDisabled"
            required
            :error-text="emailErrorText"
            @blur="emailFieldBlurHandler"
            @update:is-valid="isEmailValid = $event"
          />
          <!--<a-input bgColor="tetherspecial" :disabled="dataDisabled" v-model="codeEmail" label="Email Confirmation Code" class="landing-calculation__signup-main-input landing-calculation__signup-main-input-code" />-->
          <p class="landing-calculation__error" v-if="backendError.value && backendError.field === 'default'">{{ backendError.value }}</p>

          <div class="landing-calculation__signup-main__agree">
              <div class="mb-10">
                  <a-checkbox v-model="registrationAgreedUS" id="with_email" label="<p >I declare that I am neither a U.S. citizen nor a resident, nor am I subject to U.S. tax or legal jurisdiction.</p>" single />
              </div>
              <a-checkbox v-model="registrationAgreedTerms" id="with_email1" label="<p>I Agree to the <span class='link'>Terms & Conditions</a></p>" @label-click="openTermsModal" single />
          </div>

          <a-button class="landing-calculation__signup-main__button" :disabled="!registrationAgreedUS || !registrationAgreedTerms || buyAmount === 0 || isSignupAndBuy || buyAmountOriginal < 100 || timerStarted || firstName === '' || lastName === '' || email === '' || phone === '' || !isEmailValid" @click="sendCode" :text="codeSendBuyText"></a-button> <!--signupAndBuy-->
          <div class="landing-calculation__error-message">
            <p v-if="buyAmountOriginal < 100">The minimum investment amount must be at least 100</p>
          </div>
        </div>
      </template>

      <template v-if="signupStep === SignupSteps.Google">
        <div class="landing-calculation__signup-main">
          <vue-turnstile :theme="'dark'" :site-key="siteKey" v-model="token" class="captchaTurn" />

          <a-input
            bgColor="tetherspecial"
            class="landing-calculation__signup-main-input landing-calculation__signup-main-input-email"
            label="Email"
            v-model="email"
            validation-reg-exp-key="email"
            :disabled="true"
            required
            :error-text="emailErrorText"
            @blur="emailFieldBlurHandler"
            @update:is-valid="isEmailValid = $event"
          />
          <a-input bgColor="tetherspecial" :disabled="dataDisabled" v-model="firstName" label="First Name" required class="landing-calculation__signup-main-input landing-calculation__signup-main-input-first-name" />
          <p class="landing-calculation__error" v-if="backendError.value && backendError.field === 'first_name'">{{ backendError.value }}</p>

          <a-input bgColor="tetherspecial" :disabled="dataDisabled" v-model="lastName" label="Last Name" required class="landing-calculation__signup-main-input landing-calculation__signup-main-input-last-name" />
          <p class="landing-calculation__error" v-if="backendError.value && backendError.field === 'last_name'">{{ backendError.value }}</p>

          <vue-tel-input :disabled="dataDisabled"  mode='international' v-on:country-changed="countryChanged" v-model="phone" validCharactersOnly autoFormat :inputOptions="{'showDialCode':true, 'placeholder': 'Phone Number', 'required': true}" ></vue-tel-input>
          <p class="landing-calculation__error" v-if="backendError.value && backendError.field === 'phone'">{{ backendError.value }}</p>

          <div class="landing-calculation__signup-main__agree">
              <div class="mb-10">
                  <a-checkbox v-model="registrationAgreedUS" id="with_email" label="<p >I declare that I am neither a U.S. citizen nor a resident, nor am I subject to U.S. tax or legal jurisdiction.</p>" single />
              </div>
              <a-checkbox v-model="registrationAgreedTerms" id="with_email1" label="<p>I Agree to the <span class='link'>Terms & Conditions</a></p>" @label-click="openTermsModal" single />
          </div>

          <p class="landing-calculation__error" v-if="backendError.value && backendError.field === 'default'">{{ backendError.value }}</p>

          <a-button class="landing-calculation__signup-main__button" :disabled="!registrationAgreedUS || !registrationAgreedTerms || buyAmount === 0 || isSignupAndBuyGoogle || buyAmountOriginal < 100 || firstName === '' || lastName === '' || email === '' || phone === ''" @click="signupAndBuyGoogle" :text=" '$' + $app.filters.rounded(buyAmount, 0) + ' BUY'"></a-button>
          <div class="landing-calculation__error-message">
            <p v-if="buyAmountOriginal < 100">The minimum investment amount must be at least 100</p>
          </div>
        </div>
      </template>
      <template v-if="signupStep === SignupSteps.Loading">
        <div class="landing-calculation__loading-wrapper">
          <m-loading-new v-show="true" />
        </div>
      </template>

      <template v-if="signupStep === SignupSteps.Error">
        <div class="landing-calculation__wrapper">
          <p class="landing-calculation__error" v-if="backendError.value && backendError.field === 'default'">{{ backendError.value }}</p>
          <a-button @click="() => router.go(0)" text="Try Again" variant="tertiary"></a-button>
        </div>
      </template>

      <div class="w-buy-shares-payment-short-tether"></div>
      <template v-if="purchaseStep === PurchaseSteps.Purchase">
        <w-buy-shares-payment-short-tether
          v-if="isUserAuthenticated"
          :calc-value-original="buyAmountOriginal"
          :calc-value="buyAmount"
          :is-fiat="isFiatLanding"
        />

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
            <NuxtImg src="/img/icons/colorful/visawhite.svg" class="w-[64px]" />
            <NuxtImg src="/img/icons/colorful/mastercard.svg" class="w-[64px]" />
            <!--<a-icon :name="Icon.ColorfulVisawhite"/>
            <a-icon :name="Icon.ColorfulMastercard"/>-->
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
import WBuySharesPaymentShortTether from "~/src/widgets/w-buy-shares-payment-short-tether/w-buy-shares-payment-short-tether.vue";
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
import { LocationQueryRaw } from '#vue-router';
import { useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/vue'
import mLoadingNew from '../../molecules/m-loading-new/m-loading-new.vue';

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

  // if verify link

  if (route.query.code && route.query.email) {
    email.value = String(route.query.email);
    codeEmail.value = String(route.query.code);

    router.replace({'query': ''});

    signupStep.value = SignupSteps.Loading;

    if($app.store.auth.accountMethod === 'metamask') {

      $app.api.eth.auth.
        confirmMetamask({
        email: $app.filters.trimSpaceIntoString(email.value),
        code: $app.filters.trimSpaceIntoString(codeEmail.value),
        fast: true,
      })
        .then((jwtResponse: any) => {
          // TODO falling user/me
          $app.store.auth.setTokens(jwtResponse.data)
          confirmResponse.value = jwtResponse.data

        })
        .then(async () => {
          await $app.api.eth.auth.getUser().then((resp) => {
            $app.store.user.info = resp?.data
          });

          signupStep.value = SignupSteps.Default;
          purchaseStep.value = PurchaseSteps.Purchase;
          scrollToPurchase();

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
            backendError.value = {value: e.errors.error.message, field: 'default'}

            if(e?.errors?.error?.validation) {
              if(e?.errors?.error?.validation?.first_name) {
                backendError.value = {value: e?.errors?.error?.validation?.first_name[0], field: 'first_name'};
              }
              if(e?.errors?.error?.validation?.last_name) {
                backendError.value = {value: e?.errors?.error?.validation?.last_name[0], field: 'last_name'};
              }
            }
          } else {
            backendError.value = {value: 'Something went wrong', field: 'default'}
          }
        })

    } else if ($app.store.auth.accountMethod === 'telegram') {
      $app.api.eth.auth.
      confirmTelegram({
        telegram_data: JSON.stringify($app.store.authTelegram?.response),
        email: $app.filters.trimSpaceIntoString(email.value),
        code: $app.filters.trimSpaceIntoString(codeEmail.value),
      })
      .then((jwtResponse: any) => {
        // TODO falling user/me
        $app.store.auth.setTokens(jwtResponse.data)
        confirmResponse.value = jwtResponse.data

      })
      .then(async () => {
        await $app.api.eth.auth.getUser().then((resp) => {
          $app.store.user.info = resp?.data
        });

        signupStep.value = SignupSteps.Default;
        purchaseStep.value = PurchaseSteps.Purchase;
        scrollToPurchase();

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
            backendError.value = {value: e.errors.error.message, field: 'default'}

            if(e?.errors?.error?.validation) {
              if(e?.errors?.error?.validation?.first_name) {
                backendError.value = {value: e?.errors?.error?.validation?.first_name[0], field: 'first_name'};
              }
              if(e?.errors?.error?.validation?.last_name) {
                backendError.value = {value: e?.errors?.error?.validation?.last_name[0], field: 'last_name'};
              }
            }
          } else {
            backendError.value = {value: 'Something went wrong', field: 'default'}
          }
      })
    } else if ($app.store.auth.accountMethod === 'apple') {
      $app.api.eth.auth.
      confirmApple({
        apple_token: $app.store.authTemp?.response,
        email: $app.filters.trimSpaceIntoString(email.value),
        code: $app.filters.trimSpaceIntoString(codeEmail.value),
      })
      .then((jwtResponse: any) => {
        // TODO falling user/me
        $app.store.auth.setTokens(jwtResponse.data)
        confirmResponse.value = jwtResponse.data

      })
      .then(async () => {
        await $app.api.eth.auth.getUser().then((resp) => {
          $app.store.user.info = resp?.data
        });

        signupStep.value = SignupSteps.Default;
        purchaseStep.value = PurchaseSteps.Purchase;
        scrollToPurchase();

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
            backendError.value = {value: e.errors.error.message, field: 'default'}

            if(e?.errors?.error?.validation) {
              if(e?.errors?.error?.validation?.first_name) {
                backendError.value = {value: e?.errors?.error?.validation?.first_name[0], field: 'first_name'};
              }
              if(e?.errors?.error?.validation?.last_name) {
                backendError.value = {value: e?.errors?.error?.validation?.last_name[0], field: 'last_name'};
              }
            }
          } else {
            backendError.value = {value: 'Something went wrong', field: 'default'}
          }
      })
    } else if ($app.store.auth.accountMethod === 'facebook') {
      $app.api.eth.auth.
        confirmFacebook({
          facebook_id: $app.store.authTemp.response?.userID,
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
          });

          signupStep.value = SignupSteps.Default;
          purchaseStep.value = PurchaseSteps.Purchase;
          scrollToPurchase();

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
          if (e?.errors?.error?.message) {
            backendError.value = {value: e.errors.error.message, field: 'default'}

            if(e?.errors?.error?.validation) {
              if(e?.errors?.error?.validation?.first_name) {
                backendError.value = {value: e?.errors?.error?.validation?.first_name[0], field: 'first_name'};
              }
              if(e?.errors?.error?.validation?.last_name) {
                backendError.value = {value: e?.errors?.error?.validation?.last_name[0], field: 'last_name'};
              }
            }
          } else {
            backendError.value = {value: 'Something went wrong', field: 'default'}
          }
        })
    } else if ($app.store.auth.accountMethod === 'walletConnect') {
      $app.api.eth.auth.
        walletConnectConfirm({
          wallet_connect_data: JSON.stringify($app.store.authTemp.response),
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
          });

          signupStep.value = SignupSteps.Default;
          purchaseStep.value = PurchaseSteps.Purchase;
          scrollToPurchase();

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
          if (e?.errors?.error?.message) {
            backendError.value = {value: e.errors.error.message, field: 'default'}

            if(e?.errors?.error?.validation) {
              if(e?.errors?.error?.validation?.first_name) {
                backendError.value = {value: e?.errors?.error?.validation?.first_name[0], field: 'first_name'};
              }
              if(e?.errors?.error?.validation?.last_name) {
                backendError.value = {value: e?.errors?.error?.validation?.last_name[0], field: 'last_name'};
              }
            }
          } else {
            backendError.value = {value: 'Something went wrong', field: 'default'}
          }
        })
    } else {
      $app.api.eth.auth
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
        signupStep.value = SignupSteps.Default;
        purchaseStep.value = PurchaseSteps.Purchase;
        scrollToPurchase();

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
        signupStep.value = SignupSteps.Error;
        scrollToPurchase();
        if (e?.errors?.error?.message) {
          backendError.value = {value: e.errors.error.message, field: 'default'}

          if(e?.errors?.error?.validation) {
            if(e?.errors?.error?.validation?.first_name) {
              backendError.value = {value: e?.errors?.error?.validation?.first_name[0], field: 'first_name'};
            }
            if(e?.errors?.error?.validation?.last_name) {
              backendError.value = {value: e?.errors?.error?.validation?.last_name[0], field: 'last_name'};
            }
          }
        } else {
          backendError.value = {value: 'Something went wrong', field: 'default'}
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

  }

  localStorage.setItem('theme', 'dark');
  $app.store.user.setTheme({theme: 'dark'});
  initializeTronClock()
})

// watch(
//   () => (window as any).ethereum,
//   () => {
//     isMetamaskSupported.value = typeof (window as any).ethereum !== "undefined";
//
//   }
// )

const discountPercent = $app.store.user.statistic?.trc_bonus?.percent ? $app.store.user.statistic?.trc_bonus?.percent : 0;

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

const backendError = ref({value: '', field: 'default'});

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
  Loading = "Loading",
  Error = "Error",
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
  Apple = "Apple",
  Facebook = "Facebook",
  WalletConnect = "WalletConnect",
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

const scrollToSignupFields = () => {
  const element = document.querySelector(".landing-calculation__signup-main");
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

const handleOpenPurchase = () => {
  $app.store.purchase.amountUS = buyAmount.value;
  purchaseStep.value = PurchaseSteps.Purchase;
  scrollToPurchase();
}

const investBuy = async () => {

  if(buyAmountOriginal.value < 100) return

  signupStep.value = SignupSteps.Default;
  signupMethod.value = SignupMethods.None;
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
const codeEmail = ref('')
const firstName = ref('')
const lastName = ref('')
const phone = ref(null);
const countryCode = ref(null);
const isEmailDisabled = ref(false);

const dataDisabled = ref(false);

const countryChanged = (country) => {
  //
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

  if($app.store.authGoogle.response?.email) {
    signupStep.value = SignupSteps.Google;
    signupMethod.value = SignupMethods.Google;
    firstName.value = $app.store.authGoogle.response.first_name;
    lastName.value = $app.store.authGoogle.response.last_name;
    email.value = $app.store.authGoogle.response.email;

    scrollToSignup()
  } else if($app.store.authGoogle.response?.access_token) {
    $app.store.auth.setTokens($app.store.authGoogle.response)
    $app.api.eth.auth.getUser().then((resp) => {
      $app.store.user.info = resp?.data
      //purchase
      handleOpenPurchase();
    });
  }

});

const telegramRedirectUrl = ref('')
const telegramBotName = ref('')
const telegramBotId = ref('')
const currentStep = ref('')
const isTelegramConnection = ref(false);


const handleTelegramAuth = async () => {
  try {
    (window as any).Telegram.Login.auth(
      { bot_id: telegramBotId.value, request_access: true },
      (tgData: any) => {

        if (!tgData) {
          // authorization failed
          isTelegramConnection.value = true;
        } else {

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

              scrollToSignupFields();

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
                      handleOpenPurchase();
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
    )
  } catch (e) {
    console.error(e)
  }


}

onMounted(() => {
  axios.get(`https://${hostname}/v1/auth/provider/telegram/credentials`).then((r: any) => {
    telegramRedirectUrl.value = r.data.data.redirect_url;
    telegramBotName.value = r.data.data.bot_name;
    telegramBotId.value = r.data.data.bot_id;

  })
})

const testTG = async () => {

  let data = null;
  await (window as any).Telegram.Login.init('widget_login', telegramBotId.value, {"origin":"https:\/\/core.telegram.org"}, false, "en");

  await (window as any).Telegram.Login.auth(
    { bot_id: telegramBotId.value, request_access: true },
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

            //registration
            signupStep.value = SignupSteps.Signup;
            signupMethod.value = SignupMethods.Telegram;
            firstName.value = $app.store.authTelegram.response.first_name;
            lastName.value = $app.store.authTelegram.response.last_name;
            email.value = $app.store.authTelegram.response.email;

            scrollToSignupFields();

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
                    handleOpenPurchase();
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
  return data;
}

const handleTelegramConnect = async () => {
  if(isTelegramConnection.value) return;
  isTelegramConnection.value = true;

  axios.get(`https://${hostname}/v1/auth/provider/telegram/credentials`).then((r: any) => {

    telegramRedirectUrl.value = r.data.data.redirect_url;
    telegramBotName.value = r.data.data.bot_name;
    telegramBotId.value = r.data.data.bot_id;

    handleTelegramAuth().then((res) => {

      // signupStep.value = SignupSteps.TelegramButton;
    })


    //

  })
}

const handleGoogleConnect = async () => {
  localStorage.setItem('googleRedirect', router.currentRoute.value.fullPath)
  window.location.href = googleUrl.value;
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
          signupStep.value = SignupSteps.Signup;
          signupMethod.value = SignupMethods.Apple;
          // firstName.value = $app.store.authTelegram.response.first_name;
          // lastName.value = $app.store.authTelegram.response.last_name;
          // email.value = $app.store.authTelegram.response.email;

          if(data?.user?.email) {
            email.value = data?.user?.email;
            isEmailDisabled.value = true;
          }

          if(data?.user?.name) {
            firstName.value = data?.user?.name?.firstName ? data?.user?.name?.firstName : '';
            lastName.value = data?.user?.name?.lastName ? data?.user?.name?.lastName : '';
          }

          scrollToSignupFields();

          //todo autofill email?
        } else {
          $app.api.eth.auth.
            loginApple({
              apple_token: $app.store.authTemp.response,
            })
              .then((jwtResponse: any) => {
                $app.store.auth.setTokens(jwtResponse.data);
                confirmResponse.value = jwtResponse.data;
              })
              .then(async () => {
                await $app.api.eth.auth.getUser().then((resp) => {
                  $app.store.user.info = resp?.data;
                  handleOpenPurchase();
                });

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
            signupStep.value = SignupSteps.Signup;
            signupMethod.value = SignupMethods.Facebook;
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

const { address: addressWalletConnect, chainId, isConnected } = useWeb3ModalAccount()
const { walletProvider } = useWeb3ModalProvider()

async function onSignMessage() {
    const provider = new BrowserProvider(walletProvider.value)
    const signer = await provider.getSigner()
    const signature = await signer?.signMessage($app.store.registration.walletConnectData?.signatureMessage);

    $app.store.registration.walletConnectData.signature = signature;
    $app.store.registration.walletConnectData.walletAddress = addressWalletConnect.value;

    $app.api.eth.auth.walletConnectGetAuthType({
        wallet_connect_data: JSON.stringify({
            signature: $app.store.registration.walletConnectData.signature,
            address: $app.store.registration.walletConnectData.walletAddress,
            message: $app.store.registration.walletConnectData?.signatureMessage,
        }),
    }).then((r: any) => {
        if(r.data.auth_type === 'registration') {
          signupStep.value = SignupSteps.Signup;
          signupMethod.value = SignupMethods.WalletConnect;
          scrollToSignupFields();
        } else {
          $app.api.eth.auth.
            wallletConnectLogin({
                wallet_connect_data: JSON.stringify({
                    signature: $app.store.registration.walletConnectData.signature,
                    address: $app.store.registration.walletConnectData.walletAddress,
                    message: $app.store.registration.walletConnectData?.signatureMessage,
                }),
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
}

watch(
  () => addressWalletConnect.value,
  () => {

    if(addressWalletConnect.value) {
      scrollToSignup()
      onSignMessage()
    }
  }
)

const handleWalletConnect = async () => {

  if(addressWalletConnect.value) {
    onSignMessage()
  } else {
      // 4. Use modal composable
      const modal = useWeb3Modal()

      modal.open();
  }
}


const sendCodeLoading = ref(false)
const codeSended = ref(false);
const timerStarted = ref(false);
const codeSendText = ref('Get Confirmation Code');
const codeSendBuyText = ref('Get Confirmation Code');
const codeSendedText = ref('Resend');
const isMainInputDisabled = ref(false);



const sendCode = async () => {
  var re = /(?:\+)[\d\-\(\) ]{9,}\d/g;
  var valid = re.test(phone.value);

  if(!valid) {
    backendError.value = {value: 'Phone number is not valid', field: 'phone'};
    return;
  }
  if(firstName.value === '' || lastName.value === '' || email.value === '' || !isEmailValid.value || token.value === '') {
    backendError.value = {value: 'Fill in all the fields', field: 'default'};
    return;
  }
  if(timerStarted.value) {
    return;
  }

  isMainInputDisabled.value = true;

  const timer = (sec: number) => {
    if(sec <= 0) {
      codeSendText.value = 'Get Confirmation Code';
      codeSendBuyText.value = 'Get Confirmation Code';
      timerStarted.value = false;
      return;
    }

    if(sec == 60 * 5) {
      codeSendText.value =  "Resend " + 60 * 5 + "s";
      codeSendBuyText.value = "Resend " + 60 * 5 + "s";
    }
    setTimeout(()=>{
      sec -= 1;
      codeSendText.value =  "Resend " + sec + "s";
      codeSendBuyText.value = "Resend " + sec + "s";
      timer(sec);
    },1000);
  }

  timer(60 * 5);
  timerStarted.value = true;

  const tempPhone = phone.value.slice(countryCode.value.length+1);
  backendError.value = {value: '', field: 'default'};
  sendCodeLoading.value = true;

  const initPayload = { first_name: $app.filters.trimSpaceIntoString(firstName.value), last_name: $app.filters.trimSpaceIntoString(lastName.value), email: $app.filters.trimSpaceIntoString(email.value), phone_number: $app.filters.trimSpaceIntoString(tempPhone), phone_number_code: $app.filters.trimSpaceIntoString(countryCode.value) , refcode: $app.filters.trimSpaceIntoString(refCode.value) }

  localStorage.setItem('verifyLinkRedirect', String(router.currentRoute.value.path));

  if(signupMethod.value === SignupMethods.Metamask) {
    initPayload.message = metamaskSignatureMessage.value
    initPayload.signature = metamaskSignature.value
    initPayload.wallet_address = metamaskWalletAddress.value

    await $app.api.eth.auth
      .initMetamask(initPayload)
      .then(() => {
        //currentStep.value = Steps.Code;
        $app.store.auth.accountMethod = "metamask";
      })
      .catch((e) => {
        isMainInputDisabled.value = false;
        if (e?.errors?.error?.message) {
          backendError.value = {value: e.errors.error.message, field: 'default'}

          if(e?.errors?.error?.validation) {
            if(e?.errors?.error?.validation?.first_name) {
              backendError.value = {value: e?.errors?.error?.validation?.first_name[0], field: 'first_name'};
            }
            if(e?.errors?.error?.validation?.last_name) {
              backendError.value = {value: e?.errors?.error?.validation?.last_name[0], field: 'last_name'};
            }
          }
        } else {
          backendError.value = {value: 'Something went wrong', field: 'default'}
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
        $app.store.auth.accountMethod = "telegram";
    }).catch((e) => {
      if (e?.errors?.error?.message) {
        backendError.value = {value: e.errors.error.message, field: 'default'}

        if(e?.errors?.error?.validation) {
          if(e?.errors?.error?.validation?.first_name) {
            backendError.value = {value: e?.errors?.error?.validation?.first_name[0], field: 'first_name'};
          }
          if(e?.errors?.error?.validation?.last_name) {
            backendError.value = {value: e?.errors?.error?.validation?.last_name[0], field: 'last_name'};
          }
        }
      } else {
        backendError.value = {value: 'Something went wrong', field: 'default'}
      }
    })

  } else if (signupMethod.value === SignupMethods.Apple) {
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
        $app.store.auth.accountMethod = "apple";
    }).catch((e) => {
      if (e?.errors?.error?.message) {
        backendError.value = {value: e.errors.error.message, field: 'default'}

        if(e?.errors?.error?.validation) {
          if(e?.errors?.error?.validation?.first_name) {
            backendError.value = {value: e?.errors?.error?.validation?.first_name[0], field: 'first_name'};
          }
          if(e?.errors?.error?.validation?.last_name) {
            backendError.value = {value: e?.errors?.error?.validation?.last_name[0], field: 'last_name'};
          }
        }
      } else {
        backendError.value = {value: 'Something went wrong', field: 'default'}
      }
    })

    return;
  } else if (signupMethod.value === SignupMethods.Facebook) {
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
        $app.store.auth.accountMethod = "facebook";
    }).catch((e) => {
      if (e?.errors?.error?.message) {
        backendError.value = {value: e.errors.error.message, field: 'default'}

        if(e?.errors?.error?.validation) {
          if(e?.errors?.error?.validation?.first_name) {
            backendError.value = {value: e?.errors?.error?.validation?.first_name[0], field: 'first_name'};
          }
          if(e?.errors?.error?.validation?.last_name) {
            backendError.value = {value: e?.errors?.error?.validation?.last_name[0], field: 'last_name'};
          }
        }
      } else {
        backendError.value = {value: 'Something went wrong', field: 'default'}
      }
    })

    return;
  } else if (signupMethod.value === SignupMethods.WalletConnect) {
    $app.api.eth.auth
    .walletConnectInit({
      first_name: firstName.value,
      last_name: lastName.value,
      email: email.value,
      ref_code: $app.store.auth.refCode,
      phone_number: tempPhone,
      phone_number_code: countryCode.value,
      wallet_connect_data: JSON.stringify({
          signature: $app.store.registration.walletConnectData.signature,
          address: $app.store.registration.walletConnectData.walletAddress,
          message: $app.store.registration.walletConnectData?.signatureMessage,
      }),
                  
    }).then((r: any) => {
      $app.store.auth.accountMethod = "walletConnect";
      $app.store.authTemp.response =  {
          signature: $app.store.registration.walletConnectData.signature,
          address: $app.store.registration.walletConnectData.walletAddress,
          message: $app.store.registration.walletConnectData?.signatureMessage,
      };
    }).catch((e) => {
      if (e?.errors?.error?.message) {
        backendError.value = {value: e.errors.error.message, field: 'default'}

        if(e?.errors?.error?.validation) {
          if(e?.errors?.error?.validation?.first_name) {
            backendError.value = {value: e?.errors?.error?.validation?.first_name[0], field: 'first_name'};
          }
          if(e?.errors?.error?.validation?.last_name) {
            backendError.value = {value: e?.errors?.error?.validation?.last_name[0], field: 'last_name'};
          }
        }
      } else {
        backendError.value = {value: 'Something went wrong', field: 'default'}
      }
    })

    return;
  } else {
    initPayload.fast = true;
    await $app.api.eth.auth
      .init(initPayload).then(()=>{
        sendCodeLoading.value = false
        codeSended.value = true;
        $app.store.auth.accountMethod = "email";
      })
      .catch((e) => {
        isMainInputDisabled.value = false;
        console.error("ERROR", e);
        if (e?.errors?.error?.message) {
          backendError.value = {value: e.errors.error.message, field: 'default'}

          if (e.errors.error.code === 'ETF:011002') {
            //email is already in use
            router.push('/personal/login')
          }

          if(e?.errors?.error?.validation) {
              if(e?.errors?.error?.validation?.first_name) {
                backendError.value = {value: e?.errors?.error?.validation?.first_name[0], field: 'first_name'};
              }
              if(e?.errors?.error?.validation?.last_name) {
                backendError.value = {value: e?.errors?.error?.validation?.last_name[0], field: 'last_name'};
              }
            }
        } else {
          backendError.value = {value: 'Something went wrong', field: 'default'}
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

  var re = /(?:\+)[\d\-\(\) ]{9,}\d/g;
  var valid = re.test(phone.value);

  if(!valid) {
    backendError.value = {value: 'Phone number is not valid', field: 'phone'};
    return;
  }
  if(firstName.value === '' || lastName.value === '' || email.value === '' || !isEmailValid.value  || token.value === '' || codeEmail.value === '') {
    backendError.value = {value: 'Fill in all the fields', field: 'default'};
    return;
  }

  if(isSignupAndBuy.value) return;
  isSignupAndBuy.value = true;

  backendError.value = {value: '', field: 'default'}

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
        handleOpenPurchase();

        if (props.isFiat) {
        //
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
          backendError.value = {value: e.errors.error.message, field: 'default'}

          if(e?.errors?.error?.validation) {
            if(e?.errors?.error?.validation?.first_name) {
              backendError.value = {value: e?.errors?.error?.validation?.first_name[0], field: 'first_name'};
            }
            if(e?.errors?.error?.validation?.last_name) {
              backendError.value = {value: e?.errors?.error?.validation?.last_name[0], field: 'last_name'};
            }
          }
        } else {
          backendError.value = {value: 'Something went wrong', field: 'default'}
        }
      })
  } else if (signupMethod.value === SignupMethods.Telegram) {

    backendError.value = {value: '', field: 'default'}
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
          handleOpenPurchase();
        });

        const aAid = window.localStorage.getItem('PAPVisitorId');
        if(aAid && window.localStorage.getItem('a_utm')) {
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
          backendError.value = {value: e.errors.error.message, field: 'default'}

          if(e?.errors?.error?.validation) {
            if(e?.errors?.error?.validation?.first_name) {
              backendError.value = {value: e?.errors?.error?.validation?.first_name[0], field: 'first_name'};
            }
            if(e?.errors?.error?.validation?.last_name) {
              backendError.value = {value: e?.errors?.error?.validation?.last_name[0], field: 'last_name'};
            }
          }
        } else {
          backendError.value = {value: 'Something went wrong', field: 'default'}
        }
      })
  } else if (signupMethod.value === SignupMethods.Apple) {
    backendError.value = {value: '', field: 'default'}

    await $app.api.eth.auth.
      confirmApple({
        apple_token: $app.store.authTemp.response,
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
          handleOpenPurchase();
        });

        const aAid = window.localStorage.getItem('PAPVisitorId');
        if(aAid && window.localStorage.getItem('a_utm')) {
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
        if (e?.errors?.error?.message) {
          backendError.value = {value: e.errors.error.message, field: 'default'}

          if(e?.errors?.error?.validation) {
            if(e?.errors?.error?.validation?.first_name) {
              backendError.value = {value: e?.errors?.error?.validation?.first_name[0], field: 'first_name'};
            }
            if(e?.errors?.error?.validation?.last_name) {
              backendError.value = {value: e?.errors?.error?.validation?.last_name[0], field: 'last_name'};
            }
          }
        } else {
          backendError.value = {value: 'Something went wrong', field: 'default'}
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
        handleOpenPurchase();

        if (props.isFiat) {
        //
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
        console.log("CATCH")
        if (e?.errors?.error?.message) {
          console.log(e?.errors?.error?.message)
          backendError.value = {value: e.errors.error.message, field: 'default'}

          if(e?.errors?.error?.validation) {
            console.log(e?.errors?.error?.message.validation)
            if(e?.errors?.error?.validation?.first_name) {
              backendError.value = {value: e?.errors?.error?.validation?.first_name[0], field: 'first_name'};
            }
            if(e?.errors?.error?.validation?.last_name) {
              backendError.value = {value: e?.errors?.error?.validation?.last_name[0], field: 'last_name'};
            }
          }
        } else {
          backendError.value = {value: 'Something went wrong', field: 'default'}
        }
      })
  }

}

const isSignupAndBuyGoogle = ref(false);

const signupAndBuyGoogle = () => {

  var re = /(?:\+)[\d\-\(\) ]{9,}\d/g;
  var valid = re.test(phone.value);

  if(!valid) {
    backendError.value = {value: 'Phone number is not valid', field: 'phone'};
    return;
  }
  if(firstName.value === '' || lastName.value === '' || email.value === '' || !isEmailValid.value  || token.value === '') {
    backendError.value = {value: 'Fill in all the fields', field: 'default'};
    return;
  }

  if(isSignupAndBuyGoogle.value) return;
  isSignupAndBuyGoogle.value = true;

  var re = /(?:\+)[\d\-\(\) ]{9,}\d/g;
  var valid = re.test(phone.value);

  if(!valid) {
    backendError.value = {value: 'Phone number is not valid', field: 'phone'};
    isSignupAndBuyGoogle.value = false;
    return;
  }

  if(firstName.value === '' || lastName.value === '' ) {
    backendError.value = {value: 'Fill in all the fields', field: 'default'};
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

  $app.api.eth.auth
    .initGoogle(initPayload)
    .then((tokens: any) => {
      $app.store.auth.setTokens(tokens?.data)
      $app.store.authGoogle.setResponse({}, SignupMethods.Google);
      confirmResponse.value = tokens?.data
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
            handleOpenPurchase();
        })

        const aAid = window.localStorage.getItem('PAPVisitorId');
        if(aAid && window.localStorage.getItem('a_utm')) {
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
          $app.store.user.blockchainUserWallet = resp?.data?.uid
        })
    })
    .catch((e) => {
      console.error(e);
        if (e?.errors?.error?.message) {
            backendError.value = {value: e.errors.error.message, field: 'default'}

            if(e?.errors?.error?.validation) {
              if(e?.errors?.error?.validation?.first_name) {
                backendError.value = {value: e?.errors?.error?.validation?.first_name[0], field: 'first_name'};
              }
              if(e?.errors?.error?.validation?.last_name) {
                backendError.value = {value: e?.errors?.error?.validation?.last_name[0], field: 'last_name'};
              }
            }
        } else {
            backendError.value = {value: 'Something went wrong', field: 'default'}
        }
    })

  return;
}

</script>

<style lang="scss" src="./landing-calculation-new.scss" />
