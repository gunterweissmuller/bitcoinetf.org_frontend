<template>
    <div class="e-invest w-full">
      <m-modal v-if="!$app.store.user.isInvestModalReinvest" bgBasic @close="closeModal" full-screen v-model="$app.store.user.isInvestModalShow">

        <div class="e-invest__invest flex flex-col justify-end items-start"> <!--max-w-[375px]-->
            <header class="e-invest__invest-text flex items-center font-medium text-center whitespace-nowrap"> <!--gap-4-->
              <VueWriter :typeSpeed="60" class="e-invest__invest--text-main e-invest--text-normal e-invest__invest--text-secondary grow" :array="['I want to invest']" :iterations="1" />
              <!-- <h1 class="e-invest__invest--text-main e-invest--text-normal e-invest__invest--text-secondary grow">I want to invest</h1> -->

              <div class="e-invest__invest-input e-invest__invest--text-primary ml-4 grow flex justify-center font-semibold">
                <span class="e-invest__invest--text-input e-invest--text-normal flex items-center">$</span>
                <input :style="'max-width: '+inputMaxWidth+'px'" v-model="investmentAmountModified" class="e-invest__invest--text-input e-invest--text-normal flex-1 bg-transparent" placeholder="2,500"/>
              </div>

            </header>
            <VueWriter :start="1100" :typeSpeed="60" class="e-invest__invest--text-main e-invest--text-normal e-invest__invest--text-secondary e-invest__invest--text-spacing font-medium text-center" :array="['and receive my daily']" :iterations="1" />
            <!-- <p class="e-invest__invest--text-main e-invest--text-normal e-invest__invest--text-secondary e-invest__invest--text-spacing font-medium text-center">and receive my daily</p> -->
            <div class="e-invest__invest--text-main e-invest--text-normal e-invest__invest--text-secondary e-invest__invest--text-spacing flex items-center gap-2 font-medium text-center whitespace-nowrap">
              <VueWriter :start="2300" :typeSpeed="60" class="grow" :array="['dividends in']" :iterations="1" />
              <!-- <span class="grow">dividends in</span> -->

              <div class="relative">
                <div class="e-invest__invest-select flex text-center whitespace-nowrap">
                  <div @click="toggleCurrencyDropdown" class="relative flex items-center justify-center gap-2 cursor-pointer">
                    <NuxtImg :src="selectedCurrency.icon" class="w-6 aspect-square cursor-pointer" alt="USDT logo" loading="lazy" />
                    <span class="e-invest__invest-select-text e-invest--text-normal">{{ selectedCurrency.value }}</span>
                    <NuxtImg src="/img/icons/mono/chevron-bottom.svg" :class="['w-[18px] aspect-square cursor-pointer', {'rotate-180': showDropdown}]" alt="Down arrow icon" loading="lazy"/>
                  </div>
                </div>
                <div v-if="showDropdown" class="w-full absolute mt-1 bg-sky-50 shadow-lg rounded-lg z-10">
                  <ul class="text-sm font-medium text-gray-700">
                    <li v-for="currency in currencies" :key="currency" @click="selectCurrency(currency)" :class="['px-4 py-2 hover:bg-gray-100 cursor-pointer']">{{ currency.value }}</li>
                  </ul>
                </div>
              </div>

              <!-- <div class="flex gap-2 justify-center py-1.5 pr-6 pl-2.5 text-xl bg-sky-50 rounded">
                <NuxtImg src="/img/icons/colorful/usdt.svg" class="self-start w-6 aspect-square" alt="USDT logo" />
                <span>USDT</span>
                <NuxtImg src="/img/icons/mono/chevron-bottom.svg" class="my-auto aspect-square w-[18px]" alt="Down arrow icon" />
              </div> -->

            </div>

            <article class="e-invest__invest--card-wrapper flex flex-col self-stretch whitespace-nowrap rounded-lg">

              <div :class="['e-invest__invest--card-inner', {'e-invest__invest--card-inner-flip': selectedCurrency.value === 'Bitcoin'}]">

                <!-- FRONT -->
                <div class="e-invest__invest--card e-invest__invest--card-front e-invest__invest-font flex overflow-hidden relative flex-col justify-center w-full rounded-lg">
                  <NuxtImg src="/img/icons/colorful/usdt.svg" class="e-invest__invest--card-icon w-6 aspect-square cursor-pointer" alt="USDT logo" loading="lazy" />
                  <p class="e-invest__invest--card-title e-invest--text-normal relative font-semibold text-white text-opacity-80"> In Total Projected Payout </p>
                  <p class="e-invest__invest--card-sum e-invest--text-normal relative font-black text-white"> $3,457,938.00 </p>
                  <p class="e-invest__invest--card-subtitle e-invest--text-normal relative font-medium text-white text-opacity-80"> Your Interest + Original Investment Amount </p>
                  <div class="relative shrink-0 my-2 h-px bg-white bg-opacity-10"></div>
                  <div class="flex relative gap-0">
                    <div class="e-invest__invest--card-stats e-invest--text-normal flex flex-col flex-1">
                      <p class="e-invest__invest--card-stats-title font-medium text-white text-opacity-80"> Daily Payout</p>
                      <p class="e-invest__invest--card-stats-value font-bold text-white">$0.95</p>
                    </div>
                    <div class="e-invest--text-normal flex flex-col flex-1">
                      <p class="e-invest__invest--card-stats-title font-medium text-white text-opacity-80"> Total Profit </p>
                      <p class="e-invest__invest--card-stats-value font-black text-white">42%</p>
                    </div>
                    <div class="e-invest--text-normal flex flex-col flex-1">
                      <p class="e-invest__invest--card-stats-title font-medium text-white text-opacity-80"> Monthly Dividends </p>
                      <p class="e-invest__invest--card-stats-value font-black text-white">$28.76</p>
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
                  <div class="e-invest__invest--card-term e-invest--text-normal">Term: 1095 Days</div>

                </div>

                <!-- BACK -->
                <div class="e-invest__invest--card-back e-invest__invest--card e-invest__invest-font flex overflow-hidden relative flex-col justify-center w-full rounded-lg">
                  <NuxtImg src="/img/icons/colorful/bitcoin.svg" class="e-invest__invest--card-icon w-6 aspect-square cursor-pointer" alt="BTC logo" loading="lazy" />

                  <p class="e-invest__invest--card-title e-invest--text-normal relative font-semibold text-white text-opacity-80"> In Total Projected Payout </p>
                  <p class="e-invest__invest--card-sum e-invest--text-normal relative font-black text-white"> $5,000.00 </p>
                  <p class="e-invest__invest--card-subtitle e-invest--text-normal relative font-medium text-white text-opacity-80"> Interest + Original Investment Amount </p>
                  <div class="relative shrink-0 my-2 h-px bg-white bg-opacity-10"></div>
                  <div class="flex relative gap-0">
                    <div class="e-invest__invest--card-stats e-invest--text-normal flex flex-col flex-1">
                      <p class="e-invest__invest--card-stats-title font-medium text-white text-opacity-80"> Daily Payout</p>
                      <p class="e-invest__invest--card-stats-value font-bold text-white">$1.90</p>
                    </div>
                    <div class="e-invest--text-normal flex flex-col flex-1">
                      <p class="e-invest__invest--card-stats-title font-medium text-white text-opacity-80"> Total Profit </p>
                      <p class="e-invest__invest--card-stats-value font-black text-white">100%+</p>
                    </div>
                    <div class="e-invest--text-normal flex flex-col flex-1">
                      <p class="e-invest__invest--card-stats-title font-medium text-white text-opacity-80"> Monthly Dividends </p>
                      <p class="e-invest__invest--card-stats-value font-black text-white">$57.52</p>
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
                  <div class="e-invest__invest--card-term e-invest--text-normal">Term: 1095 Days</div>
                </div>
              </div>



            </article>
            <button @click="handleContinue" tabindex="0" class="e-invest__button justify-center items-center self-stretch px-16 py-5 text-base font-bold text-white whitespace-nowrap bg-blue-600 rounded-lg"> Continue </button>
          </div>
      </m-modal>

      <!-- REINVEST -->
      <m-modal v-else-if="$app.store.user.isInvestModalReinvest" bgBasic @close="closeModal" full-screen v-model="$app.store.user.isInvestModalShow">
        <div class="e-invest__invest flex flex-col justify-end items-start"> <!--max-w-[375px]-->
            <header class="e-invest__invest-text flex items-center font-medium text-center whitespace-nowrap"> <!--gap-4-->
              <VueWriter :typeSpeed="60" class="e-invest__invest--text-main e-invest--text-normal e-invest__invest--text-secondary grow" :array="['I want to invest additional']" :iterations="1" />
              <!-- <h1 class="e-invest__invest--text-main e-invest--text-normal e-invest__invest--text-secondary grow">I want to invest additional</h1> -->

            </header>
            <p class="e-invest__invest--text-main e-invest--text-normal e-invest__invest--text-secondary e-invest__invest--text-spacing font-medium text-center flex">

              <div class="e-invest__invest-input e-invest__invest--text-primary mr-4 grow flex justify-center font-semibold">
                <span class="e-invest__invest--text-input e-invest--text-normal flex items-center">$</span>
                <input :style="'max-width: '+inputMaxWidth+'px'" v-model="investmentAmountModifiedReinvest" class="e-invest__invest--text-input e-invest--text-normal max-w-[60px] flex-1 bg-transparent" placeholder="2,500"/>
              </div>

              <VueWriter :start="1700" :typeSpeed="60" :array="['and increase my']" :iterations="1" />
              <!-- and increase my -->
            </p>
            <div class="e-invest__invest--text-main e-invest--text-normal e-invest__invest--text-secondary e-invest__invest--text-spacing flex items-center gap-2 font-medium text-center whitespace-nowrap">
              <VueWriter :start="2800" :typeSpeed="60" class="grow" :array="['daily dividends in']" :iterations="1" />
              <!-- <span class="grow">daily dividends in</span> -->

              <div class="relative opacity-50">
                <div class="e-invest__invest-select flex text-center whitespace-nowrap">
                  <div  class="relative flex items-center justify-center gap-2 ">
                    <NuxtImg :src="selectedCurrency.icon" class="w-6 aspect-square " alt="USDT logo" loading="lazy" />
                    <span class="e-invest__invest-select-text e-invest--text-normal">{{ selectedCurrency.value }}</span>
                    <NuxtImg src="/img/icons/mono/chevron-bottom.svg" :class="['w-[18px] aspect-square ', {'rotate-180': showDropdown}]" alt="Down arrow icon" loading="lazy"/>
                  </div>
                </div>
                <!-- <div v-if="showDropdown" class="w-full absolute mt-1 bg-sky-50 shadow-lg rounded-lg z-10">
                  <ul class="text-sm font-medium text-gray-700">
                    <li v-for="currency in currencies" :key="currency" @click="selectCurrency(currency)" :class="['px-4 py-2 hover:bg-gray-100 cursor-pointer']">{{ currency.value }}</li>
                  </ul>
                </div> -->
              </div>

              <!-- <div class="flex gap-2 justify-center py-1.5 pr-6 pl-2.5 text-xl bg-sky-50 rounded">
                <NuxtImg src="/img/icons/colorful/usdt.svg" class="self-start w-6 aspect-square" alt="USDT logo" />
                <span>USDT</span>
                <NuxtImg src="/img/icons/mono/chevron-bottom.svg" class="my-auto aspect-square w-[18px]" alt="Down arrow icon" />
              </div> -->

            </div>

            <article class="e-invest__invest--card-wrapper flex flex-col self-stretch whitespace-nowrap rounded-lg">

              <div :class="['e-invest__invest--card-inner', {'e-invest__invest--card-inner-flip': selectedCurrency.value === 'Bitcoin'}]">

                <!-- FRONT -->
                <div class="e-invest__invest--card e-invest__invest--card-front e-invest__invest-font flex overflow-hidden relative flex-col justify-center w-full rounded-lg">
                  <NuxtImg src="/img/icons/colorful/usdt.svg" class="e-invest__invest--card-icon w-6 aspect-square cursor-pointer" alt="USDT logo" loading="lazy" />
                  <p class="e-invest__invest--card-title e-invest--text-normal relative font-semibold text-white text-opacity-80"> In Total Projected Payout </p>
                  <p class="e-invest__invest--card-sum e-invest--text-normal relative font-black text-white"> $3,457,938.00 </p>
                  <p class="e-invest__invest--card-subtitle e-invest--text-normal relative font-medium text-white text-opacity-80"> Your Interest + Original Investment Amount </p>
                  <div class="relative shrink-0 my-2 h-px bg-white bg-opacity-10"></div>
                  <div class="flex relative gap-0">
                    <div class="e-invest__invest--card-stats e-invest--text-normal flex flex-col flex-1">
                      <p class="e-invest__invest--card-stats-title font-medium text-white text-opacity-80"> Daily Payout</p>
                      <p class="e-invest__invest--card-stats-value font-bold text-white">$0.95</p>
                    </div>
                    <div class="e-invest--text-normal flex flex-col flex-1">
                      <p class="e-invest__invest--card-stats-title font-medium text-white text-opacity-80"> Total Profit </p>
                      <p class="e-invest__invest--card-stats-value font-black text-white">42%</p>
                    </div>
                    <div class="e-invest--text-normal flex flex-col flex-1">
                      <p class="e-invest__invest--card-stats-title font-medium text-white text-opacity-80"> Monthly Dividends </p>
                      <p class="e-invest__invest--card-stats-value font-black text-white">$28.76</p>
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
                  <div class="e-invest__invest--card-term e-invest--text-normal">Term: 1095 Days</div>

                </div>

                <!-- BACK -->
                <div class="e-invest__invest--card-back e-invest__invest--card e-invest__invest-font flex overflow-hidden relative flex-col justify-center w-full rounded-lg">
                  <NuxtImg src="/img/icons/colorful/bitcoin.svg" class="e-invest__invest--card-icon w-6 aspect-square cursor-pointer" alt="BTC logo" loading="lazy" />

                  <p class="e-invest__invest--card-title e-invest--text-normal relative font-semibold text-white text-opacity-80"> In Total Projected Payout </p>
                  <p class="e-invest__invest--card-sum e-invest--text-normal relative font-black text-white"> $5,000.00 </p>
                  <p class="e-invest__invest--card-subtitle e-invest--text-normal relative font-medium text-white text-opacity-80"> Interest + Original Investment Amount </p>
                  <div class="relative shrink-0 my-2 h-px bg-white bg-opacity-10"></div>
                  <div class="flex relative gap-0">
                    <div class="e-invest__invest--card-stats e-invest--text-normal flex flex-col flex-1">
                      <p class="e-invest__invest--card-stats-title font-medium text-white text-opacity-80"> Daily Payout</p>
                      <p class="e-invest__invest--card-stats-value font-bold text-white">$1.90</p>
                    </div>
                    <div class="e-invest--text-normal flex flex-col flex-1">
                      <p class="e-invest__invest--card-stats-title font-medium text-white text-opacity-80"> Total Profit </p>
                      <p class="e-invest__invest--card-stats-value font-black text-white">100%+</p>
                    </div>
                    <div class="e-invest--text-normal flex flex-col flex-1">
                      <p class="e-invest__invest--card-stats-title font-medium text-white text-opacity-80"> Monthly Dividends </p>
                      <p class="e-invest__invest--card-stats-value font-black text-white">$57.52</p>
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
                  <div class="e-invest__invest--card-term e-invest--text-normal">Term: 1095 Days</div>
                </div>
              </div>



            </article>
            <button @click="handleContinue" tabindex="0" class="e-invest__button justify-center items-center self-stretch px-16 py-5 text-base font-bold text-white whitespace-nowrap bg-blue-600 rounded-lg"> Continue </button>
          </div>
      </m-modal>
    </div>
  </template>

  <script setup lang="ts">
  import { useNuxtApp, useRouter, useRoute } from '#app'
  import { computed, ref } from 'vue'
  import { BrowserProvider, parseUnits } from "ethers";
  import MModal from '~/src/shared/ui/molecules/m-modal/m-modal.vue';
  import VueWriter from 'vue-writer'


  const { $app } = useNuxtApp()
  const router = useRouter()
  const route = useRoute()

  // Invest Step

  const inputMaxWidth = ref(60);
  const investmentAmount = ref('2,500');
  const investmentAmountModified = computed<string>({
    get: () => investmentAmount.value,
    set: (newValue) => {
      const originalNumber = newValue.split(",").join("");
      if(originalNumber.length <= 4) {
        inputMaxWidth.value = 60;
      } else if(originalNumber.length > 4 && originalNumber.length < 7) {
        inputMaxWidth.value =  60+((originalNumber.length - 4)*20);
      }
      investmentAmount.value = originalNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
  });

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

  // modal
  const closeModal = () => {
    $app.store.user.setIsInvestModalShow({show: false});
  }

  const handleContinue = () => {
    closeModal();
    router.push('/personal/purchase');
  }

  </script>

  <style lang="scss" src="./e-invest-modal.scss" />

