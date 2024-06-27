<template>
  <div class="e-invest w-full">
    <!--orderType == 'init_btc'--><m-modal v-if="orderType == 'init_btc'"  bgBasic @close="closeModal" full-screen v-model="isOpen"> <!--v-if="orderType == 'init_btc' || orderType == 'btc'"-->

      <div class="e-invest__invest flex flex-col justify-end items-start"> <!--max-w-[375px]-->
          <header class="e-invest__invest--text-main e-invest--text-normal e-invest__invest--text-secondary grow e-invest__invest-text font-medium text-center">
            I want to invest
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
            and receive my daily dividends in
            <a-dropdown-selector
              :model-value="selectedCurrency"
              :options="currencies"
              option-key="icon"
              option-value="value"
              @update:model-value="selectCurrencyItem"
            />
          </header>

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
import { useNuxtApp, useRouter } from '#app'
import { computed, ref } from 'vue'
import MModal from '~/src/shared/ui/molecules/m-modal/m-modal.vue';
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue';
import ADropdownAmount from '~/src/shared/ui/atoms/a-dropdown-amount/a-dropdown-amount.vue';
import ADropdownSelector from '~/src/shared/ui/atoms/a-dropdown-selector/a-dropdown-selector.vue';

const { $app } = useNuxtApp()
const router = useRouter()

const orderType = computed(() => {
  return $app.store.user?.info?.account?.order_type && $app.store.user?.info?.account?.order_type !== undefined ? $app.store.user?.info?.account?.order_type : 'init_btc';
});


const isOpen = computed(() => $app.store.user.isInvestModalShow.show)

// Invest Step
const investmentAmount : any = ref(2500);

onMounted(()=>{
  if($app.store?.purchase?.amountUS) {
    const temp = Math.ceil(Number($app.store.purchase.amountUS));

    if(!isNaN(temp)) {
      investmentAmount.value = temp;
    }
  }
})

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
  },
)




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
onMounted(() => {
  const order_type = $app.store.user?.info?.account?.order_type || 'USDT'
  
  const findOrder = currencies.value.find((el) => el.value.toLowerCase() === order_type.toLowerCase()) || currencies.value[1]
  selectCurrencyItem(findOrder)
  
})


const dayliDivs = computed(() => {
  return guaranteedPayout.value / 365
});

const guaranteedPayout = computed(() => {
  return investmentAmount.value * (selectedCurrency.value.apy / 100)
})

const selectCurrencyItem = (currency:any) => {
  selectedCurrency.value = currency
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
  if ($app.store.auth.isUserAuthenticated){
    router.push('/personal/buy-shares');
    return
  }
  navigateTo({name: 'personal-registration', query: {action: 'open-buy-shares'}})

}

</script>

<style lang="scss" src="./e-invest-modal.scss" />

