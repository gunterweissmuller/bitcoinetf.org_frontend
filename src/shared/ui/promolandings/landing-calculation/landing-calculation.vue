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
    <m-profit-calculator-new :isInputDisbled="$app.store.tetherspecial.purchaseStep == PurchaseSteps.Purchase" :openPurchase="investBuy" :openSignup="investBuySignup" use-discount/>

    <!-- SIGNUP LAYOUT -->
    <!-- <landingRegistration :isFiatLanding="props.isFiatLanding"/> -->

  </div>

  <e-registration-bonus-modal
    :confirmData="$app.store.tetherspecial.confirmResponse"
    v-model="$app.store.tetherspecial.isOpenSuccessModal"
    @close="closeModal"
    :onComplete="scrollToPurchase"
  />
</template>

<script setup lang="ts">
import {useNuxtApp} from "#app";
import MProfitCalculatorNew from "~/src/shared/ui/molecules/m-profit-calculator-new/m-profit-calculator-new.vue";
import {Icon} from "~/src/shared/constants/icons";
import AIcon from "~/src/shared/ui/atoms/a-icon/a-icon.vue";
import 'vue-tel-input/vue-tel-input.css';
import ERegistrationBonusModal from "~/src/entities/e-registration-bonus-modal/e-registration-bonus-modal.vue";
import landingRegistration from '../landing-registration/landing-registration.vue';
import { useRegistration } from '../landing-registration/useRegistration';
import { PurchaseSteps } from '../landing-registration/PurchaseSteps';

const { $app } = useNuxtApp()
const {investBuy, investBuySignup, scrollToPurchase, closeModal} = useRegistration($app);

const props = withDefaults(
  defineProps<{
    isFiatLanding: boolean
  }>(),
  {
    isFiatLanding: false,
  },
)
</script>

<style lang="scss" src="./landing-calculation.scss" />
