<template>
  <div class="f-registration w-full">

      <e-success-modal></e-success-modal>

      <template v-if="currentStep === Steps.Purchase">
        <main class="f-registration__purchase flex flex-col mx-auto w-full">
          <header class="f-registration__purchase-head f-registration__purchase-title f-registration--text-normal flex self-stretch whitespace-nowrap"> <!--  -->
            <div class='f-registration__purchase-back' @click='router.back()'>
                <a-icon class='' width='24' :name='Icon.MonoChevronLeft' />
            </div>

            <h1 class="">Complete your purchase</h1>

            <div class="f-registration__purchase-steps-desktop">
              <div @click="() => {openPurchase(purchaseStepsArr[0])}" :class="['f-registration__purchase-steps-desktop-step', {'f-registration__purchase-steps-desktop-step-active': confirmShow}]">1. Confirm</div>
              <div @click="() => {openPurchase(purchaseStepsArr[1])}" :class="['f-registration__purchase-steps-desktop-step', {'f-registration__purchase-steps-desktop-step-active': signShow}]">2. Sign</div>
              <div @click="() => {openPurchase(purchaseStepsArr[2], getPayWallets)}" :class="['f-registration__purchase-steps-desktop-step', {'f-registration__purchase-steps-desktop-step-active': payShow}]">3. Pay</div>
            </div>

          </header>

          <div class="f-registration__purchase-steps">
            <section :class="['f-registration__purchase--drop-down flex flex-col justify-end w-full bg-white', {'f-registration__purchase--drop-down-desktop': confirmShow}]">
              <header class="f-registration__purchase--drop-down-title flex gap-2 whitespace-nowrap cursor-pointer" @click="() => {togglePurchase(purchaseStepsArr[0])}">
                <div class="f-registration__purchase--drop-down-title-number f-registration--text-normal flex justify-center items-center px-2.5 h-6 text-center aspect-square rounded-full" aria-hidden="true">1</div>
                <h1 class="f-registration__purchase--drop-down-title-text f-registration--text-normal flex-auto">Confirm</h1>
                <NuxtImg :src="$app.store.user.theme === 'dark' ? '/img/icons/mono/chevron-bottom-dark.svg' : '/img/icons/mono/chevron-bottom.svg'" :class="['f-registration__purchase--drop-down-arrow w-6 aspect-square', {'rotate-180': confirmShow}]" alt="Down arrow icon" loading="lazy" />
              </header>



              <div v-if="confirmShow">
                <div class="f-registration__purchase-line"></div>

                <div class="f-registration__purchase--confirm-wrapper">
                  <div class="f-registration__purchase--confirm-item">
                    <p class="f-registration__purchase--step-title f-registration--text-normal">Amount of Shares You’re Buying</p>
                    <p class="f-registration__purchase--step-text f-registration--text-normal"> {{ $app.filters.rounded($app.store.purchase.amount, 0)  }} </p>
                  </div>

                  <div class="f-registration__purchase--confirm-item">
                    <p class="f-registration__purchase--step-title f-registration--text-normal">Total Investment Amount</p>
                    
                    <div v-if="discountAmount <= 0" class="flex gap-2 justify-between">
                      <p class="f-registration__purchase--step-text f-registration--text-normal flex-auto">US${{ $app.filters.rounded($app.store.purchase.amount, 2) }} </p>
                    </div>

                    <div v-if="discountAmount > 0" class="flex gap-2 justify-between">
                      <p class="f-registration__purchase--step-text-sale f-registration--text-normal"> US${{ $app.filters.rounded($app.store.purchase.amount, 0)  }} </p>
                      <p class="f-registration__purchase--step-text f-registration--text-normal flex-auto">US${{ $app.filters.rounded(originalWithDiscount, 2) }} <span class="f-registration__purchase--step-title">(-${{ $app.filters.rounded(discountAmount, 2)  }} off)</span></p>
                    </div>

                  </div>

                  <div class="f-registration__purchase--confirm-item-full">
                    <a-input-with-button
                      label="Referral code"
                      v-model="refCode"
                      :buttonText="refCodeBtnText"
                      :buttonClick="() => {refCodeApply()}"
                      :error-text="refCodeMessage"
                      :disabled="refApply"
                    />
                    <!-- <div
                      v-if="refCodeMessage"
                      :class="['f-registration__purchase__ref-message', { 'f-registration__purchase__ref-message--error': refCodeError }]"
                    >
                      {{ refCodeMessage }}
                    </div> -->
                  </div>

                  <div class="f-registration__purchase--confirm-item-full">
                    <div :class="['f-registration__purchase__switch', { 'f-registration__purchase__switch--active': switches.referral }]">
                      <div class="f-registration__purchase__switch-text">
                        Apply referral
                      </div>
                      <div class="f-registration__purchase__switch-button">
                        <a-switch
                          :disabled="!wallets?.referral?.usd_amount || wallets?.referral?.usd_amount < 1"
                          v-model="switches.referral"
                          :label="referralAmount"
                          label-position="left"
                        ></a-switch>
                      </div>
                    </div>

                    <div :class="['f-registration__purchase__switch', { 'f-registration__purchase__switch--active': switches.dividends }]">
                      <div class="f-registration__purchase__switch-text">
                        Apply dividends
                      </div>
                      <div class="f-registration__purchase__switch-button">
                        <a-switch v-model="switches.dividends" :label="dividendsAmount" label-position="left" :disabled="!wallets?.dividends?.usd_amount || wallets?.dividends?.usd_amount < 1"></a-switch>
                      </div>
                    </div>
                  </div>

                  <div class="f-registration__purchase--confirm-item">
                    <p class="f-registration__purchase--step-title f-registration--text-normal">Investment Currency</p>
                    <p class="f-registration__purchase--step-text f-registration--text-normal"> {{ $app.store.purchase.type === 'USDT' ? 'Tether (USDT)' : 'Tether (USDT)'}} </p>
                  </div>

                  <div class="f-registration__purchase--confirm-item">
                    <p class="f-registration__purchase--step-title f-registration--text-normal">Interest Type</p>
                    <p class="f-registration__purchase--step-text f-registration--text-normal">Fixed in USDT, Paid in {{ $app.store.purchase.type === 'USDT' ? 'USDT' : 'BTC' }}</p>
                  </div>

                  <div class="f-registration__purchase--confirm-item">
                    <p class="f-registration__purchase--step-title f-registration--text-normal">Price per Share</p>
                    <p class="f-registration__purchase--step-text f-registration--text-normal">US$1</p>
                  </div>

                  <div class="f-registration__purchase--confirm-item">
                    <p class="f-registration__purchase--step-title f-registration--text-normal">Buy Back Guarantee (Per Share)

                      <m-popper class="f-registration__purchase--step-title-popper" hover :title="purchasePopperText.title" :text="purchasePopperText.text">
                        <a-icon class="e-stat-default__head-icon" width="18" height="18" :name="Icon.MonoInfo" />
                      </m-popper>
                    </p>
                    <p class="f-registration__purchase--step-text f-registration--text-normal">US$1</p>
                  </div>

                  
                  <div v-if="$app.store.purchase.type === 'USDT'" class="f-registration__purchase--confirm-item">
                    <p class="f-registration__purchase--step-title f-registration--text-normal">Total Guaranteed Interest</p>
                    <p class="f-registration__purchase--step-text f-registration--text-normal">42%</p>
                  </div>

                  <div v-if="$app.store.purchase.type === 'BTC'" class="f-registration__purchase--confirm-item">
                    <p class="f-registration__purchase--step-title f-registration--text-normal">Total Projected Interest</p>
                    <p class="f-registration__purchase--step-text f-registration--text-normal">100%+</p>
                  </div>

                  

                  <div class="f-registration__purchase--confirm-item">
                    <p class="f-registration__purchase--step-title f-registration--text-normal">Dividends Schedule</p>
                    <p class="f-registration__purchase--step-text f-registration--text-normal">Daily in {{ $app.store.purchase.type === 'USDT' ? 'Tether USDT (Polygon)' : 'Bitcoin' }}</p>
                  </div>

                  <div class="f-registration__purchase--confirm-item">
                    <p class="f-registration__purchase--step-title f-registration--text-normal">Dividends Withdrawal</p>
                    
                    <p v-if="$app.store.purchase.type === 'USDT'" class="f-registration__purchase--step-text f-registration--text-normal">Automatic daily withdrawals to a wallet of your choice (must support Polygon chain)</p>
                    <p v-if="$app.store.purchase.type === 'BTC'" class="f-registration__purchase--step-text f-registration--text-normal">Automatic daily withdrawals to a Bitcoin Lightning wallet of your choice.</p>
                    <!-- <p class="f-registration__purchase--step-text f-registration--text-normal">Automatic with $100 min. threshold</p> -->
                  </div>

                  <div class="f-registration__purchase--confirm-item">
                    <p class="f-registration__purchase--step-title f-registration--text-normal">Total Guaranteed Payout</p>
                    <p class="f-registration__purchase--step-text f-registration--text-normal">${{ $app.store.purchase.totalPayout }}</p>
                  </div>

                  <div class="f-registration__purchase--confirm-item">
                    <p class="f-registration__purchase--step-title f-registration--text-normal">Term</p>
                    <p class="f-registration__purchase--step-text f-registration--text-normal">1095 Days</p>
                  </div>

                  <div class="f-registration__purchase--confirm-item-btn">
                    <button :disabled="confirmDisabled" @click="() => {openPurchase(purchaseStepsArr[1])}" class="f-registration__purchase--step-btn f-registration__button-continue f-registration--text-normal w-full justify-center items-center whitespace-nowrap rounded-lg" tabindex="0">Continue</button>
                  </div>

                </div>

              </div>
            </section>

            <section :class="['f-registration__purchase--drop-down flex flex-col justify-center p-4 w-full font-bold whitespace-nowrap bg-white', {'f-registration__purchase--drop-down-desktop': signShow}]" >
              <header @click="() => {togglePurchase(purchaseStepsArr[1])}" class="f-registration__purchase--drop-down-title flex gap-2">
                <div class="f-registration__purchase--drop-down-title-number f-registration--text-normal flex justify-center items-center px-2 h-6 text-center aspect-square rounded-full" aria-hidden="true">2</div>
                <h2 class="f-registration__purchase--drop-down-title-text f-registration--text-normal flex-auto">Sign</h2>
                <NuxtImg :src="$app.store.user.theme === 'dark' ? '/img/icons/mono/chevron-bottom-dark.svg' : '/img/icons/mono/chevron-bottom.svg'" :class="['f-registration__purchase--drop-down-arrow w-6 aspect-square', {'rotate-180': signShow}]" alt="Down arrow icon" loading="lazy" />
              </header>

              <div v-if="signShow">
                <div class="f-registration__purchase-line"></div>
                <div class="f-registration__agree">
                    <div class="mb-10">
                        <a-checkbox v-model="registrationAgreedUS" id="with_email"
                            label="<p style='white-space: break-spaces' >I declare that I am neither a U.S. citizen nor a resident, nor am I subject to U.S. tax or legal jurisdiction.</p>"
                            single />
                    </div>
                    <a-checkbox v-model="registrationAgreedTerms" id="with_email1"
                        label="<p style='white-space: break-spaces' >I agree to the <span class='link'>Terms & Conditions</a></p>" @label-click="openTermsModal"
                        single />
                </div>
                <a-button variant="secondary" class="f-registration__button f-registration__button-back" @click="() => {openPurchase(purchaseStepsArr[0])}"
                    text="Back"></a-button>
                <a-button class="f-registration__button f-registration__button-continue" :disabled="termsContinueDisabled" @click="() => {openPurchase(purchaseStepsArr[2], getPayWallets)}"
                    text="Continue"></a-button>
              </div>
            </section>

            <section :class="['f-registration__purchase--drop-down flex flex-col justify-center p-4 w-full font-bold whitespace-nowrap bg-white cursor-pointer', {'f-registration__purchase--drop-down-desktop': payShow}]">
              <header @click="() => {togglePurchase(purchaseStepsArr[2])}" class="f-registration__purchase--drop-down-title flex gap-2">
                <div class="f-registration__purchase--drop-down-title-number f-registration--text-normal flex justify-center items-center px-2 h-6 text-center aspect-square rounded-full" aria-hidden="true">3</div>
                <h2 class="f-registration__purchase--drop-down-title-text f-registration--text-normal flex-auto">Pay</h2>
                <NuxtImg :src="$app.store.user.theme === 'dark' ? '/img/icons/mono/chevron-bottom-dark.svg' : '/img/icons/mono/chevron-bottom.svg'" :class="['f-registration__purchase--drop-down-arrow w-6 aspect-square', {'rotate-180': payShow}]" alt="Down arrow icon" loading="lazy" />
              </header>

              <div v-if="payShow">
                <div class="f-registration__purchase-line"></div>
                <template v-if="currentPayStep === StepsPay.PayWith">
                  <div v-for="pay in payWith">
                    <div v-if="pay.show" @click="pay.onClick ? pay.onClick() : () => currentPayStep = StepsPay.Process" class="f-registration__purchase-pay-item flex flex-col justify-center cursor-pointer">
                      <div class="flex flex-col justify-center p-5 w-full ">
                        <div class="flex gap-1">
                          <NuxtImg :src="pay.icon" alt="USDT TRC20 option" class="w-6 aspect-square" loading="lazy"/>
                          <p class="flex-auto font-semibold">{{ pay.title }}</p>
                          <NuxtImg src="/img/icons/mono/chevron-right.svg" class="my-auto aspect-square w-[18px]" alt="Right arrow icon" loading="lazy" />
                        </div>
                      </div>
                    </div>
                  </div>
                </template>

                <template v-if="currentPayStep === StepsPay.Loading">
                  <div class="f-registration__purchase-loading">
                    Loading...
                  </div>
                </template>

                <template v-if="currentPayStep === StepsPay.Process">
                  <w-buy-shares-payment-short-purchase :switches="switches" :refCode="refCode" :payType="currentPayType"  :calc-value="$app.store.purchase.amountUS" :is-fiat="false"/> <!--buyAmount-->
                </template>

                <template v-if="currentPayStep === StepsPay.Paid">
                  <div class="flex flex-col justify-end items-center px-4 pt-4 pb-8 font-bold  ">
                    <p class="f-registration__purchase--processing-text mt-4">Processing payment, please wait</p>

                    <footer class="mt-9 text-base text-blue-600" tabindex="0" role="button">
                      Having trouble? Contact Support
                    </footer>
                  </div>
                </template>
              </div>
            </section>
          </div>
        </main>
      </template>
  </div>
</template>

<script setup lang="ts">
import { useNuxtApp, useRouter, useRoute } from '#app'
import AInput from '~/src/shared/ui/atoms/a-input/a-input.vue'
import AInputWithButton from '~/src/shared/ui/atoms/a-input-with-button/a-input-with-button.vue'
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
import APincodeInput from '~/src/shared/ui/atoms/a-pincode-input/a-pincode-input.vue'
import ACheckbox from '~/src/shared/ui/atoms/a-checkbox/a-checkbox.vue'
import { computed, ref } from 'vue'
import MAccordion from '~/src/shared/ui/molecules/m-accordion/m-accordion.vue'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import { Icon } from '~/src/shared/constants/icons'
import ERegistrationBonusModal from '~/src/entities/e-registration-bonus-modal/e-registration-bonus-modal.vue'
import FTermsModal from '~/src/features/f-terms-modal/f-terms-modal.vue'
import VueTurnstile from 'vue-turnstile';
import { SiweMessage } from 'siwe';
import { BrowserProvider, parseUnits } from "ethers";
import { googleSdkLoaded, googleLogout  } from "vue3-google-login";
import axios from "axios";
import { SignupMethods } from '~/src/shared/constants/signupMethods'
import MSelect from '~/src/shared/ui/molecules/m-select/m-select.vue'
import MPopper from '~/src/shared/ui/molecules/m-popper/m-popper.vue'
import { useClipboard } from '@vueuse/core'
import MModal from '~/src/shared/ui/molecules/m-modal/m-modal.vue'
import eSuccessModal from '~/src/entities/e-success-modal/e-success-modal.vue'
import WBuySharesPaymentShortPurchase from "~/src/widgets/w-buy-shares-payment-short-purchase/w-buy-shares-payment-short-purchase.vue"; 
import { hostname } from '~/src/app/adapters/ethAdapter'
import { PayTypes } from '~/src/shared/constants/payWith'
import ASwitch from '~/src/shared/ui/atoms/a-switch/a-switch.vue'

const emit = defineEmits([ 'update'])

const { $app } = useNuxtApp()
const router = useRouter()
const route = useRoute()
const token = ref('')
const siteKey = ref(window.location.host === 'bitcoinetf.org' ? '0x4AAAAAAAO0YJKv_riZdNZX' : '1x00000000000000000000AA');
const enum Steps {
  Purchase = 'Purchase'
}
const enum StepsPay {
  PayWith = 'PayWith',
  Process = 'Process',
  Paid = 'Paid',
  Loading = 'Loading',
}

const confirmResponse = ref(null)

const currentStep = ref(Steps.Purchase);
const backendError = ref('')

// confirm

// const discountAmount = ref(($app.store.purchase.amount/100)*$app.store.user.statistic?.trc_bonus?.percent); //5

const isOpenModal = ref(false)
const accordionRef = ref(null)
const isOpenTermsModal = ref(false)

function openTermsModal() {
  isOpenTermsModal.value = true
}

watch(
  () => currentStep.value,
  (step) => {
      backendError.value = ''
      if (step === Steps.Bonus) {
          isOpenModal.value = true
      }
  },
)

// Ref code field

const refCode = ref('')

const refCodeMessage = ref('');
const refCodeError = ref(false);
const refApply = ref(!!$app.store.user?.info?.referrals?.used_code)
const refCodeBtnText = ref('Apply');
const wallets = ref(null)

const getWallets = async () => {
  await $app.api.eth.billingEth
    .getWallets()
    .then((response: any) => {
      console.log(response)
      wallets.value = response.data
    })
    .catch(() => {
      // Todo: notify something went wrond
    })
}

const refCodeApply = async () => {

  if(refApply) return

  if ($app.store.user.info.referrals.used_code === null) {
    await $app.api.eth.referral
      .checkReferralCode(refCode.value)
      .then(() => {
        refCodeError.value = false
        refCodeBtnText.value = 'Referral code applied'
        refApply.value = true
        $app.store.user.info.referrals.used_code = refCode.value
      })
      .catch((e) => {
        refCodeError.value = true
        if (e?.errors?.error?.message) {
          refCodeMessage.value = e.errors.error.message
        } else {
          refCodeMessage.value = 'Something went wrong'
        }
      })
  } else {
    await $app.api.eth.referral
      .checkValidationCode(refCode.value)
  }
}

watch(refCode, (value) => {
  refCodeMessage.value = ''
 
})



// discount

const switches = reactive({
  referral: false,
  dividends: false,
})

const referralAmount = computed(() => {
  return `$${$app.filters.rounded(wallets.value?.referral?.usd_amount, 2) || 0}`
})
const dividendsAmount = computed(() => {
  return `$${$app.filters.rounded(wallets.value?.dividends?.usd_amount, 2) || 0}`
})

const discountAmount = ref(0);
const originalAmount = ref($app.store.purchase.amount);
const originalWithDiscount = ref($app.store.purchase.amount);

onMounted(async () => {
  $app.store.purchase.amountUS = originalWithDiscount.value;
  console.log(originalWithDiscount.value, $app.store.purchase.amountUS);

  refCode.value = $app.store.user?.info?.referrals?.used_code || '';
  await getWallets()
  if(refCode.value !== '') {
    refCodeBtnText.value = 'Referral code applied';
    refApply.value = true
  }

  if ($app.store.user.routeFrom === 'personal-dividends') {

    if (wallets.value?.dividends?.usd_amount) {
      switches.dividends = true
    }

    if (wallets.value?.referral?.usd_amount) {
      switches.referral = true
    }
  }
})

watch(
  () => originalWithDiscount.value,
  () => {
    $app.store.purchase.amountUS = originalWithDiscount.value;
  }
)


watch(
  () => switches.dividends,
  (value) => {
    if (value) {
      discountAmount.value += wallets.value?.dividends?.usd_amount;
      originalWithDiscount.value = $app.store.purchase.amount - discountAmount.value;
    } else {
      discountAmount.value -= wallets.value?.dividends?.usd_amount;
      originalWithDiscount.value = $app.store.purchase.amount - discountAmount.value;
    }
  },
)

watch(
  () => $app.store.purchase.amount,
  () => {
    originalWithDiscount.value = $app.store.purchase.amount - discountAmount.value;
  }
)

watch(
  () => switches.referral,
  (value) => {
    if (value) {
      discountAmount.value += wallets.value?.referral?.usd_amount;
      $app.store.purchase.amount = $app.store.purchase.amount - discountAmount.value;
    } else {
      discountAmount.value -= wallets.value?.referral?.usd_amount;
      $app.store.purchase.amount = $app.store.purchase.amount - discountAmount.value;
    }
  },
)

// Terms step

const registrationAgreedUS = ref(false)
const registrationAgreedTerms = ref(false)

const termsContinueDisabled = computed<boolean>(() => {
  return !registrationAgreedUS.value || !registrationAgreedTerms.value
})

const currentPayType = ref(PayTypes.Tron);

const openTrc = async () => {
  currentPayStep.value = StepsPay.Loading;
  currentPayType.value = PayTypes.Tron;

  await $app.api.eth.auth.getUser().then((resp) => {
    $app.store.user.info = resp?.data
  });

  await $app.api.info.blockchainProxy.getUserBlockchainWallet().then((resp) => {
    $app.store.user.blockchainUserWallet = resp?.data.uid;
    currentPayStep.value = StepsPay.Process;
  });
  
  if(!$app.store.user?.info?.account?.tron_wallet) {
    $app.store.user.info.account.tron_wallet = $app.store.user.wallets.tron;
  }

}

const openEth = async () => {
  currentPayStep.value = StepsPay.Loading;
  currentPayType.value = PayTypes.Ethereum;
  currentPayStep.value = StepsPay.Process;
}

const showTron = computed(() => {
  return $app.store.user.wallets.tron;
});
const showEth = computed(() => {
  return $app.store.user.wallets.tron;
});

const payWith = ref([
  {
    icon: "/img/icons/colorful/usdt-trc20.svg",
    title: "Pay with USDT (TRC20)",
    onClick: openTrc,
    show: showTron,
  },
  {
    icon: "/img/icons/colorful/usdt-trc20.svg",
    title: "Pay with USDT (BEP-20)",
    show: false,
  },
  {
    icon: "/img/icons/colorful/usdt-erc20.svg",
    title: "Pay with USDT (ERC-20)",
    onClick: openEth,
    show: showEth,
  },
  {
    icon: "/img/icons/colorful/usdt-trc20.svg",
    title: "Pay with USDT (Liquid)",
    show: false,
  },
  {
    icon: "/img/icons/colorful/metamask.svg",
    title: "Pay with WalletConnect",
    show: false,
  },
  {
    icon: "/img/icons/colorful/metamask.svg",
    title: "Pay with Metamask",
    show: false,
  },

]);



const timer = ref<NodeJS.Timer | null>(null)
const timerStarted = ref<boolean>(false)
const timeLeft = ref<number>(0)

const startTimer = () => {
  clearInterval(timer.value)
  const stopDate = Date.now() + 60 * 1000
  timerStarted.value = true

  timer.value = setInterval(() => {
      timeLeft.value = parseInt((stopDate - Date.now()) / 1000)
      if (timeLeft.value < 1) {
          timerStarted.value = false
          clearInterval(timer.value)
      }
  }, 1000 / 25)
}

// Purchase Step

const confirmShow = ref(true);
const signShow = ref(false);
const payShow = ref(false);

const currentPayStep = ref(StepsPay.PayWith);

const discountPercent = $app.store.user.statistic?.trc_bonus?.percent ? $app.store.user.statistic?.trc_bonus?.percent : 5;
// const defaultBuyAmount = $app.store.purchase.amount - ($app.store.purchase.amount/100)*discountPercent;
// const buyAmount = ref(isNaN(defaultBuyAmount) ? 100 : defaultBuyAmount);
const buyAmount = computed(() => {
  return $app.store.purchase.amount - ($app.store.purchase.amount/100)*discountPercent
});
const buyAmountOriginal = computed(() => {
  return $app.store.purchase.amount
});

//change purchase steps

enum PurchaseSteps {
  Confirm = 'Confirm',
  Sign = 'Sign',
  Pay = 'Pay',
}

const purchasePopperText = {
  title: 'Buy Back Guarantee',
  text: 'The fund promises shareholders that at the end of the investment period, they can sell their shares back to the fund at the original purchase price of $1 per share. No fees, commissions, or discounts will be deducted, even if a discount was initially given. Each share is always valued at $1.'
}

const purchaseStepsArr = [{name: PurchaseSteps.Confirm, value: confirmShow},{name: PurchaseSteps.Sign, value: signShow},{name: PurchaseSteps.Pay, value: payShow}];

const getPayWallets = async () => {
  currentPayStep.value = StepsPay.Loading;

  const response = await fetch(`https://${hostname}/v3/public/billing/shares/buy/apollopayment/payment-methods`, { 
    method: 'GET', 
    headers: new Headers({
      'Authorization': 'Bearer ' + $app.store.auth.accessToken,
      'Content-Type': 'application/json'
    }), 
  });

  const wallets = await response.json();
  $app.store.user.wallets = wallets.data;

  currentPayStep.value = StepsPay.PayWith;
}

const confirmDisabled = computed(() => {
  // return buyAmountOriginal.value < 100;
  return false;
})

const openPurchase = (target: any, callback?: any) => {
  confirmShow.value = false;
  signShow.value = false;
  payShow.value = false;

  if(target.name === PurchaseSteps.Sign) {

    if(!confirmDisabled.value) {
      target.value.value = true;
    } else {
      confirmShow.value = true;
    }

  } else if (target.name === PurchaseSteps.Pay) {

    if(!termsContinueDisabled.value) {
      target.value.value = true;
    } else {
      signShow.value = true;
    }

  } else {
    target.value.value = true;
  }


  if(callback) {
    callback();
  }
}

const togglePurchase = (target: any) => {

  if (window.innerWidth < 1024) {
    for(let i = 0; i < purchaseStepsArr.length; i++) {
      if(purchaseStepsArr[i].name === target.name) {
        purchaseStepsArr[i].value.value = !purchaseStepsArr[i].value.value;
      } else {
        purchaseStepsArr[i].value.value = false;
      }
    }
  }

}

// Success modal


</script>

<style lang="scss" src="./f-registration-buy.scss" />

