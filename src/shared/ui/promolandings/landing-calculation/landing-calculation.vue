<template>
  <div class="langing-calculation">
    <div class="langing-calculation__preferences" v-if="!isFiatLanding">
      <div class="langing-calculation__preferences-box">
        <a-icon :name="Icon.ColorfulLangindrocket"/>
        <div class="langing-calculation__preferences-title">Your Investment Deserves More!</div>
        <div class="langing-calculation__preferences-description">With<a-icon :name="Icon.ColorfulUsdttron"/>USDT, not only do you enjoy seamless transactions, but now you also get more out of your investment!</div>
      </div>
      <div class="langing-calculation__preferences-box">
        <a-icon :name="Icon.ColorfulLandingshield"/>
        <div class="langing-calculation__preferences-title">Safe, Secure, and Rewarding</div>
        <div class="langing-calculation__preferences-description">Trust in the safety of your investments with us. Along with robust security, enjoy the added benefit of a substantial bonus.</div>
      </div>
      <div class="langing-calculation__preferences-box">
        <a-icon :name="Icon.ColorfulLandingtimer"/>
        <div class="langing-calculation__preferences-title">Time is Ticking! Act Now!</div>
        <div class="langing-calculation__preferences-description">This exclusive offer is only available for a short period. Don't miss out on this opportunity!</div>
      </div>
    </div>
    <div class="langing-calculation__fiat" v-if="isFiatLanding">
      <div class="langing-calculation__fiat-wrapper">
        <h1>Уважаемые российские инвесторы!</h1>
        <p>Мы, команда Bitcoin ETF, приложили значительные усилия, чтобы, несмотря на беспрецедентные политические и регуляторные трудности, предоставить вам возможность приобрести Bitcoin ETF одновременно с инвесторами по всему миру.<br><br>К сожалению, текущее решение влечет за собой дополнительные издержки: из-за валютных различий и комиссий платёжных систем P2P, поддерживающих карты "МИР" для международных транзакций, <span>наши российские клиенты столкнутся с комиссией в размере 5%.</span><br><br>        Мы рекомендуем вам <nuxt-link to="/tetherspecial">воспользоваться</nuxt-link> нашим методом оплаты через стейблкоин USDT. При такой форме оплаты мы не взимаем комиссию, и вы мгновенно получите бонус в размере до
          {{ $app.store.user.statistic?.trc_bonus?.percent }}% от суммы вашего депозита.<br><br>Благодарим за внимание!<br><br>С уважением,<br><b>Команда Bitcoin ETF</b></p>
      </div>
    </div>
    <div class="langing-calculation__wrapper">
        <div class="langing-calculation__title" :class="[{'langing-calculation__title--fiat': isFiatLanding}]">
          <span>GET STARTED!</span>
          <div class="langing-calculation__title-timer" v-if="!isFiatLanding">
            <div class="langing-calculation__title-timer__wrapper">
              <p class="langing-calculation__title-timer-title">OFFER VALID FOR</p>
              <div class="langing-calculation__title-timer-box">
                <span>{{ tronTimerDays[0] }}</span>
                <span>{{ tronTimerDays[1] }}</span>
                <span>Days</span>
              </div>
              <div class="langing-calculation__title-timer-box">
                <span>{{tronTimerHours[0]}}</span>
                <span>{{tronTimerHours[1]}}</span>
                <span>Hours</span>
              </div>
              <div class="langing-calculation__title-timer-box">
                <span>{{tronTimerMinutes[0]}}</span>
                <span>{{tronTimerMinutes[1]}}</span>
                <span>Minutes</span>
              </div>
            </div>
          </div>
        </div>
        <div class="langing-calculation__calculator">
          <m-profit-calculator :hiddenBottomButton="true" :visibleTronLabel="isFiatLanding" @calculator-amount="calcAmountUpdated" @refCode="refcodeUpdated" :is-fiat="isFiatLanding"/>
          <div class="langing-calculation__support" @click="scrollToChat" v-if="isUserAuthenticated">
            <img src="/img/landginregsupport.png" alt="">
            <span>Need help? Talk to one of our support agents!</span>
            <a-icon :name="Icon.MonoChevronRight" />
          </div>
          <landing-registration :calc-value-discount="calcAmountWithDiscount" :calc-value="calcAmount" v-if="!isUserAuthenticated" :refCode="refCode" :is-fiat="isFiatLanding"/>
          <w-buy-shares-payment-short v-if="isUserAuthenticated" :calc-value-discount="calcAmountWithDiscount" :calc-value="calcAmount" :is-fiat="isFiatLanding"/>
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
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {useNuxtApp} from "#app";
import MProfitCalculator from "~/src/shared/ui/molecules/m-profit-calculator/m-profit-calculator.vue";
import WBuySharesPaymentShort from "~/src/widgets/w-buy-shares-payment-short/w-buy-shares-payment-short.vue";
import {Icon} from "~/src/shared/constants/icons";
import AIcon from "~/src/shared/ui/atoms/a-icon/a-icon.vue";
const { $app } = useNuxtApp()
import { useWindowSize } from '@vueuse/core'
const { width } = useWindowSize()
const props = withDefaults(
  defineProps<{
    isFiatLanding: boolean
  }>(),
  {
    isFiatLanding: false,
  },
)

onMounted(()=>{
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

const calcAmount = ref(1000);
const calcAmountUpdated = (e) =>{
  calcAmount.value = e
}



const calcAmountWithDiscount = ref(950);

watch(
  () => calcAmount.value,
  (newValue) => {
    const tempValue = Math.ceil(newValue-(newValue/100)*5);

    if(isNaN(tempValue)) {
      calcAmountWithDiscount.value = 0;
    } else {
      calcAmountWithDiscount.value = tempValue;
    }
  }
)

const isUserAuthenticated = computed(() => {
  return $app.store.auth.isUserAuthenticated
})
const refCode = ref('')
const refcodeUpdated = (e) => {
  refCode.value = e
}
const scrollToChat = () =>{
  if (window.innerWidth > 767) {
    const element = document.querySelector(".langing-calculation__chat");
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
</script>

<style lang="scss" src="./landing-calculation.scss" />
