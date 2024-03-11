<template>
  <div class="landing-calculation__journey" :class="[{'landing-calculation__journey-btc': selectedCurrency.value === 'Bitcoin'}]">

    <NuxtImg class="landing-calculation__journey-bg1" src="/img/tetherspecial/bg-img1.png" />
    <NuxtImg class="landing-calculation__journey-bg2" src="/img/tetherspecial/bg-img2.png"/>

    <div class="landing-calculation__journey-title">Start your bitcoin etf journey 🚀</div>
    <div class="landing-calculation__journey__invest flex flex-col justify-end items-start"> <!--max-w-[375px]-->
      <header class="mx-auto landing-calculation__journey__invest-text flex items-center font-medium text-center whitespace-nowrap"> <!--gap-4-->
        <VueWriter :typeSpeed="60" class="landing-calculation__journey__invest--text-main landing-calculation__journey--text-normal landing-calculation__journey__invest--text-secondary grow" :array="['I want to invest']" :iterations="1" />

        <div class="landing-calculation__journey__invest-input landing-calculation__journey__invest--text-primary ml-4 grow flex justify-center font-semibold">
          <span class="landing-calculation__journey__invest--text-input landing-calculation__journey--text-normal flex items-center">$</span>
          <!-- <input :style="'max-width: '+inputMaxWidth+'px'" v-model="investmentAmountModified" class="landing-calculation__journey__invest--text-input landing-calculation__journey--text-normal flex-1 bg-transparent" placeholder="2,500"/> -->
          <input
            :style="'max-width: '+inputMaxWidth+'px'"
            :value="investmentAmount"
            class="landing-calculation__journey__invest--text-input landing-calculation__journey--text-normal flex-1 bg-transparent"
            placeholder="2,500"
            type="text"
            @keypress="validate"
            :min="1"
            :max="10000000"
            @input="onPickerValueInput"
          />
        </div>

      </header>
      <VueWriter :start="1100" :typeSpeed="60" class="mx-auto landing-calculation__journey__invest--text-main landing-calculation__journey--text-normal landing-calculation__journey__invest--text-secondary landing-calculation__journey__invest--text-spacing font-medium text-center" :array="['and receive my daily']" :iterations="1" />
      <div class="mx-auto landing-calculation__journey__invest--text-main landing-calculation__journey--text-normal landing-calculation__journey__invest--text-secondary landing-calculation__journey__invest--text-spacing flex items-center gap-2 font-medium text-center whitespace-nowrap">
        <VueWriter :start="2300" :typeSpeed="60" class="grow" :array="['dividends in']" :iterations="1" />

        <div class="relative">
          <div class="landing-calculation__journey__invest-select flex text-center whitespace-nowrap">
            <div @click="toggleCurrencyDropdown" class="relative flex items-center justify-center gap-4 cursor-pointer">
              <NuxtImg :src="selectedCurrency.icon" class="landing-calculation__journey__invest-select-currency aspect-square cursor-pointer" alt="USDT logo" />
              <span class="landing-calculation__journey__invest-select-text landing-calculation__journey__invest--text-primary landing-calculation__journey--text-normal">{{ selectedCurrency.value }}</span>
              <NuxtImg src="/img/icons/mono/chevron-light-bottom.svg" :class="['landing-calculation__journey__invest-select-arrow aspect-square cursor-pointer', {'rotate-180': showDropdown}]" alt="Down arrow icon"/>
            </div>
          </div>
          <div v-if="showDropdown" :class="[{'landing-calculation__journey__invest-select-dropdown-btc': selectedCurrency.value === 'Bitcoin', 'landing-calculation__journey__invest-select-dropdown-usdt': selectedCurrency.value === 'USDT'}]" class="landing-calculation__journey__invest-select-dropdown w-full absolute mt-1 z-10">
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
            <p class="landing-calculation__journey__invest--card-sum landing-calculation__journey--text-normal relative font-black text-white mx-auto"> ${{ $app.filters.rounded(investmentAmount + guaranteedPayout * 3, 1) }} </p>
            <p class="landing-calculation__journey__invest--card-subtitle landing-calculation__journey--text-normal relative font-medium text-white text-opacity-80 mx-auto"> Your Interest + Original Investment Amount </p>
            <div class="landing-calculation__journey__invest--card-line relative shrink-0"></div>
            <div class="landing-calculation__journey__invest--card-stats-wrapper flex relative justify-around ">
              <div class="landing-calculation__journey__invest--card-stats landing-calculation__journey--text-normal flex flex-col text-center">
                <p class="landing-calculation__journey__invest--card-stats-title font-medium text-white text-opacity-80 "> Daily Payout</p>
                <p class="landing-calculation__journey__invest--card-stats-value font-bold text-white">${{ $app.filters.rounded(dayliDivs, 1) }}</p>
              </div>
              <div class="landing-calculation__journey--text-normal flex flex-col text-center">
                <p class="landing-calculation__journey__invest--card-stats-title font-medium text-white text-opacity-80"> Total Profit </p>
                <p class="landing-calculation__journey__invest--card-stats-value font-black text-white">{{ $app.filters.rounded((((investmentAmount + guaranteedPayout * 3) - investmentAmount) / investmentAmount) * 100, 1) }}%</p>
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
            <p class="landing-calculation__journey__invest--card-sum landing-calculation__journey--text-normal relative font-black text-white mx-auto"> ${{ $app.filters.rounded(investmentAmount + guaranteedPayout * 3, 1) }} </p>
            <p class="landing-calculation__journey__invest--card-subtitle landing-calculation__journey--text-normal relative font-medium text-white text-opacity-80 mx-auto"> Interest + Original Investment Amount </p>
            <div class="landing-calculation__journey__invest--card-line relative shrink-0"></div>
            <div class="landing-calculation__journey__invest--card-stats-wrapper flex relative justify-around">
              <div class="landing-calculation__journey__invest--card-stats landing-calculation__journey--text-normal flex flex-col text-center">
                <p class="landing-calculation__journey__invest--card-stats-title font-medium text-white text-opacity-80 "> Daily Payout</p>
                <p class="landing-calculation__journey__invest--card-stats-value font-bold text-white">${{ $app.filters.rounded(dayliDivs, 1) }}</p>
              </div>
              <div class="landing-calculation__journey--text-normal flex flex-col text-center">
                <p class="landing-calculation__journey__invest--card-stats-title font-medium text-white text-opacity-80"> Total Profit </p>
                <p class="landing-calculation__journey__invest--card-stats-value font-black text-white">{{ $app.filters.rounded((((investmentAmount + guaranteedPayout * 3) - investmentAmount) / investmentAmount) * 100, 1) }}%</p>
              </div>
              <div class="landing-calculation__journey--text-normal flex flex-col text-center">
                <p class="landing-calculation__journey__invest--card-stats-title font-medium text-white text-opacity-80"> Monthly Dividends </p>
                <p class="landing-calculation__journey__invest--card-stats-value font-black text-white">${{ $app.filters.rounded(dayliDivs  * 31, 1) }}</p>
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
</template>
<script setup lang="ts">
import {Icon} from "~/src/shared/constants/icons";
import AButton from "~/src/shared/ui/atoms/a-button/a-button.vue";
import AIcon from "~/src/shared/ui/atoms/a-icon/a-icon.vue";
import AInput from "~/src/shared/ui/atoms/a-input/a-input.vue";
import {computed, ref, watch} from "vue";
import {useNuxtApp} from "#app";
import VueWriter from 'vue-writer'
import InputNumber from 'primevue/inputnumber';
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()

console.log("width", width.value  )

const props = withDefaults(
  defineProps<{
    openSignup: any
  }>(),
  {
    openSignup: () => {},
  },
)

const { $app } = useNuxtApp()
const emit = defineEmits(['calculator-amount','refCode', 'update:value'])

// invest
let apyValue = ref(14)
const pickerValue = ref(2500)
const refCode = ref('')
const refCodeValid = ref(false)
const typeAPY = ref('Guaranteed')

const defaultInputWith = ref(width.value < 768 ? 40 : 100);
const defaultInputPlus = ref(width.value < 768 ? 10 : 20);
const inputMaxWidth = ref(defaultInputWith.value);

// const investmentAmount = ref('2,500');
const investmentAmount = ref(2500);
const investmentAmountWithDiscount = ref(2375);

onMounted(()=>{
  if(localStorage.getItem('investmentAmount')) {
    investmentAmount.value = Number(localStorage.getItem('investmentAmount'));
    $app.store.user.setInvestAmount({amount: Number(investmentAmount.value)});
  }
})

function validate(event) {
  console.log(event);
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
  investmentAmount.value = Number(replacedStringValue)


  let originalNumber = investmentAmount.value;

  investmentAmount.value = originalNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  $app.store.user.setInvestAmount({amount: {original: Number(originalNumber), parsed: investmentAmount}});

  investmentAmount.value = Number(investmentAmount.value.split(",").join(""));
}

watch(
  () => investmentAmount.value,
  (newValue) => {
    if (+newValue > 500000) {
      investmentAmount.value = 500000;
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
      defaultInputWith.value = 40;
      defaultInputPlus.value = 10;
    } else {
      defaultInputWith.value = 100;
      defaultInputPlus.value = 20;
    }

    if(String(investmentAmount.value).length <= 4) {
      inputMaxWidth.value = defaultInputWith.value;
    } else if(String(investmentAmount.value).length > 4 && String(investmentAmount.value).length < 7) {
      inputMaxWidth.value =  defaultInputWith.value+((String(investmentAmount.value).length - 4)*defaultInputPlus.value);
    }
  },
)



const dayliDivs = computed(() => {
  return (guaranteedPayout.value / 365).toFixed(2)
})

const apyValueComputed = computed(() => {
  return refCodeValid.value === true && typeAPY.value === 'Guaranteed' ? apyValue.value + 5 : apyValue.value
})

const guaranteedPayout = computed(() => {
  return investmentAmount.value * (apyValueComputed.value / 100)
})

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

const handleContinue = () =>{
  const element = document.querySelector(".landing-calculation__signup");
  let headerOffset
  if (window.innerWidth < 768) {
    headerOffset = 145;
  } else {
    headerOffset = 155;
  }
  const elementPosition = element.offsetTop;
  const offsetPosition = elementPosition  - headerOffset; //+ window.pageYOffset

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
  props.openSignup();
}
</script>

<style lang="scss" src="./m-profit-calculator-new.scss" />
