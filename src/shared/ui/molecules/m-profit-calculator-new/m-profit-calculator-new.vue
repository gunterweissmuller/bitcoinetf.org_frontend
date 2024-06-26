<template>
  <div class="landing-calculation__journey" :class="[{'landing-calculation__journey-btc': selectedCurrency.value === 'BTC'}]">

    <NuxtImg class="landing-calculation__journey-bg1" src="/img/tetherspecial/bg-img1.png" loading="lazy" />
    <NuxtImg class="landing-calculation__journey-bg2" src="/img/tetherspecial/bg-img2.png" loading="lazy" />

    <div class="landing-calculation__journey-title">Start your bitcoin etf journey 🚀</div>
    <div class="landing-calculation__journey__invest flex flex-col justify-end items-start"> <!--max-w-[375px]-->
      <header class="mx-auto landing-calculation__journey__invest--text flex items-center font-medium text-center whitespace-nowrap">
        <VueWriter :typeSpeed="60" :class="{'landing-calculation__journey__invest--text-reinvest':orderType == 'btc' || orderType == 'usdt'}" class="landing-calculation__journey__invest--text-main landing-calculation__journey--text-normal landing-calculation__journey__invest--text-secondary grow" :array="[ orderType == 'btc' || orderType == 'usdt' ? 'I want to invest additional' : 'I want to invest']" :iterations="1" />
        <a-dropdown-amount
        v-if="orderType != 'btc' && orderType != 'usdt'"
          option-value="modifyValue"
            :model-value="selectedAmount"
            :options="amounts"
            :isInputField="selectedAmount.value == null"
            :amount="investmentAmount"
            :type="selectedCurrency.value.toLowerCase()"
            size="big"
            @update:model-value="selectAmount"
            @update:amount-value="updateAmountValue"
        />

      </header>
      <div class="flex gap-2 justify-center w-full" >
        <a-dropdown-amount
            v-if="orderType === 'btc' || orderType === 'usdt'"
            option-value="modifyValue"
            :model-value="selectedAmount"
            :options="amounts"
            :isInputField="selectedAmount.value == null"
            :amount="investmentAmount"
            :type="selectedCurrency.value.toLowerCase()"
            size="big"
            @update:model-value="selectAmount"
            @update:amount-value="updateAmountValue"
        />

        <VueWriter  :start="1100" :typeSpeed="60" :class="{'landing-calculation__journey__invest--text-reinvest':orderType == 'btc' || orderType == 'usdt'}" class=" landing-calculation__journey__invest--text-main landing-calculation__journey--text-normal landing-calculation__journey__invest--text-secondary landing-calculation__journey__invest--text-spacing font-medium text-center" :array="[ orderType == 'btc' || orderType == 'usdt' ? 'and increase my' : 'and receive my daily']" :iterations="1" />
      </div>

      <div class="mx-auto landing-calculation__journey__invest--text-main landing-calculation__journey--text-normal landing-calculation__journey__invest--text-secondary landing-calculation__journey__invest--text-spacing flex items-center font-medium text-center whitespace-nowrap">
        <VueWriter :start="2300" :typeSpeed="60" :class="{'landing-calculation__journey__invest--text-reinvest':orderType == 'btc' || orderType == 'usdt'}" class="grow" :array="[ orderType == 'btc' || orderType == 'usdt' ? 'daily dividends in' : 'dividends in']" :iterations="1" />

        <div class="ml-2 relative">
          <a-dropdown-selector
            :model-value="selectedCurrency"
            :options="currencies"
            option-key="icon"
            option-value="value"
            @update:model-value="selectCurrencyItem"
            :type="selectedCurrency.value.toLowerCase()"
            size="big"
          />

        </div>

      </div>

      <article class="landing-calculation__journey__invest--card-wrapper flex flex-col self-stretch whitespace-nowrap rounded-lg">

        <div :class="['landing-calculation__journey__invest--card-inner', {'landing-calculation__journey__invest--card-inner-flip': selectedCurrency.value === 'BTC'}]">
          <!-- FRONT -->
          <div class="landing-calculation__journey__invest--card landing-calculation__journey__invest--card-front landing-calculation__journey__invest-font flex  relative flex-col justify-center w-full rounded-lg">
            <!-- <NuxtImg src="/img/icons/colorful/usdt.svg" class="landing-calculation__journey__invest--card-icon w-6 aspect-square cursor-pointer" alt="USDT logo" /> -->
            <p class="landing-calculation__journey__invest--card-title landing-calculation__journey--text-normal relative font-semibold text-white text-opacity-80 mx-auto"> In Total Guaranteed Payout </p>
            <p class="landing-calculation__journey__invest--card-sum landing-calculation__journey--text-normal relative font-black text-white mx-auto" @click.stop="showAmountDropdown = true"> ${{ $app.filters.rounded(investmentAmount + guaranteedPayout * 3, 2)  }} </p><!-- {{ $app.filters.rounded(investmentAmount + guaranteedPayout * 3, 2) }} -->
            <p class="landing-calculation__journey__invest--card-subtitle landing-calculation__journey--text-normal relative font-medium text-white text-opacity-80 mx-auto"> Your Interest + Original Investment Amount </p>
            <div class="landing-calculation__journey__invest--card-line relative shrink-0"></div>
            <div class="landing-calculation__journey__invest--card-stats-wrapper flex relative justify-around ">
              <div class="landing-calculation__journey__invest--card-stats landing-calculation__journey--text-normal flex flex-col text-center">
                <p class="landing-calculation__journey__invest--card-stats-title font-medium text-white text-opacity-80 "> Daily Payout</p>
                <p class="landing-calculation__journey__invest--card-stats-value font-bold text-white">$ {{  dayliDivsDisplay }}</p>
              </div>
              <div class="landing-calculation__journey--text-normal flex flex-col text-center">
                <p class="landing-calculation__journey__invest--card-stats-title font-medium text-white text-opacity-80"> Total Profit </p>
                <p class="landing-calculation__journey__invest--card-stats-value font-black text-white">{{ selectedCurrency.totalProfit }}</p> <!--$app.filters.rounded((((investmentAmount + guaranteedPayout * 3) - investmentAmount) / investmentAmount) * 100, 1)-->
              </div>
              <div class="landing-calculation__journey--text-normal flex flex-col text-center">
                <p class="landing-calculation__journey__invest--card-stats-title font-medium text-white text-opacity-80"> Monthly Dividends </p>
                <p class="landing-calculation__journey__invest--card-stats-value font-black text-white">${{ monthlyDivsDisplay }}</p>
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
            <!-- <div class="landing-calculation__journey__invest--card-term landing-calculation__journey--text-normal mx-auto">Term: 1095 Days</div> -->

          </div>

          <!-- BACK -->

          <!--v-if="selectedCurrency.value === 'BTC'"-->
          <div  class="landing-calculation__journey__invest--card-back landing-calculation__journey__invest--card landing-calculation__journey__invest-font flex  relative flex-col justify-center w-full rounded-lg">
            <!-- <NuxtImg src="/img/icons/colorful/usdt.svg" class="landing-calculation__journey__invest--card-icon w-6 aspect-square cursor-pointer" alt="USDT logo" /> -->
            <p class="landing-calculation__journey__invest--card-title landing-calculation__journey--text-normal relative font-semibold text-white text-opacity-80 mx-auto"> In Total Projected Payout </p>
            <p class="landing-calculation__journey__invest--card-sum landing-calculation__journey--text-normal relative font-black text-white mx-auto" @click.stop="showAmountDropdown = true"> ${{ roundedGuaranteedPayout }} </p>
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
          </div>
        </div>

      </article>
      <button @click="handleContinue" :disabled="investmentAmount < 100" tabindex="0" :class="[{'landing-calculation__journey__button-btc': selectedCurrency.value === 'BTC'}]" class="landing-calculation__journey__button justify-center items-center self-stretch px-16 py-5 text-base font-bold text-white whitespace-nowrap bg-blue-600 rounded-lg"> Buy Bitcoin ETFs </button>
      <div class="landing-calculation__journey__error-message" v-if="investmentAmount < 100">The minimum investment amount must be at least 100</div>
    </div>

    </div>
</template>
<script setup lang="ts">
import {Icon} from "~/src/shared/constants/icons";
import AButton from "~/src/shared/ui/atoms/a-button/a-button.vue";
import AIcon from "~/src/shared/ui/atoms/a-icon/a-icon.vue";
import AInput from "~/src/shared/ui/atoms/a-input/a-input.vue";
import ADropdownSelector from "../../atoms/a-dropdown-selector/a-dropdown-selector.vue";
import ADropdownAmount from "../../atoms/a-dropdown-amount/a-dropdown-amount.vue";

import {computed, ref, watch} from "vue";
import {useNuxtApp, useRouter} from "#app";
import VueWriter from 'vue-writer'
import { useWindowSize } from '@vueuse/core'
import { vOnClickOutside } from '@vueuse/components'
import { useRoute } from 'vue-router'
import { useRegistration } from "../../promolandings/landing-registration/useRegistration";

const { width } = useWindowSize()
const route = useRoute()
const router = useRouter()

const props = withDefaults(
  defineProps<{
    openSignup?: any
    openPurchase?: any
    isInputDisbled?: boolean
    disabledAmount?: boolean
  }>(),
  {
    openSignup: () => {},
    openPurchase: () => {},
    isInputDisbled: false,
    disabledAmount: false
  },
)

const { $app } = useNuxtApp()
const {isUserAuthenticated} = useRegistration($app);
const emit = defineEmits(['calculator-amount','refCode', 'update:value'])

// invest
const currencies = ref([
  {
    id:0,
    value: 'USDT',
    icon: Icon.ColorfulUsdt,
    background: "/img/usdtbg2.png",
    stars: 5,
    totalProfit: "42%",
    apy: 14,
    apy3: 42,
  },
  {
    id:1,
    value: 'BTC',
    icon: Icon.ColorfulBitcoin,
    background: "/img/bitcoinbg.png",
    stars: 4.5,
    totalProfit: "100%+",
    apy: 33.333333333333333333333333333333,
    apy3: 100

  }
]);

const orderType = computed(() => {
  return $app.store.user?.info?.account?.order_type && $app.store.user?.info?.account?.order_type !== undefined ? $app.store.user?.info?.account?.order_type : 'init_btc'
});

const selectedCurrency = ref( orderType.value === 'init_btc' ? currencies.value[Math.floor((Math.random() * 2) + 0)] : orderType.value === 'usdt' ? currencies.value[0] : orderType.value === 'btc' ? currencies.value[1] : currencies.value[0]);

let apyValue = computed(() => selectedCurrency.value.apy);
const refCodeValid = ref(false)
const typeAPY = ref('Guaranteed')

const defaultInputWith = ref(width.value < 768 ? 45 : 110);
const defaultInputPlus = ref(width.value < 768 ? 10 : 23);
const inputMaxWidth = ref(defaultInputWith.value);

const investmentAmountDisplay = ref('2,500');
const investmentAmount = ref(2500);

onMounted(() => {
  const { isUserAuthenticated } = $app.store.auth

  if (isUserAuthenticated) {
    $app.api.eth.auth.getUser().then((resp) => {
      $app.store.user.info = resp?.data
    });
  }
})

onMounted(()=>{
  if(localStorage.getItem('investmentAmount')) {

    const temp = Math.ceil(Number(localStorage.getItem('investmentAmount')));

    if(!isNaN(temp)) {
      investmentAmount.value = isNaN(temp) ? 2500 : temp;
      investmentAmountDisplay.value = String(investmentAmount.value) ;
      $app.store.user.setInvestAmount({amount: Number(investmentAmount.value)});
    }
  }

  $app.store.purchase.type = selectedCurrency.value.value;
})

function validate(event) {
  if (event.keyCode < 48 || event.keyCode > 57) event.returnValue = false;
}


// watch(
//   () => investmentAmount.value,
//   (newValue, oldValue) => {
//     // let tempOriginal = Math.ceil(Number(newValue.split(",").join(""))); //Number

//     // if(isNaN(tempOriginal)) {
//     //   investmentAmount.value = Number(oldValue.split(",").join(""));
//     //   investmentAmountDisplay.value = oldValue;
//     //   return;
//     // }
//     console.log('new-->',newValue);

//     if(Number(newValue) > 500000) {
//       investmentAmount.value = 500000;
//     } else {
//       // investmentAmount.value = Number(tempOriginal);
//       // const replacedStringValue = tempOriginal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//       // investmentAmountDisplay.value = replacedStringValue;
//     }
//   }
// )

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

    localStorage.setItem('investmentAmount', String(investmentAmount.value));
    $app.store.user.setInvestAmount({amount: Number(investmentAmount.value)});
    $app.store.purchase.amount = newValue
    $app.store.purchase.amountUS = newValue
    if(String(newValue).length <= 4) {
      inputMaxWidth.value = defaultInputWith.value;
    } else if(String(newValue).length > 4 && String(newValue).length < 7) {
      inputMaxWidth.value =  defaultInputWith.value+((String(newValue).length - 4)*defaultInputPlus.value);
    }
  },
)

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
})

const guaranteedPayout = computed(() => {
  return investmentAmount.value * (apyValueComputed.value / 100)
})

const roundedGuaranteedPayout = computed(() => {
  return $app.filters.roundedFixed(investmentAmount.value + guaranteedPayout.value * 3, 2)

})

const selectCurrencyItem = (currency:any) => {
  selectedCurrency.value = currency
  $app.store.purchase.type = currency.value
}

// amount dropdown
const currentAmount = ref('CUSTOM');


const amounts = ref([
  {
    id: 0,
    value: 100,
    modifyValue: '100',
  },
  {
    id: 1,
    value: 250,
    modifyValue: '250',
  },
  {
    id: 2,
    value: 500,
    modifyValue: '500',
  },
  {
    id: 3,
    value: 1000,
    modifyValue: '1,000',
  },
  {
    id: 4,
    value: 2500,
    modifyValue: '2,500',
  },
  {
    id: 5,
    value: 5000,
    modifyValue: '5,000',
  },
  {
    id: 6,
    value: 10000,
    modifyValue: '10,000',
  },
  {
    id: 7,
    value: 15000,
    modifyValue: '15,000',
  },
  {
    id: 8,
    value: 25000,
    modifyValue: '25,000',
  },
  {
    id: 9,
    value: 50000,
    modifyValue: '50,000',
  },
  {
    id: 10,
    value: 75000,
    modifyValue: '75,000',
  },
  {
    id: 11,
    value: 100000,
    modifyValue: '100,000',
  },
  {
    id: 12,
    value: null,
    modifyValue: 'CUSTOM',
  },
])

const selectedAmount = ref(amounts.value[0])
onMounted(() => {
  selectedAmount.value = amounts.value.find(el => el.value == $app.store.purchase?.amount) || amounts.value[amounts.value.length - 1]
})

const showAmountDropdown = ref(false);

const outSideClick =  (ev) => {
  if(ev.target.className.search('landing-calculation__journey__invest-select-amount') == -1) {
    showAmountDropdown.value = false;
  }
}

const toggleAmountDropdown = () => {
  if (props.disabledAmount || props.isInputDisbled) return
  showAmountDropdown.value = !showAmountDropdown.value;
};

function selectAmount(payload) {
  selectedAmount.value = payload

  if (payload.value !== null) {
    updateAmountValue(payload.value)
  }
}

function updateAmountValue(event: string | number) {
  investmentAmount.value = Number(event)
}

const handleContinue = () => {
  if (isUserAuthenticated.value) {
    router.push({
    name: 'personal-fund',
    query: {
      fromRoute: 'tetherspecial',
      action: 'open-buy-shares'
    },
  })
    return
  }

  $app.store.purchase.type = selectedCurrency.value.value;
  $app.store.purchase.amount = investmentAmount.value;
  $app.store.purchase.amountUS = investmentAmount.value;
  router.push({
    name: 'personal-registration',
    query: {
      fromRoute: 'tetherspecial',
    },
  })
}
</script>

<style lang="scss" src="./m-profit-calculator-new.scss" />
