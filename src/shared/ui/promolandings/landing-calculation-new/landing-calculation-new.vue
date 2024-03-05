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

    <div class="landing-calculation__journey" :class="[{'landing-calculation__journey-btc': selectedCurrency.value === 'Bitcoin'}]">

      <NuxtImg class="landing-calculation__journey-bg1" src="/img/tetherspecial/bg-img1.png" />
      <NuxtImg class="landing-calculation__journey-bg2" src="/img/tetherspecial/bg-img2.png"/>

      <div class="landing-calculation__journey-title">Start your bitcoin etf journey 🚀</div>
      <div class="landing-calculation__journey__invest flex flex-col justify-end items-start"> <!--max-w-[375px]-->
        <header class="mx-auto landing-calculation__journey__invest-text flex items-center font-medium text-center whitespace-nowrap"> <!--gap-4-->
          <VueWriter :typeSpeed="60" class="landing-calculation__journey__invest--text-main landing-calculation__journey--text-normal landing-calculation__journey__invest--text-secondary grow" :array="['I want to invest']" :iterations="1" />

          <div class="landing-calculation__journey__invest-input landing-calculation__journey__invest--text-primary ml-4 grow flex justify-center font-semibold">
            <span class="landing-calculation__journey__invest--text-input landing-calculation__journey--text-normal flex items-center">$</span>
            <input :style="'max-width: '+inputMaxWidth+'px'" v-model="investmentAmountModified" class="landing-calculation__journey__invest--text-input landing-calculation__journey--text-normal flex-1 bg-transparent" placeholder="2,500"/>
          </div>

        </header>
        <VueWriter :start="1100" :typeSpeed="60" class="mx-auto landing-calculation__journey__invest--text-main landing-calculation__journey--text-normal landing-calculation__journey__invest--text-secondary landing-calculation__journey__invest--text-spacing font-medium text-center" :array="['and receive my daily']" :iterations="1" />
        <div class="mx-auto landing-calculation__journey__invest--text-main landing-calculation__journey--text-normal landing-calculation__journey__invest--text-secondary landing-calculation__journey__invest--text-spacing flex items-center gap-2 font-medium text-center whitespace-nowrap">
          <VueWriter :start="2300" :typeSpeed="60" class="grow" :array="['dividends in']" :iterations="1" />

          <div class="relative">
            <div class="landing-calculation__journey__invest-select flex text-center whitespace-nowrap">
              <div @click="toggleCurrencyDropdown" class="relative flex items-center justify-center gap-4 cursor-pointer">
                <NuxtImg :src="selectedCurrency.icon" class="w-10 aspect-square cursor-pointer" alt="USDT logo" />
                <span class="landing-calculation__journey__invest-select-text landing-calculation__journey__invest--text-primary landing-calculation__journey--text-normal">{{ selectedCurrency.value }}</span>
                <NuxtImg src="/img/icons/mono/chevron-light-bottom.svg" :class="['w-[32px] aspect-square cursor-pointer', {'rotate-180': showDropdown}]" alt="Down arrow icon"/>
              </div>
            </div>
            <div v-if="showDropdown" class="landing-calculation__journey__invest-select-dropdown w-full absolute mt-1 z-10">
              <ul class=" text-sm font-medium">
                <li v-for="currency in currencies" :key="currency" @click="selectCurrency(currency)" :class="['landing-calculation__journey__invest-select-dropdown-item px-4 py-2 cursor-pointer']">{{ currency.value }}</li>
              </ul>
            </div>
          </div>

          <!-- <div class="flex gap-2 justify-center py-1.5 pr-6 pl-2.5 text-xl bg-sky-50 rounded">
            <NuxtImg src="/img/icons/colorful/usdt.svg" class="self-start w-6 aspect-square" alt="USDT logo" />
            <span>USDT</span>
            <NuxtImg src="/img/icons/mono/chevron-bottom.svg" class="my-auto aspect-square w-[18px]" alt="Down arrow icon" />
          </div> -->

        </div>

        <article class="landing-calculation__journey__invest--card-wrapper flex flex-col self-stretch whitespace-nowrap rounded-lg">
          
          <div :class="['landing-calculation__journey__invest--card-inner', {'landing-calculation__journey__invest--card-inner-flip': selectedCurrency.value === 'Bitcoin'}]">

            <!-- FRONT -->
            <div class="landing-calculation__journey__invest--card landing-calculation__journey__invest--card-front landing-calculation__journey__invest-font flex overflow-hidden relative flex-col justify-center w-full rounded-lg">
              <!-- <NuxtImg src="/img/icons/colorful/usdt.svg" class="landing-calculation__journey__invest--card-icon w-6 aspect-square cursor-pointer" alt="USDT logo" /> -->
              <p class="landing-calculation__journey__invest--card-title landing-calculation__journey--text-normal relative font-semibold text-white text-opacity-80 mx-auto"> In Total Projected Payout </p>
              <p class="landing-calculation__journey__invest--card-sum landing-calculation__journey--text-normal relative font-black text-white mx-auto"> $3,457,938.00 </p>
              <p class="landing-calculation__journey__invest--card-subtitle landing-calculation__journey--text-normal relative font-medium text-white text-opacity-80 mx-auto"> Your Interest + Original Investment Amount </p>
              <div class="landing-calculation__journey__invest--card-line relative shrink-0"></div>
              <div class="flex relative justify-around">
                <div class="landing-calculation__journey__invest--card-stats landing-calculation__journey--text-normal flex flex-col text-center">
                  <p class="landing-calculation__journey__invest--card-stats-title font-medium text-white text-opacity-80 "> Daily Payout</p>
                  <p class="landing-calculation__journey__invest--card-stats-value font-bold text-white">$0.95</p>
                </div>
                <div class="landing-calculation__journey--text-normal flex flex-col text-center">
                  <p class="landing-calculation__journey__invest--card-stats-title font-medium text-white text-opacity-80"> Total Profit </p>
                  <p class="landing-calculation__journey__invest--card-stats-value font-black text-white">42%</p>
                </div>
                <div class="landing-calculation__journey--text-normal flex flex-col text-center">
                  <p class="landing-calculation__journey__invest--card-stats-title font-medium text-white text-opacity-80"> Monthly Dividends </p>
                  <p class="landing-calculation__journey__invest--card-stats-value font-black text-white">$28.76</p>
                </div>
              </div>
              <p class="landing-calculation__journey__invest--card-rating landing-calculation__journey--text-normal relative flex items-center mx-auto"> 
                Safety Rating 
                <span class="landing-calculation__journey__invest--card-rating-stars">
                  <span class="inline-flex" v-for="item in new Array(5)"> 
                    <NuxtImg src="/img/icons/colorful/star.svg" width="18" height="18" /> 
                  </span> 
                </span>
                5/5 
              </p>
              <div class="landing-calculation__journey__invest--card-term landing-calculation__journey--text-normal mx-auto">Term: 1095 Days</div>

            </div>

            <!-- BACK -->

            <div class="landing-calculation__journey__invest--card-back landing-calculation__journey__invest--card landing-calculation__journey__invest-font flex overflow-hidden relative flex-col justify-center w-full rounded-lg">
              <!-- <NuxtImg src="/img/icons/colorful/usdt.svg" class="landing-calculation__journey__invest--card-icon w-6 aspect-square cursor-pointer" alt="USDT logo" /> -->
              <p class="landing-calculation__journey__invest--card-title landing-calculation__journey--text-normal relative font-semibold text-white text-opacity-80 mx-auto"> In Total Projected Payout </p>
              <p class="landing-calculation__journey__invest--card-sum landing-calculation__journey--text-normal relative font-black text-white mx-auto"> $3,457,938.00 </p>
              <p class="landing-calculation__journey__invest--card-subtitle landing-calculation__journey--text-normal relative font-medium text-white text-opacity-80 mx-auto"> Interest + Original Investment Amount </p>
              <div class="landing-calculation__journey__invest--card-line relative shrink-0"></div>
              <div class="flex relative justify-around">
                <div class="landing-calculation__journey__invest--card-stats landing-calculation__journey--text-normal flex flex-col text-center">
                  <p class="landing-calculation__journey__invest--card-stats-title font-medium text-white text-opacity-80 "> Daily Payout</p>
                  <p class="landing-calculation__journey__invest--card-stats-value font-bold text-white">$0.95</p>
                </div>
                <div class="landing-calculation__journey--text-normal flex flex-col text-center">
                  <p class="landing-calculation__journey__invest--card-stats-title font-medium text-white text-opacity-80"> Total Profit </p>
                  <p class="landing-calculation__journey__invest--card-stats-value font-black text-white">42%</p>
                </div>
                <div class="landing-calculation__journey--text-normal flex flex-col text-center">
                  <p class="landing-calculation__journey__invest--card-stats-title font-medium text-white text-opacity-80"> Monthly Dividends </p>
                  <p class="landing-calculation__journey__invest--card-stats-value font-black text-white">$28.76</p>
                </div>
              </div>
              <p class="landing-calculation__journey__invest--card-rating landing-calculation__journey--text-normal relative flex items-center mx-auto"> 
                Safety Rating 
                <span class="landing-calculation__journey__invest--card-rating-stars">
                  <span class="inline-flex"> 
                    <NuxtImg src="/img/icons/colorful/star.svg" width="18" height="18" /> 
                  </span> 
                  <span class="inline-flex"> 
                    <NuxtImg src="/img/icons/colorful/star.svg" width="18" height="18" /> 
                  </span> 
                  <span class="inline-flex"> 
                    <NuxtImg src="/img/icons/colorful/star.svg" width="18" height="18" /> 
                  </span> 
                  <span class="inline-flex"> 
                    <NuxtImg src="/img/icons/colorful/star.svg" width="18" height="18" /> 
                  </span> 
                  <span class="inline-flex"> 
                    <NuxtImg src="/img/icons/colorful/star-half.svg" width="18" height="18" /> 
                  </span> 
                </span>
                4.5/5 
              </p>
              <div class="landing-calculation__journey__invest--card-term landing-calculation__journey--text-normal mx-auto">Term: 1095 Days</div>

            </div>
          </div>

          

        </article>
        <button @click="handleContinue" tabindex="0" :class="[{'landing-calculation__journey__button-btc': selectedCurrency.value === 'Bitcoin'}]" class="landing-calculation__journey__button justify-center items-center self-stretch px-16 py-5 text-base font-bold text-white whitespace-nowrap bg-blue-600 rounded-lg"> Buy Bitcoin ETFs </button>
      </div>

    </div>

    <div class="landing-calculation__wrapper">
        <div class="landing-calculation__title" :class="[{'landing-calculation__title--fiat': isFiatLanding}]">
          <span>GET STARTED!</span>
          <div class="landing-calculation__title-timer" v-if="!isFiatLanding">
            <div class="landing-calculation__title-timer__wrapper">
              <p class="landing-calculation__title-timer-title">OFFER VALID FOR</p>
              <div class="landing-calculation__title-timer-box">
                <span>{{ tronTimerDays[0] }}</span>
                <span>{{ tronTimerDays[1] }}</span>
                <span>Days</span>
              </div>
              <div class="landing-calculation__title-timer-box">
                <span>{{tronTimerHours[0]}}</span>
                <span>{{tronTimerHours[1]}}</span>
                <span>Hours</span>
              </div>
              <div class="landing-calculation__title-timer-box">
                <span>{{tronTimerMinutes[0]}}</span>
                <span>{{tronTimerMinutes[1]}}</span>
                <span>Minutes</span>
              </div>
            </div>
          </div>
        </div>
        <div class="landing-calculation__calculator">
          <m-profit-calculator :hiddenBottomButton="true" :visibleTronLabel="isFiatLanding" @calculator-amount="calcAmountUpdated" @refCode="refcodeUpdated" :is-fiat="isFiatLanding"/>
          <div class="landing-calculation__support" @click="scrollToChat" v-if="isUserAuthenticated">
            <img src="/img/landginregsupport.png" alt="">
            <span>Need help? Talk to one of our support agents!</span>
            <a-icon :name="Icon.MonoChevronRight" />
          </div>
          <landing-registration :calc-value="calcAmount" v-if="!isUserAuthenticated" :refCode="refCode" :is-fiat="isFiatLanding"/>
          <w-buy-shares-payment-short v-if="isUserAuthenticated" :calc-value="calcAmount" :is-fiat="isFiatLanding"/>
          <div class="landing-calculation__chat" v-if="width > 767">
            <iframe src="https://secure.livechatinc.com/licence/16652127/open_chat.cgi"></iframe>
          </div>
          <div class="w-buy-shares-payment__divider">Or</div>
          <div class="landing-calculation__processWith">
            <span>Proceed with</span>
            <nuxt-link to="/tetherspecial" v-if="isFiatLanding">
              <a-icon :name="Icon.ColorfulUsdttron" class="landing-calculation__processWith--tron"/>
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
import VueWriter from 'vue-writer'
import { useWindowSize } from '@vueuse/core'

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

// invest 

const inputMaxWidth = ref(100);
const investmentAmount = ref('2,500');
const investmentAmountModified = computed<string>({
  get: () => investmentAmount.value, 
  set: (newValue) => {
    const originalNumber = newValue.split(",").join("");
    if(originalNumber.length <= 4) {
      inputMaxWidth.value = 100;
    } else if(originalNumber.length > 4 && originalNumber.length < 7) {
      inputMaxWidth.value =  100+((originalNumber.length - 4)*40);
    }
    investmentAmount.value = originalNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
},
});

const currencies = ref([
  {
    value: 'USDT',
    icon: "/img/icons/colorful/usdt.svg",
    background: "/img/usdtbg2.png",
    stars: 5,
    
  }, 
  {
    value: 'Bitcoin',
    icon: "/img/icons/colorful/bitcoin.svg",
    background: "/img/bitcoinbg.png",
    stars: 4.5,
    
  }, ]);
const selectedCurrency = ref(currencies.value[0]);
const showDropdown = ref(false);

const toggleCurrencyDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const selectCurrency = (currency : any) => {
  selectedCurrency.value = currencies.value.find((el) => el.value === currency.value) ?? currencies.value[0];
  toggleCurrencyDropdown();
}
</script>

<style lang="scss" src="./landing-calculation-new.scss" />
