<template>
  <div class="landing-calculation__journey" :class="[{'landing-calculation__journey-btc': selectedCurrency.value === 'BTC'}]">

    <NuxtImg class="landing-calculation__journey-bg1" src="/img/tetherspecial/bg-img1.png" loading="lazy" />
    <NuxtImg class="landing-calculation__journey-bg2" src="/img/tetherspecial/bg-img2.png" loading="lazy" />

    <div class="landing-calculation__journey-title">Start your bitcoin etf journey 🚀</div>
    <div class="landing-calculation__journey__invest flex flex-col justify-end items-start"> <!--max-w-[375px]-->
      <header class="mx-auto landing-calculation__journey__invest--text flex items-center font-medium text-center whitespace-nowrap"> <!--gap-4-->
        <VueWriter :typeSpeed="60" :class="{'landing-calculation__journey__invest--text-reinvest':orderType == 'btc' || orderType == 'usdt'}" class="landing-calculation__journey__invest--text-main landing-calculation__journey--text-normal landing-calculation__journey__invest--text-secondary grow" :array="[ orderType == 'btc' || orderType == 'usdt' ? 'I want to invest additional' : 'I want to invest']" :iterations="1" />

        <div v-if="orderType !== 'btc' && orderType !== 'usdt'" class="landing-calculation__journey__invest-input landing-calculation__journey__invest--text-primary ml-4 grow flex justify-center font-semibold">
          <span class="landing-calculation__journey__invest--text-input landing-calculation__journey--text-normal flex items-center">$</span>
          <!-- <input :style="'max-width: '+inputMaxWidth+'px'" v-model="investmentAmountModified" class="landing-calculation__journey__invest--text-input landing-calculation__journey--text-normal flex-1 bg-transparent" placeholder="2,500"/> -->
          <input
            :disabled="props.isInputDisbled || currentAmount !== 'CUSTOM'"
            :style="['max-width: '+inputMaxWidth+'px', currentAmount !== 'CUSTOM' ? 'pointer-events: none' : '' ]"
            v-model="investmentAmountDisplay"
            class="landing-calculation__journey__invest--text-input landing-calculation__journey--text-normal flex-1 bg-transparent"
            placeholder="2,500"
            type="text"
            @keypress="validate"
            :min="1"
            :max="10000000"

          /> <!-- @input="onPickerValueInput" @keypress="validate" :value="investmentAmount2" -->

          <div class="relative">
            <div @click="toggleAmountDropdown" class="landing-calculation__journey__invest-select-amount landing-calculation__journey__invest-select flex text-center whitespace-nowrap">
              <div class="landing-calculation__journey__invest-select-amount-arrow-wrapper relative flex items-center justify-center gap-4 cursor-pointer">
                <NuxtImg src="/img/icons/mono/chevron-light-bottom.svg" :class="['landing-calculation__journey__invest-select-amount-arrow landing-calculation__journey__invest-select-arrow aspect-square cursor-pointer', {'rotate-180': showAmountDropdown}]" alt="Down arrow icon"/>
              </div>
            </div>
            <div v-on-click-outside="outSideClick"  v-if="showAmountDropdown" :class="[{'landing-calculation__journey__invest-select-amount-dropdown-btc': selectedCurrency.value === 'BTC', 'landing-calculation__journey__invest-select-amount-dropdown-usdt': selectedCurrency.value === 'USDT'}]"  class="landing-calculation__journey__invest-select-amount-dropdown landing-calculation__journey__invest-select-dropdown w-full absolute mt-1 z-10">
              <ul class=" text-sm font-medium">
                <li v-for="amount in amounts" :key="amount.amount" @click="selectAmount(amount.amount)" :class="[{'landing-calculation__journey__invest-select-amount-dropdown-item-active': amount.amount === currentAmount},'landing-calculation__journey__invest-select-amount-dropdown-item landing-calculation__journey__invest-select-dropdown-item cursor-pointer']">
                  {{ amount.amount !== 'CUSTOM' ? '$' : ''}} {{amount.amount}}
                  <a-icon
                    class="landing-calculation__journey__invest-select-amount-check"
                    v-if="amount.amount === currentAmount"
                    :name="Icon.MonoActionCheckMark"
                    width="18"
                    height="18"
                  />

                </li>
              </ul>
            </div>
          </div>

        </div>

      </header>

      <p :class="{'landing-calculation__journey-reinvest-wrapper-active': orderType === 'btc' || orderType === 'usdt'}" class="landing-calculation__journey-reinvest-wrapper">

        <div v-if="orderType === 'btc' || orderType === 'usdt'" class="landing-calculation__journey__invest-input landing-calculation__journey__invest--text-primary mr-4 grow flex justify-center font-semibold">
          <span class="landing-calculation__journey__invest--text-input landing-calculation__journey--text-normal flex items-center">$</span>
          <!-- <input :style="'max-width: '+inputMaxWidth+'px'" v-model="investmentAmountModified" class="landing-calculation__journey__invest--text-input landing-calculation__journey--text-normal flex-1 bg-transparent" placeholder="2,500"/> -->
          <input
            :disabled="props.isInputDisbled || currentAmount !== 'CUSTOM'"
            :style="['max-width: '+inputMaxWidth+'px', currentAmount !== 'CUSTOM' ? 'pointer-events: none' : '' ]"
            v-model="investmentAmountDisplay"
            class="landing-calculation__journey__invest--text-input landing-calculation__journey--text-normal flex-1 bg-transparent"
            placeholder="2,500"
            type="text"
            @keypress="validate"
            :min="1"
            :max="10000000"

          /> <!-- @input="onPickerValueInput" @keypress="validate" :value="investmentAmount2" -->

          <div class="relative">
            <div @click="toggleAmountDropdown" class="landing-calculation__journey__invest-select-amount landing-calculation__journey__invest-select flex text-center whitespace-nowrap">
              <div class="landing-calculation__journey__invest-select-amount-arrow-wrapper relative flex items-center justify-center gap-4 cursor-pointer">
                <NuxtImg src="/img/icons/mono/chevron-light-bottom.svg" :class="['landing-calculation__journey__invest-select-amount-arrow landing-calculation__journey__invest-select-arrow aspect-square cursor-pointer', {'rotate-180': showAmountDropdown}]" alt="Down arrow icon"/>
              </div>
            </div>
            <div v-on-click-outside="outSideClick"  v-if="showAmountDropdown" :class="[{'landing-calculation__journey__invest-select-amount-dropdown-reinvest': orderType === 'btc' || orderType === 'usdt', 'landing-calculation__journey__invest-select-amount-dropdown-btc': selectedCurrency.value === 'BTC', 'landing-calculation__journey__invest-select-amount-dropdown-usdt': selectedCurrency.value === 'USDT'}]"  class="landing-calculation__journey__invest-select-amount-dropdown landing-calculation__journey__invest-select-dropdown w-full absolute mt-1 z-10">
              <ul class=" text-sm font-medium">
                <li v-for="amount in amounts" :key="amount.amount" @click="selectAmount(amount.amount)" :class="[{'landing-calculation__journey__invest-select-amount-dropdown-item-active': amount.amount === currentAmount},'landing-calculation__journey__invest-select-amount-dropdown-item landing-calculation__journey__invest-select-dropdown-item cursor-pointer']">
                  {{ amount.amount !== 'CUSTOM' ? '$' : ''}} {{amount.amount}}
                  <a-icon
                    class="landing-calculation__journey__invest-select-amount-check"
                    v-if="amount.amount === currentAmount"
                    :name="Icon.MonoActionCheckMark"
                    width="18"
                    height="18"
                  />

                </li>
              </ul>
            </div>
          </div>

        </div>

        <VueWriter :start="1100" :typeSpeed="60" :class="{'landing-calculation__journey__invest--text-reinvest':orderType == 'btc' || orderType == 'usdt'}" class="mx-auto landing-calculation__journey__invest--text-main landing-calculation__journey--text-normal landing-calculation__journey__invest--text-secondary landing-calculation__journey__invest--text-spacing font-medium text-center" :array="[ orderType == 'btc' || orderType == 'usdt' ? 'and increase my' : 'and receive my daily']" :iterations="1" />
      </p>

      <div class="mx-auto landing-calculation__journey__invest--text-main landing-calculation__journey--text-normal landing-calculation__journey__invest--text-secondary landing-calculation__journey__invest--text-spacing flex items-center gap-2 font-medium text-center whitespace-nowrap">
        <VueWriter :start="2300" :typeSpeed="60" :class="{'landing-calculation__journey__invest--text-reinvest':orderType == 'btc' || orderType == 'usdt'}" class="grow" :array="[ orderType == 'btc' || orderType == 'usdt' ? 'daily dividends in' : 'dividends in']" :iterations="1" />

        <div class="relative">
          <div class="landing-calculation__journey__invest-select flex text-center whitespace-nowrap">
            <div @click="toggleCurrencyDropdown" class="relative flex items-center justify-center gap-4 cursor-pointer">
              <NuxtImg :src="selectedCurrency.icon" class="landing-calculation__journey__invest-select-currency aspect-square cursor-pointer" alt="USDT logo" loading="lazy"/>
              <span class="landing-calculation__journey__invest-select-text landing-calculation__journey__invest--text-primary landing-calculation__journey--text-normal">{{ selectedCurrency.value }}</span>
              <NuxtImg v-if="orderType !== 'btc' && orderType !== 'usdt'" src="/img/icons/mono/chevron-light-bottom.svg" :class="['landing-calculation__journey__invest-select-arrow aspect-square cursor-pointer', {'rotate-180': showDropdown}]" alt="Down arrow icon"/>
            </div>
          </div>
          <div  v-on-click-outside="() => showDropdown = false"  v-if="showDropdown && orderType !== 'btc' && orderType !== 'usdt'" :class="[{'landing-calculation__journey__invest-select-dropdown-btc': selectedCurrency.value === 'BTC', 'landing-calculation__journey__invest-select-dropdown-usdt': selectedCurrency.value === 'USDT'}]" class="landing-calculation__journey__invest-select-dropdown w-full absolute mt-1 z-10">
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

        <div :class="['landing-calculation__journey__invest--card-inner', {'landing-calculation__journey__invest--card-inner-flip': selectedCurrency.value === 'BTC'}]">

          <!-- FRONT -->
          <div class="landing-calculation__journey__invest--card landing-calculation__journey__invest--card-front landing-calculation__journey__invest-font flex overflow-hidden relative flex-col justify-center w-full rounded-lg">
            <!-- <NuxtImg src="/img/icons/colorful/usdt.svg" class="landing-calculation__journey__invest--card-icon w-6 aspect-square cursor-pointer" alt="USDT logo" /> -->
            <p class="landing-calculation__journey__invest--card-title landing-calculation__journey--text-normal relative font-semibold text-white text-opacity-80 mx-auto"> In Total Guaranteed Payout </p>
            <p class="landing-calculation__journey__invest--card-sum landing-calculation__journey--text-normal relative font-black text-white mx-auto"> ${{ $app.filters.rounded(investmentAmount + guaranteedPayout * 3, 2)  }} </p><!-- {{ $app.filters.rounded(investmentAmount + guaranteedPayout * 3, 2) }} -->
            <p class="landing-calculation__journey__invest--card-subtitle landing-calculation__journey--text-normal relative font-medium text-white text-opacity-80 mx-auto"> Your Interest + Original Investment Amount </p>
            <div class="landing-calculation__journey__invest--card-line relative shrink-0"></div>
            <div class="landing-calculation__journey__invest--card-stats-wrapper flex relative justify-around ">
              <div class="landing-calculation__journey__invest--card-stats landing-calculation__journey--text-normal flex flex-col text-center">
                <p class="landing-calculation__journey__invest--card-stats-title font-medium text-white text-opacity-80 "> Daily Payout</p>
                <p class="landing-calculation__journey__invest--card-stats-value font-bold text-white">$ {{  $app.filters.rounded(dayliDivs, 1) }}</p>
              </div>
              <div class="landing-calculation__journey--text-normal flex flex-col text-center">
                <p class="landing-calculation__journey__invest--card-stats-title font-medium text-white text-opacity-80"> Total Profit </p>
                <p class="landing-calculation__journey__invest--card-stats-value font-black text-white">{{ selectedCurrency.totalProfit }}</p> <!--$app.filters.rounded((((investmentAmount + guaranteedPayout * 3) - investmentAmount) / investmentAmount) * 100, 1)-->
              </div>
              <div class="landing-calculation__journey--text-normal flex flex-col text-center">
                <p class="landing-calculation__journey__invest--card-stats-title font-medium text-white text-opacity-80"> Monthly Dividends </p>
                <p class="landing-calculation__journey__invest--card-stats-value font-black text-white">${{ $app.filters.rounded(dayliDivs * 31, 1) }}</p>
              </div>
            </div>
            <p class="landing-calculation__journey__invest--card-rating landing-calculation__journey--text-normal relative flex items-center mx-auto">
              Safety Rating
              <span class="landing-calculation__journey__invest--card-rating-stars">
                <span class="inline-flex" v-for="item in new Array(5)">
                  <NuxtImg src="/img/icons/colorful/star.svg" width="18" height="18" loading="lazy"/>
                </span>
              </span>
              5/5
            </p>
            <div class="landing-calculation__journey__invest--card-term landing-calculation__journey--text-normal mx-auto">Term: 1095 Days</div>

          </div>

          <!-- BACK -->

          <!--v-if="selectedCurrency.value === 'BTC'"-->
          <div  class="landing-calculation__journey__invest--card-back landing-calculation__journey__invest--card landing-calculation__journey__invest-font flex overflow-hidden relative flex-col justify-center w-full rounded-lg">
            <!-- <NuxtImg src="/img/icons/colorful/usdt.svg" class="landing-calculation__journey__invest--card-icon w-6 aspect-square cursor-pointer" alt="USDT logo" /> -->
            <p class="landing-calculation__journey__invest--card-title landing-calculation__journey--text-normal relative font-semibold text-white text-opacity-80 mx-auto"> In Total Projected Payout </p>
            <p class="landing-calculation__journey__invest--card-sum landing-calculation__journey--text-normal relative font-black text-white mx-auto"> ${{ $app.filters.rounded(investmentAmount + guaranteedPayout * 3, 1) }} </p>
            <p class="landing-calculation__journey__invest--card-subtitle landing-calculation__journey--text-normal relative font-medium text-white text-opacity-80 mx-auto"> Interest + Original Investment Amount </p>
            <div class="landing-calculation__journey__invest--card-line relative shrink-0"></div>
            <div class="landing-calculation__journey__invest--card-stats-wrapper flex relative justify-around">
              <div class="landing-calculation__journey__invest--card-stats landing-calculation__journey--text-normal flex flex-col text-center">
                <p class="landing-calculation__journey__invest--card-stats-title font-medium text-white text-opacity-80 "> Daily Payout</p>
                <p class="landing-calculation__journey__invest--card-stats-value font-bold text-white">${{ dayliDivsDisplay }}</p> <!--{{ $app.filters.rounded(dayliDivs, 1) }}-->
              </div>
              <div class="landing-calculation__journey--text-normal flex flex-col text-center">
                <p class="landing-calculation__journey__invest--card-stats-title font-medium text-white text-opacity-80"> Total Profit </p>
                <p class="landing-calculation__journey__invest--card-stats-value font-black text-white">{{ selectedCurrency.totalProfit }}</p> <!-- $app.filters.rounded((((investmentAmount + guaranteedPayout * 3) - investmentAmount) / investmentAmount) * 100, 1)-->
              </div>
              <div class="landing-calculation__journey--text-normal flex flex-col text-center">
                <p class="landing-calculation__journey__invest--card-stats-title font-medium text-white text-opacity-80"> Monthly Dividends </p>
                <p class="landing-calculation__journey__invest--card-stats-value font-black text-white">${{ monthlyDivsDisplay  }}</p>
              </div>
            </div>
            <p class="landing-calculation__journey__invest--card-rating landing-calculation__journey--text-normal relative flex items-center mx-auto">
              Safety Rating
              <span class="landing-calculation__journey__invest--card-rating-stars">
                <span class="inline-flex">
                  <NuxtImg src="/img/icons/colorful/star.svg" width="18" height="18" loading="lazy" />
                </span>
                <span class="inline-flex">
                  <NuxtImg src="/img/icons/colorful/star.svg" width="18" height="18" loading="lazy" />
                </span>
                <span class="inline-flex">
                  <NuxtImg src="/img/icons/colorful/star.svg" width="18" height="18" loading="lazy" />
                </span>
                <span class="inline-flex">
                  <NuxtImg src="/img/icons/colorful/star.svg" width="18" height="18" loading="lazy" />
                </span>
                <span class="inline-flex">
                  <NuxtImg src="/img/icons/colorful/star-half.svg" width="18" height="18" loading="lazy" />
                </span>
              </span>
              4.5/5
            </p>
            <div class="landing-calculation__journey__invest--card-term landing-calculation__journey--text-normal mx-auto">Term: 1095 Days</div>

          </div>
        </div>

      </article>
      <button @click="handleContinue" tabindex="0" :class="[{'landing-calculation__journey__button-btc': selectedCurrency.value === 'BTC'}]" class="landing-calculation__journey__button justify-center items-center self-stretch px-16 py-5 text-base font-bold text-white whitespace-nowrap bg-blue-600 rounded-lg"> Buy Bitcoin ETFs </button>
    </div>

    </div>
</template>
<script setup lang="ts">
import {Icon} from "~/src/shared/constants/icons";
import AButton from "~/src/shared/ui/atoms/a-button/a-button.vue";
import AIcon from "~/src/shared/ui/atoms/a-icon/a-icon.vue";
import AInput from "~/src/shared/ui/atoms/a-input/a-input.vue";
import {computed, ref, watch} from "vue";
import {useNuxtApp, useRouter} from "#app";
import VueWriter from 'vue-writer'
import InputNumber from 'primevue/inputnumber';
import { useWindowSize } from '@vueuse/core'
import { vOnClickOutside } from '@vueuse/components'
import { useRoute } from 'vue-router'

const { width } = useWindowSize()
const route = useRoute()
const router = useRouter()

const props = withDefaults(
  defineProps<{
    openSignup?: any
    openPurchase?: any
    isInputDisbled?: boolean
    isUserAuth?: boolean
  }>(),
  {
    openSignup: () => {},
    openPurchase: () => {},
    isInputDisbled: false,
    isUserAuth: false,
  },
)

const { $app } = useNuxtApp()
const emit = defineEmits(['calculator-amount','refCode', 'update:value'])

// invest


const currencies = ref([
  {
    value: 'USDT',
    icon: "/img/icons/colorful/usdt.svg",
    background: "/img/usdtbg2.png",
    stars: 5,
    totalProfit: "42%",
    apy: 14,
    apy3: 42,
  },
  {
    value: 'BTC',
    icon: "/img/icons/colorful/bitcoin.svg",
    background: "/img/bitcoinbg.png",
    stars: 4.5,
    totalProfit: "100%+",
    apy: 33.333333333333333333333333333333,
    apy3: 100

  }, ]);
const selectedCurrency = ref(currencies.value[0]);

let apyValue = ref(selectedCurrency.value.apy);
let apyValue3 = ref(selectedCurrency.value.apy3);
const pickerValue = ref(2500)
const refCode = ref('')
const refCodeValid = ref(false)
const typeAPY = ref('Guaranteed')

const defaultInputWith = ref(width.value < 768 ? 45 : 110);
const defaultInputPlus = ref(width.value < 768 ? 10 : 23);
const inputMaxWidth = ref(defaultInputWith.value);

const investmentAmountDisplay = ref('2,500');
const investmentAmount = ref(2500);
const investmentAmountWithDiscount = ref(2375);

const orderType = computed(() => {
  // return 'usdt';
  return $app.store.user?.info?.account?.order_type && $app.store.user?.info?.account?.order_type !== undefined ? $app.store.user?.info?.account?.order_type : 'init_btc'
});

onMounted(() => {
  $app.api.eth.auth.getUser().then((resp) => {
    $app.store.user.info = resp?.data
  });
})




onMounted(()=>{
  if(localStorage.getItem('investmentAmount')) {

    const temp = Number(localStorage.getItem('investmentAmount'));

    console.log(isNaN(temp), temp);

    investmentAmount.value = isNaN(temp) ? 2500 : temp;
    investmentAmountDisplay.value = String(investmentAmount.value) ;
    $app.store.user.setInvestAmount({amount: Number(investmentAmount.value)});
  }

  $app.store.purchase.type = selectedCurrency.value.value;
})

function validate(event) {
  if (event.keyCode < 48 || event.keyCode > 57) event.returnValue = false;

  // var theEvent = event || window.event;
  // var key = theEvent.keyCode || theEvent.which;
  // key = String.fromCharCode( key );
  // var regex = /[0-9\s\+\-]|\./;
  // if( !regex.test(key) ) {
  //   theEvent.returnValue = false;
  //   if(theEvent.preventDefault) theEvent.preventDefault();
  // }
}

const onPickerValueInput = (event) => {
  const replacedStringValue = event.target.value.replace(/,/g, '').replaceAll('$', '')
  investmentAmount.value = Number(replacedStringValue);
  investmentAmountDisplay.value = replacedStringValue;
  // investmentAmount.value = replacedStringValue


  // let originalNumber = investmentAmount.value;

  // investmentAmount.value = originalNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // $app.store.user.setInvestAmount({amount: {original: Number(originalNumber), parsed: investmentAmount}});

  // // investmentAmount.value = Number(investmentAmount.value.split(",").join(""));
  // investmentAmount.value = investmentAmount.value.split(",").join("");
}

watch(
  () => investmentAmountDisplay.value,
  (newValue) => {
    let tempOriginal = Number(newValue.split(",").join("")); //Number

    if(Number(tempOriginal) > 500000) {
      investmentAmount.value = 500000;
      investmentAmountDisplay.value = '500,000';
    } else {
      investmentAmount.value = Number(tempOriginal);
      const replacedStringValue = tempOriginal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      investmentAmountDisplay.value = replacedStringValue;
    }


  }
)

watch(
  () => investmentAmount.value,
  (newValue) => {
    if (+newValue > 500000) {
      investmentAmount.value = 500000;
    }

    if (+newValue <= 0) {
      investmentAmount.value = 0;
    }
    if(isNaN(newValue)) {
      investmentAmount.value = 2500;
    }

    // if (+newValue < 0) {
    //   investmentAmount.value = 0;
    // }

    localStorage.setItem('investmentAmount', String(investmentAmount.value));
    $app.store.user.setInvestAmount({amount: Number(investmentAmount.value)});

    if(String(newValue).length <= 4) {
      inputMaxWidth.value = defaultInputWith.value;
    } else if(String(newValue).length > 4 && String(newValue).length < 7) {
      inputMaxWidth.value =  defaultInputWith.value+((String(newValue).length - 4)*defaultInputPlus.value);
    }

  },
)

// watch(
//   () => investmentAmount.value,
//   (newValue) => {
//     investmentAmountWithDiscount.value = investmentAmount.value - (investmentAmount.value/100)*5;

//     if(!Number.isInteger(investmentAmountWithDiscount.value)) {
//       investmentAmountWithDiscount.value = investmentAmountWithDiscount.value.toFixed(1)
//     }
//   }
//  )

watch(
  () => width.value,
  (newValue) => {
    if(width.value < 768) {
      defaultInputWith.value = 45;
      defaultInputPlus.value = 10;
    } else {
      defaultInputWith.value = 110;
      defaultInputPlus.value = 23;
    }

    if(String(investmentAmount.value).length <= 4) {
      inputMaxWidth.value = defaultInputWith.value;
    } else if(String(investmentAmount.value).length > 4 && String(investmentAmount.value).length < 7) {
      inputMaxWidth.value =  defaultInputWith.value+((String(investmentAmount.value).length - 4)*defaultInputPlus.value);
    }
  },
)



const dayliDivs = computed(() => {
  return guaranteedPayout.value / 365
  // return Math.trunc( (guaranteedPayout.value / 365) * 100 ) / 100;
})
const dayliDivsDisplay = computed(() => {
  const tempVal = guaranteedPayout.value / 365;
  let resValue = (Math.trunc( tempVal * 100 ) / 100).toString();

  if(tempVal.toString().split(".")[1]?.length > 2) {
    resValue = resValue + "+";
  }
  return resValue;
})

const monthlyDivsDisplay = computed(() => {
  const tempVal = guaranteedPayout.value / 12;
  let resValue = (Math.trunc( tempVal * 100 ) / 100).toString();

  if(tempVal.toString().split(".")[1]?.length > 2) {
    resValue = resValue + "+";
  }
  return resValue;
})

const apyValueComputed = computed(() => {
  return refCodeValid.value === true && typeAPY.value === 'Guaranteed' ? apyValue.value + 5 : apyValue.value
  // return refCodeValid.value === true && typeAPY.value === 'Guaranteed' ? (apyValue3.value/3) + 5 : (apyValue3.value/3)
})

const guaranteedPayout = computed(() => {
  return investmentAmount.value * (apyValueComputed.value / 100)
})



const showDropdown = ref(false);

onMounted(()=>{
  localStorage.setItem("selectedCurrency", JSON.stringify(currencies.value[0])); //for old users
  if(localStorage.getItem("selectedCurrency") && localStorage.getItem("selectedCurrency") !== null) {
    selectedCurrency.value = JSON.parse(localStorage.getItem("selectedCurrency"));
  }
});

watch(
  () => selectedCurrency.value,
  (newValue) => {
    localStorage.setItem("selectedCurrency", JSON.stringify(newValue));
  }
)

const toggleCurrencyDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const selectCurrency = (currency : any) => {
  selectedCurrency.value = currencies.value.find((el) => el.value === currency.value) ?? currencies.value[0];
  $app.store.purchase.type = selectedCurrency.value.value;
  toggleCurrencyDropdown();
}

// amount dropdown

const currentAmount = ref('CUSTOM');

const amounts = ref([
  {
    amount: '100',
  },
  {
    amount: '250',
  },
  {
    amount: '500',
  },
  {
    amount: '1,000',
  },
  {
    amount: '2,500',
  },
  {
    amount: '5,000',
  },
  {
    amount: '10,000',
  },
  {
    amount: '15,000',
  },
  {
    amount: '25,000',
  },
  {
    amount: '50,000',
  },
  {
    amount: '75,000',
  },
  {
    amount: '100,000',
  },
  {
    amount: 'CUSTOM',
  },
]);

const showAmountDropdown = ref(false);

const outSideClick =  (ev) => {
  if(ev.target.className.search('landing-calculation__journey__invest-select-amount') == -1) {
    showAmountDropdown.value = false;
  }
}


const toggleAmountDropdown = () => {
  showAmountDropdown.value = !showAmountDropdown.value;
};

const selectAmount = (amount : any) => {
  if(amount === 'CUSTOM') {
    currentAmount.value = amounts.value.find((el) => el.amount === amount)?.amount ?? amounts.value[0].amount;
  } else {
    const temp = amounts.value.find((el) => el.amount === amount)?.amount ?? amounts.value[0].amount;
    investmentAmountDisplay.value = temp;
    currentAmount.value = temp;
  }

  toggleAmountDropdown();
}

const handleContinue = () => {
  if(route.path === '/') {
    router.push("/personal/registration");
  } else {
    if (props.isUserAuth) {
      props.openPurchase();
    } else {
      props.openSignup();
    }
  }
}
</script>

<style lang="scss" src="./m-profit-calculator-new.scss" />
