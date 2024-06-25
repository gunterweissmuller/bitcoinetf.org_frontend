<template>
  <div class="e-invest w-full">
    <!--orderType == 'init_btc'--><m-modal v-if="orderType == 'init_btc'"  bgBasic @close="closeModal" full-screen v-model="isOpen"> <!--v-if="orderType == 'init_btc' || orderType == 'btc'"-->

      <div class="e-invest__invest flex flex-col justify-end items-start"> <!--max-w-[375px]-->
          <header class="e-invest__invest-text flex items-center font-medium text-center whitespace-nowrap">
            <!-- <VueWriter :typeSpeed="60" class="e-invest__invest--text-main e-invest--text-normal e-invest__invest--text-secondary grow" :array="['I want to invest']" :iterations="1" /> -->
            <h1 class="e-invest__invest--text-main e-invest--text-normal e-invest__invest--text-secondary grow mr-2">I want to invest</h1>

            <a-dropdown-amount
              option-value="modifyValue"
              scroll
              :model-value="selectedAmount"
              :options="amounts"
              :isInputField="selectedAmount.value == null"
              :amount="investmentAmount"
              @update:model-value="selectAmount"
              @update:amount-value="updateAmountValue"
            />

          </header>
          <!-- <VueWriter :start="1100" :typeSpeed="60" class="e-invest__invest--text-main e-invest--text-normal e-invest__invest--text-secondary e-invest__invest--text-spacing font-medium text-center" :array="['and receive my daily']" :iterations="1" /> -->
          <p class="e-invest__invest--text-main e-invest--text-normal e-invest__invest--text-secondary e-invest__invest--text-spacing font-medium text-center">and receive my daily</p>
          <div class="e-invest__invest--text-main e-invest--text-normal e-invest__invest--text-secondary e-invest__invest--text-spacing flex items-center font-medium text-center whitespace-nowrap">
            <!-- <VueWriter :start="2300" :typeSpeed="60" class="grow" :array="['dividends in']" :iterations="1" /> -->
            <span class="grow mr-4">dividends in</span>
            <a-dropdown-selector
              :model-value="selectedCurrency"
              :options="currencies"
              option-key="icon"
              option-value="value"
              @update:model-value="selectCurrencyItem"
            />

          </div>

          <article class="e-invest__invest--card-wrapper flex flex-col self-stretch whitespace-nowrap rounded-lg">

            <div :class="['e-invest__invest--card-inner', {'e-invest__invest--card-inner-flip': selectedCurrency.value === 'BTC'}]">

              <!-- FRONT -->
              <div class="e-invest__invest--card e-invest__invest--card-front e-invest__invest-font flex overflow-hidden relative flex-col justify-center w-full rounded-lg">
                <NuxtImg src="/img/icons/colorful/usdt.svg" class="e-invest__invest--card-icon aspect-square cursor-pointer" alt="USDT logo" loading="lazy" />
                <p class="e-invest__invest--card-title e-invest--text-normal relative font-semibold text-white text-opacity-80">In Total Guaranteed Payout</p>
                <p class="e-invest__invest--card-sum e-invest--text-normal relative font-black text-white"> ${{ $app.filters.rounded(investmentAmount + guaranteedPayout * 3, 2)  }} </p>
                <p class="e-invest__invest--card-subtitle e-invest--text-normal relative font-medium text-white text-opacity-80"> Your Interest + Original Investment Amount </p>
                <div class="e-invest__invest--card-line"></div>
                <div class="flex relative">
                  <div class="e-invest__invest--card-stats e-invest--text-normal flex flex-col flex-1">
                    <p class="e-invest__invest--card-stats-title font-medium text-white text-opacity-80"> Daily Payout</p>
                    <p class="e-invest__invest--card-stats-value font-bold text-white">$ {{  $app.filters.rounded(dayliDivs, 2) }}</p>
                  </div>
                  <div class="e-invest--text-normal flex flex-col flex-1">
                    <p class="e-invest__invest--card-stats-title font-medium text-white text-opacity-80"> Total Profit </p>
                    <p class="e-invest__invest--card-stats-value font-black text-white">{{ selectedCurrency.totalProfit }}</p>
                  </div>
                  <div class="e-invest--text-normal flex flex-col flex-1">
                    <p class="e-invest__invest--card-stats-title font-medium text-white text-opacity-80"> Monthly Dividends </p>
                    <p class="e-invest__invest--card-stats-value font-black text-white">$ {{ $app.filters.rounded(dayliDivs * 31, 2) }}</p>
                  </div>
                </div>
                <p class="e-invest__invest--card-rating e-invest--text-normal relative flex items-center">
                  Safety Rating
                  <span class="e-invest__invest--card-rating-stars">
                    <span class="inline-flex" v-for="item in new Array(5)">
                      <NuxtImg src="/img/icons/colorful/star.svg" width="18" height="18" loading="lazy" />
                    </span>
                  </span>
                  5/5
                </p>

              </div>

              <!-- BACK -->
              <div  class="e-invest__invest--card-back e-invest__invest--card e-invest__invest-font flex overflow-hidden relative flex-col justify-center w-full rounded-lg"> <!-- v-if="selectedCurrency.value === 'BTC'"-->
                <NuxtImg src="/img/icons/colorful/bitcoin.svg" class="e-invest__invest--card-icon w-6 aspect-square cursor-pointer" alt="BTC logo" loading="lazy" />

                <p class="e-invest__invest--card-title e-invest--text-normal relative font-semibold text-white text-opacity-80"> In Total Projected Payout </p>
                <p class="e-invest__invest--card-sum e-invest--text-normal relative font-black text-white"> ${{ $app.filters.rounded(investmentAmount + guaranteedPayout * 3, 2) }} </p>
                <p class="e-invest__invest--card-subtitle e-invest--text-normal relative font-medium text-white text-opacity-80"> Interest + Original Investment Amount </p>
                <div class="e-invest__invest--card-line"></div>
                <div class="flex relative">
                  <div class="e-invest__invest--card-stats e-invest--text-normal flex flex-col flex-1">
                    <p class="e-invest__invest--card-stats-title font-medium text-white text-opacity-80"> Daily Payout</p>
                    <p class="e-invest__invest--card-stats-value font-bold text-white">${{  $app.filters.rounded(dayliDivs, 2) }}</p>
                  </div>
                  <div class="e-invest--text-normal flex flex-col flex-1">
                    <p class="e-invest__invest--card-stats-title font-medium text-white text-opacity-80"> Total Profit </p>
                    <p class="e-invest__invest--card-stats-value font-black text-white">{{ selectedCurrency.totalProfit }}</p>
                  </div>
                  <div class="e-invest--text-normal flex flex-col flex-1">
                    <p class="e-invest__invest--card-stats-title font-medium text-white text-opacity-80"> Monthly Dividends </p>
                    <p class="e-invest__invest--card-stats-value font-black text-white">${{ $app.filters.rounded(dayliDivs * 31, 2) }}</p>
                  </div>
                </div>
                <p class="e-invest__invest--card-rating e-invest--text-normal relative flex items-center">
                  Safety Rating
                  <span class="e-invest__invest--card-rating-stars">
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
          <button @click="handleContinue" tabindex="0" :disabled="investmentAmount < 100" class="e-invest__button justify-center items-center self-stretch px-16 py-5 text-base font-bold text-white whitespace-nowrap bg-blue-600 rounded-lg"> Continue </button>
          <div class="e-invest__error-message">
            <p v-if="investmentAmount < 100">The minimum investment amount must be at least 100</p>
          </div>
        </div>
    </m-modal>

    <!-- REINVEST -->
    <!--orderType == 'usdt' || orderType == 'btc'--><m-modal modalBig v-if="orderType == 'usdt' || orderType == 'btc'"  bgBasic @close="closeModal" full-screen v-model="isOpen"> <!---->
      <div class="e-invest__invest flex flex-col justify-end items-start"> <!--max-w-[375px]-->
          <p class="e-invest__invest--text-main e-invest--text-normal e-invest__invest--text-secondary e-invest__invest--text-spacing font-medium text-center ">
            I want to invest additional
            <a-dropdown-amount
              option-value="modifyValue"
              scroll
              :model-value="selectedAmount"
              :options="amounts"
              :isInputField="selectedAmount.value == null"
              :amount="investmentAmount"
              @update:model-value="selectAmount"
              @update:amount-value="updateAmountValue"
            />
            and increase my daily dividends in
            <div class="ml-2 relative opacity-50 inline-block">
              <div class="e-invest__invest-select flex text-center whitespace-nowrap">
                <div  class="e-invest__invest-select-value">
                  <a-icon :name="selectedCurrency.icon" class="w-6 aspect-square"/>
                  <span class="e-invest__invest-select-text e-invest--text-normal">{{ selectedCurrency.value }}</span>
                </div>
              </div>
            </div>
          </p>

          <article class="e-invest__invest--card-wrapper flex flex-col self-stretch whitespace-nowrap rounded-lg">

            <div :class="['e-invest__invest--card-inner', {'e-invest__invest--card-inner-flip': selectedCurrency.value === 'BTC'}]">

              <!-- FRONT -->
              <div class="e-invest__invest--card e-invest__invest--card-front e-invest__invest-font flex overflow-hidden relative flex-col justify-center w-full rounded-lg">
                <NuxtImg src="/img/icons/colorful/usdt.svg" class="e-invest__invest--card-icon w-6 aspect-square cursor-pointer" alt="USDT logo" loading="lazy" />
                <p class="e-invest__invest--card-title e-invest--text-normal relative font-semibold text-white text-opacity-80"> In Total Guaranteed Payout </p>
                <p class="e-invest__invest--card-sum e-invest--text-normal relative font-black text-white"> ${{ (investmentAmount + guaranteedPayout * 3).toFixed(2) }} </p>
                <p class="e-invest__invest--card-subtitle e-invest--text-normal relative font-medium text-white text-opacity-80"> Your Interest + Original Investment Amount </p>
                <div class="e-invest__invest--card-line"></div>
                <div class="flex relative">
                  <div class="e-invest__invest--card-stats e-invest--text-normal flex flex-col flex-1">
                    <p class="e-invest__invest--card-stats-title font-medium text-white text-opacity-80"> Daily Payout</p>
                    <p class="e-invest__invest--card-stats-value font-bold text-white">${{  $app.filters.rounded(dayliDivs, 1) }}</p>
                  </div>
                  <div class="e-invest--text-normal flex flex-col flex-1">
                    <p class="e-invest__invest--card-stats-title font-medium text-white text-opacity-80"> Total Profit </p>
                    <p class="e-invest__invest--card-stats-value font-black text-white">{{ selectedCurrency.totalProfit }}</p>
                  </div>
                  <div class="e-invest--text-normal flex flex-col flex-1">
                    <p class="e-invest__invest--card-stats-title font-medium text-white text-opacity-80"> Monthly Dividends </p>
                    <p class="e-invest__invest--card-stats-value font-black text-white">${{ $app.filters.rounded(dayliDivs * 31, 1) }}</p>
                  </div>
                </div>
                <p class="e-invest__invest--card-rating e-invest--text-normal relative flex items-center">
                  Safety Rating
                  <span class="e-invest__invest--card-rating-stars">
                    <span class="inline-flex" v-for="item in new Array(5)">
                      <NuxtImg src="/img/icons/colorful/star.svg" width="18" height="18" loading="lazy" />
                    </span>
                  </span>
                  5/5
                </p>

              </div>

              <!-- BACK -->
              <div class="e-invest__invest--card-back e-invest__invest--card e-invest__invest-font flex overflow-hidden relative flex-col justify-center w-full rounded-lg">
                <NuxtImg src="/img/icons/colorful/bitcoin.svg" class="e-invest__invest--card-icon w-6 aspect-square cursor-pointer" alt="BTC logo" loading="lazy" />

                <p class="e-invest__invest--card-title e-invest--text-normal relative font-semibold text-white text-opacity-80"> In Total Projected Payout </p>
                <p class="e-invest__invest--card-sum e-invest--text-normal relative font-black text-white"> ${{ (investmentAmount + guaranteedPayout * 3).toFixed(2) }} </p>
                <p class="e-invest__invest--card-subtitle e-invest--text-normal relative font-medium text-white text-opacity-80"> Interest + Original Investment Amount </p>
                <div class="e-invest__invest--card-line"></div>
                <div class="flex relative">
                  <div class="e-invest__invest--card-stats e-invest--text-normal flex flex-col flex-1">
                    <p class="e-invest__invest--card-stats-title font-medium text-white text-opacity-80"> Daily Payout</p>
                    <p class="e-invest__invest--card-stats-value font-bold text-white">${{  $app.filters.rounded(dayliDivs, 1) }}</p>
                  </div>
                  <div class="e-invest--text-normal flex flex-col flex-1">
                    <p class="e-invest__invest--card-stats-title font-medium text-white text-opacity-80"> Total Profit </p>
                    <p class="e-invest__invest--card-stats-value font-black text-white">{{ selectedCurrency.totalProfit }}</p>
                  </div>
                  <div class="e-invest--text-normal flex flex-col flex-1">
                    <p class="e-invest__invest--card-stats-title font-medium text-white text-opacity-80"> Monthly Dividends </p>
                    <p class="e-invest__invest--card-stats-value font-black text-white">${{ $app.filters.rounded(dayliDivs * 31, 1) }}</p>
                  </div>
                </div>
                <p class="e-invest__invest--card-rating e-invest--text-normal relative flex items-center">
                  Safety Rating
                  <span class="e-invest__invest--card-rating-stars">
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
          <button @click="handleContinue" tabindex="0" :disabled="investmentAmount < 100" class="e-invest__button justify-center items-center self-stretch whitespace-nowrap "> Continue </button>
          <div class="e-invest__error-message">
            <p v-if="investmentAmount < 100">The minimum investment amount must be at least 100</p>
          </div>
        </div>
    </m-modal>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '~/src/shared/constants/icons';
import { useNuxtApp, useRouter, useRoute } from '#app'
import { computed, ref } from 'vue'
import { BrowserProvider, parseUnits } from "ethers";
import MModal from '~/src/shared/ui/molecules/m-modal/m-modal.vue';
import VueWriter from 'vue-writer'
import { useWindowSize } from '@vueuse/core'
import { vOnClickOutside } from '@vueuse/components'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue';
import ADropdownAmount from '~/src/shared/ui/atoms/a-dropdown-amount/a-dropdown-amount.vue';
import ADropdownSelector from '~/src/shared/ui/atoms/a-dropdown-selector/a-dropdown-selector.vue';

const { $app } = useNuxtApp()
const router = useRouter()
const route = useRoute()
const { width } = useWindowSize()

const orderType = computed(() => {
  return $app.store.user?.info?.account?.order_type && $app.store.user?.info?.account?.order_type !== undefined ? $app.store.user?.info?.account?.order_type : 'init_btc';
});
watch(
  () => $app.store.user.info,
  () => {
    orderType.value = $app.store.user?.info?.account?.order_type && $app.store.user?.info?.account?.order_type !== undefined ? $app.store.user?.info?.account?.order_type : 'init_btc';
  }
)

onMounted(() => {
  $app.api.eth.auth.getUser().then((resp) => {
    $app.store.user.info = resp?.data
  });



})

const isOpen = ref($app.store.user.isInvestModalShow.show);
// Invest Step
const inputMaxWidth = ref(width.value < 768 ? 55 : 65);
const defaultInputWith = ref(width.value < 768 ? 55 : 65);
const defaultInputPlus = ref(width.value < 768 ? 10 : 15);
const investmentAmountDisplay = ref('2,500');
const investmentAmount : any = ref(2500);

onMounted(()=>{
  // if(localStorage.getItem('investmentAmount')) {
  //   investmentAmount.value = Number(localStorage.getItem('investmentAmount'));
  //   investmentAmountDisplay.value = localStorage.getItem('investmentAmount') || '2,500';
  //   // $app.store.user.setInvestAmount({amount: Number(investmentAmount.value)});
  // }
  if($app.store?.purchase?.amountUS) {
    const temp = Math.ceil(Number($app.store.purchase.amountUS));

    if(!isNaN(temp)) {
      investmentAmount.value = temp;
      investmentAmountDisplay.value = String(temp);
    }
  }
})


watch(
  () => investmentAmountDisplay.value,
  (newValue, oldValue) => {
    let tempOriginal = Math.ceil(Number(newValue.split(",").join(""))); //Number

    if(isNaN(tempOriginal)) {
      investmentAmount.value = Number(oldValue.split(",").join(""));
      investmentAmountDisplay.value = oldValue;
      return;
    }

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
      investmentAmount.value = 1;
    }
    if(isNaN(newValue)) {
      investmentAmount.value = 2500;
    }

    localStorage.setItem('investmentAmount', String(investmentAmount.value));
    $app.store.user.setInvestAmount({amount: Number(investmentAmount.value)});

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
      defaultInputWith.value = 55;
      defaultInputPlus.value = 10;
    } else {
      defaultInputWith.value = 65;
      defaultInputPlus.value = 15;
    }

    if(String(investmentAmount.value).length <= 4) {
      inputMaxWidth.value = defaultInputWith.value;
    } else if(String(investmentAmount.value).length > 4 && String(investmentAmount.value).length < 7) {
      inputMaxWidth.value =  defaultInputWith.value+((String(investmentAmount.value).length - 4)*defaultInputPlus.value);
    }
  },
)

// reinvest

const inputMaxWidthReinvest = ref(60);
const investmentAmountReinvest = ref('2,500');
const investmentAmountModifiedReinvest = computed<string>({
  get: () => investmentAmount.value,
  set: (newValue) => {
    const originalNumber = newValue.split(",").join("");
    if(originalNumber.length <= 4) {
      inputMaxWidthReinvest.value = 60;
    } else if(originalNumber.length > 4 && originalNumber.length < 7) {
      inputMaxWidthReinvest.value =  60+((originalNumber.length - 4)*20);
    }
    investmentAmountReinvest.value = originalNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
},
});


const currencies = ref([
  {
    id:0,
    value: 'USDT',
    icon: Icon.ColorfulUsdt,
    background: "/img/usdtbg2.png",
    stars: 5,
    totalProfit: "42%",
    apy: 14,
    apy3: 42

  },
  {
    id: 1,
    value: 'BTC',
    icon: Icon.ColorfulBitcoin,
    background: "/img/bitcoinbg.png",
    stars: 4.5,
    totalProfit: "100%+",
    apy: 33.333333333333333333333333333333,
    apy3: 100

  }, ]);
const selectedCurrency = ref(currencies.value[1]); //orderType.value == 'btc' ? currencies.value[1] : currencies.value[0]

const apyValue = ref(selectedCurrency.value.apy);
const dayliDivs = computed(() => {
  return guaranteedPayout.value / 365
});

onMounted(() => {
  // if(localStorage.getItem("investType")) {
  //   selectCurrency({value: localStorage.getItem("investType")});
  // }

  // if($app.store.purchase.type) {
  //   selectCurrency({value: $app.store.purchase.type.toLowerCase()});
  // }
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

const guaranteedPayout = computed(() => {
  return investmentAmount.value * (selectedCurrency.value.apy / 100)
})

watch(
  () => $app.store.user.isInvestModalShow.show,
  () => {
    isOpen.value = $app.store.user.isInvestModalShow.show;

    if (orderType.value !== 'init_btc') {
      selectedCurrency.value = currencies.value.find((el) => el.value.toLowerCase() === orderType.value.toLowerCase()) || currencies.value[1];
    } else if($app.store.purchase.type) {
      const getCurrencyByPurchase = currencies.value.find(currency => currency.value == $app.store.purchase.type)
      selectCurrencyItem(getCurrencyByPurchase)
    }
  }
)


const selectCurrencyItem = (currency:any) => {
  selectedCurrency.value = currency
  $app.store.purchase.type = currency.value
}

// amount dropdown

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

function selectAmount(payload) {
  selectedAmount.value = payload

  if (payload.value !== null) {
    updateAmountValue(payload.value)
  }
}


function updateAmountValue(event: string | number) {
  investmentAmount.value = Number(event)
}

// modal
const closeModal = () => {
  $app.store.user.setIsInvestModalShow({show: false});
}

const handleContinue = () => {

  if(investmentAmount.value < 100) return;

  closeModal();
  $app.store.purchase.amount = investmentAmount.value;
  $app.store.purchase.amountUS = investmentAmount.value;
  $app.store.purchase.type = selectedCurrency.value.value;
  $app.store.purchase.apy = selectedCurrency.value.apy;
  $app.store.purchase.currentStep = 'Confirm';
  $app.store.purchase.totalPayout = investmentAmount.value + guaranteedPayout.value * 3;
  router.push('/personal/buy-shares');
}

</script>

<style lang="scss" src="./e-invest-modal.scss" />

