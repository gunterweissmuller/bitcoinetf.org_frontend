<template>
  <div class="f-registration-buy w-full">
    <e-buy-shares-success-modal
      v-model="isOpenSuccessPaymentModal"
      :values="paymentAmount"
      @close="paymentModalClose"
    />
    <f-terms-modal v-model="isOpenTermsModal" />

    <template v-if="currentStep === Steps.Purchase">
      <main class="f-registration-buy__purchase flex flex-col mx-auto w-full">
        <header class="f-registration-buy__purchase-head f-registration-buy__purchase-title f-registration-buy--text-normal flex self-stretch whitespace-nowrap"> <!--  -->
          <div class='f-registration-buy__purchase-back' @click='router.back()'>
            <a-icon class='' width='24' :name='Icon.MonoChevronLeft' />
          </div>

          <h1 class="">Complete your purchase</h1>

          <div class="f-registration-buy__purchase-steps-desktop">
            <div @click="() => {openPurchase(purchaseStepsArr[0])}" :class="['f-registration-buy__purchase-steps-desktop-step', {'f-registration-buy__purchase-steps-desktop-step-active': confirmShow}]">1. Confirm</div>
            <div @click="() => {openPurchase(purchaseStepsArr[1])}" :class="['f-registration-buy__purchase-steps-desktop-step', {'f-registration-buy__purchase-steps-desktop-step-active': signShow}]">2. Sign</div>
            <div @click="() => {openPurchase(purchaseStepsArr[2], loadPayWallets)}" :class="['f-registration-buy__purchase-steps-desktop-step', {'f-registration-buy__purchase-steps-desktop-step-active': payShow}]">3. Pay</div>
          </div>

        </header>

        <div class="f-registration-buy__purchase-steps">
          <section :class="['f-registration-buy__purchase--drop-down f-registration-buy__purchase--drop-down-confirm flex flex-col justify-end w-full bg-white', {'f-registration-buy__purchase--drop-down-desktop': confirmShow}]">
            <header class="f-registration-buy__purchase--drop-down-title flex whitespace-nowrap cursor-pointer" @click="() => {togglePurchase(purchaseStepsArr[0])}">
              <div class="f-registration-buy__purchase--drop-down-title-number f-registration-buy--text-normal flex justify-center items-center px-2.5 h-6 text-center aspect-square rounded-full" aria-hidden="true">1</div>
              <h1 class="f-registration-buy__purchase--drop-down-title-text f-registration-buy--text-normal flex-auto">Confirm</h1>
              <NuxtImg :src="$app.store.user.theme === 'dark' ? '/img/icons/mono/chevron-bottom-dark.svg' : '/img/icons/mono/chevron-bottom.svg'" :class="['f-registration-buy__purchase--drop-down-arrow w-6 aspect-square', {'rotate-180': confirmShow}]" alt="Down arrow icon" loading="lazy" />
            </header>



            <div v-if="confirmShow">
              <div class="f-registration-buy__purchase-line"></div>

              <div class="f-registration-buy__purchase--confirm-wrapper">
                <div class="f-registration-buy__purchase--confirm-item">
                  <p class="f-registration-buy__purchase--step-title f-registration-buy--text-normal">Amount of Shares You’re Buying</p>
                  <p class="f-registration-buy__purchase--step-text f-registration-buy--text-normal"> {{ $app.filters.rounded(originalWithDiscount, 2) }} </p>
                </div>

                <div class="f-registration-buy__purchase--confirm-item">
                  <p class="f-registration-buy__purchase--step-title f-registration-buy--text-normal">Total Investment Amount</p>

                  <div v-if="true" class="flex gap-2 justify-between"> <!--discountAmount <= 0-->
                    <p class="f-registration-buy__purchase--step-text f-registration-buy--text-normal flex-auto">US${{ $app.filters.rounded($app.store.purchase.amountUS, 2) }} </p>
                  </div>

                  <div v-if="false" class="flex gap-2 justify-between">
                    <p class="f-registration-buy__purchase--step-text-sale f-registration-buy--text-normal"> US${{  $app.filters.rounded($app.store.purchase.amount, 0)  }} </p>
                    <p class="f-registration-buy__purchase--step-text f-registration-buy--text-normal flex-auto">US${{ $app.filters.rounded(originalWithDiscount, 2) }} <span class="f-registration-buy__purchase--step-title">(-${{ $app.filters.rounded(discountAmount, 2)  }} off)</span></p>
                  </div>

                </div>

                <div class="f-registration-buy__purchase--confirm-item-full">
                  <a-input-with-button
                    label="Referral code"
                    v-model="refCode"
                    :buttonText="refCodeBtnText"
                    :buttonClick="() => {refCodeApply()}"
                    :error-text="refCodeMessage"
                    :disabled="refApply"
                    :button-click-enable="Boolean(refCode)"
                  />
                  <!-- <div
                    v-if="refCodeMessage"
                    :class="['f-registration-buy__purchase__ref-message', { 'f-registration-buy__purchase__ref-message--error': refCodeError }]"
                  >
                    {{ refCodeMessage }}
                  </div> -->
                </div>

                <div class="f-registration-buy__purchase--confirm-item-full">
                  <div :class="['f-registration-buy__purchase__switch', { 'f-registration-buy__purchase__switch--active': switches.referral }]">
                    <div class="f-registration-buy__purchase__switch-text">
                      Apply referral
                    </div>
                    <div class="f-registration-buy__purchase__switch-button">
                      <a-switch
                        :disabled="!wallets?.referral?.usd_amount || wallets?.referral?.usd_amount < 1"
                        v-model="switches.referral"
                        :label="referralAmount"
                        label-position="left"
                      ></a-switch> <!--  -->
                    </div>
                  </div>

                  <div :class="['f-registration-buy__purchase__switch', { 'f-registration-buy__purchase__switch--active': switches.dividends }]">
                    <div class="f-registration-buy__purchase__switch-text">
                      Apply dividends
                    </div>
                    <div class="f-registration-buy__purchase__switch-button">
                      <a-switch v-model="switches.dividends" :label="dividendsAmount" label-position="left" :disabled="!wallets?.dividends?.usd_amount || wallets?.dividends?.usd_amount < 1"></a-switch>
                    </div>
                  </div>
                </div>

                <div class="f-registration-buy__purchase--confirm-item">
                  <p class="f-registration-buy__purchase--step-title f-registration-buy--text-normal">Investment Currency</p>
                  <p class="f-registration-buy__purchase--step-text f-registration-buy--text-normal"> {{ $app.store.purchase.type === 'USDT' ? 'Tether (USDT)' : 'Tether (USDT)'}} </p>
                </div>

                <div class="f-registration-buy__purchase--confirm-item">
                  <p class="f-registration-buy__purchase--step-title f-registration-buy--text-normal">Interest Type</p>
                  <p class="f-registration-buy__purchase--step-text f-registration-buy--text-normal">Fixed in USDT, Paid in {{ $app.store.purchase.type === 'USDT' ? 'USDT' : 'BTC' }}</p>
                </div>

                <div class="f-registration-buy__purchase--confirm-item">
                  <p class="f-registration-buy__purchase--step-title f-registration-buy--text-normal">Price per Share</p>
                  <p class="f-registration-buy__purchase--step-text f-registration-buy--text-normal">US$1.00</p>
                </div>

                <div class="f-registration-buy__purchase--confirm-item">
                  <p class="f-registration-buy__purchase--step-title f-registration-buy--text-normal">Buy Back Guarantee (Per Share)

                    <m-popper class="f-registration-buy__purchase--step-title-popper" hover :title="purchasePopperText.title" :text="purchasePopperText.text">
                      <a-icon class="e-stat-default__head-icon" width="18" height="18" :name="Icon.MonoInfo" />
                    </m-popper>
                  </p>
                  <p class="f-registration-buy__purchase--step-text f-registration-buy--text-normal">US$1.00</p>
                </div>


                <div v-if="$app.store.purchase.type === 'USDT'" class="f-registration-buy__purchase--confirm-item">
                  <p class="f-registration-buy__purchase--step-title f-registration-buy--text-normal">Total Guaranteed Interest</p>
                  <p class="f-registration-buy__purchase--step-text f-registration-buy--text-normal">42%</p>
                </div>

                <div v-if="$app.store.purchase.type === 'BTC'" class="f-registration-buy__purchase--confirm-item">
                  <p class="f-registration-buy__purchase--step-title f-registration-buy--text-normal">Total Projected Interest</p>
                  <p class="f-registration-buy__purchase--step-text f-registration-buy--text-normal">100%+</p>
                </div>



                <div class="f-registration-buy__purchase--confirm-item">
                  <p class="f-registration-buy__purchase--step-title f-registration-buy--text-normal">Dividends Schedule</p>
                  <p class="f-registration-buy__purchase--step-text f-registration-buy--text-normal">Daily in {{ $app.store.purchase.type === 'USDT' ? 'Tether USDT (Polygon)' : 'Bitcoin' }}</p>
                </div>

                <div class="f-registration-buy__purchase--confirm-item">
                  <p class="f-registration-buy__purchase--step-title f-registration-buy--text-normal">Dividends Withdrawal</p>

                  <p v-if="$app.store.purchase.type === 'USDT'" class="f-registration-buy__purchase--step-text f-registration-buy--text-normal">Automatic daily withdrawals to a wallet of your choice (must support Polygon chain)</p>
                  <p v-if="$app.store.purchase.type === 'BTC'" class="f-registration-buy__purchase--step-text f-registration-buy--text-normal">Automatic daily withdrawals to a Bitcoin Lightning wallet of your choice.</p>
                  <!-- <p class="f-registration-buy__purchase--step-text f-registration-buy--text-normal">Automatic with $100 min. threshold</p> -->
                </div>

                <div class="f-registration-buy__purchase--confirm-item">
                  <p class="f-registration-buy__purchase--step-title f-registration-buy--text-normal">Total Guaranteed Payout</p>
                  <p class="f-registration-buy__purchase--step-text f-registration-buy--text-normal">${{ $app.filters.rounded(totalPayout, 2)  }}</p>
                </div>

                <div class="f-registration-buy__purchase--confirm-item">
                  <p class="f-registration-buy__purchase--step-title f-registration-buy--text-normal">Term</p>
                  <p class="f-registration-buy__purchase--step-text f-registration-buy--text-normal">1095 Days</p>
                </div>

                <div class="f-registration-buy__purchase--confirm-item-btn">
                  <button :disabled="confirmDisabled" @click="() => {openPurchase(purchaseStepsArr[1])}" class="f-registration-buy__purchase--step-btn f-registration-buy__button-continue f-registration-buy--text-normal w-full justify-center items-center whitespace-nowrap rounded-lg" tabindex="0">Continue</button>
                </div>

              </div>

            </div>
          </section>

          <section :class="['f-registration-buy__purchase--drop-down flex flex-col justify-center p-4 w-full font-bold whitespace-nowrap bg-white', {'f-registration-buy__purchase--drop-down-desktop': signShow}]" >
            <header @click="() => {togglePurchase(purchaseStepsArr[1])}" class="f-registration-buy__purchase--drop-down-title flex">
              <div class="f-registration-buy__purchase--drop-down-title-number f-registration-buy--text-normal flex justify-center items-center px-2 h-6 text-center aspect-square rounded-full" aria-hidden="true">2</div>
              <h2 class="f-registration-buy__purchase--drop-down-title-text f-registration-buy--text-normal flex-auto">Sign</h2>
              <NuxtImg :src="$app.store.user.theme === 'dark' ? '/img/icons/mono/chevron-bottom-dark.svg' : '/img/icons/mono/chevron-bottom.svg'" :class="['f-registration-buy__purchase--drop-down-arrow w-6 aspect-square', {'rotate-180': signShow}]" alt="Down arrow icon" loading="lazy" />
            </header>

            <div v-if="signShow">
              <div class="f-registration-buy__purchase-line"></div>
              <div class="f-registration-buy__agree">
                <div class="mb-10">
                  <a-checkbox v-model="registrationAgreedUS" id="with_email"
                              label="<p style='white-space: break-spaces' >I declare that I am neither a U.S. citizen nor a resident, nor am I subject to U.S. tax or legal jurisdiction.</p>"
                              single />
                </div>
                <a-checkbox v-model="registrationAgreedTerms" id="with_email1"
                            label="<p style='white-space: break-spaces' >I agree to the <span class='link'>Terms & Conditions</a></p>" @label-click="openTermsModal"
                            single />
              </div>

              <div class="flex">
                <a-button variant="secondary" class="f-registration-buy__button f-registration-buy__button-back" @click="() => {openPurchase(purchaseStepsArr[0])}"
                          text="Back"></a-button>
                <a-button class="f-registration-buy__button f-registration-buy__button-continue" :disabled="termsContinueDisabled" @click="() => {openPurchase(purchaseStepsArr[2], loadPayWallets)}"
                          text="Continue"></a-button>
              </div>

            </div>
          </section>

          <section :class="['f-registration-buy__purchase--drop-down f-registration-buy__purchase--drop-down-pay flex flex-col justify-center p-4 w-full font-bold bg-white cursor-pointer', {'f-registration-buy__purchase--drop-down-desktop': payShow}]">
            <header @click="() => {togglePurchase(purchaseStepsArr[2])}" class="f-registration-buy__purchase--drop-down-title flex">
              <div class="f-registration-buy__purchase--drop-down-title-number f-registration-buy--text-normal flex justify-center items-center px-2 h-6 text-center aspect-square rounded-full" aria-hidden="true">3</div>
              <h2 class="f-registration-buy__purchase--drop-down-title-text f-registration-buy--text-normal flex-auto">Pay</h2>
              <NuxtImg :src="$app.store.user.theme === 'dark' ? '/img/icons/mono/chevron-bottom-dark.svg' : '/img/icons/mono/chevron-bottom.svg'" :class="['f-registration-buy__purchase--drop-down-arrow w-6 aspect-square', {'rotate-180': payShow}]" alt="Down arrow icon" loading="lazy" />
            </header>

            <div v-if="payShow">
              <div class="f-registration-buy__purchase-line"></div>
              <template v-if="currentPayStep === StepsPay.PayWith">
                <div v-for="pay in payWith">
                  <div v-if="pay.show" @click="pay.onClick ? handlePayMethod(pay.onClick) : () => currentPayStep = StepsPay.Process" class="f-registration-buy__purchase-pay-item flex flex-col justify-center cursor-pointer">
                    <div class="flex flex-col justify-center p-5 w-full ">
                      <div class="flex gap-1">
                        <NuxtImg :src="pay.icon" alt="USDT TRC20 option" class="f-registration-buy__purchase-pay-item-icon f-registration-buy__purchase-pay-item-icon-method w-6 aspect-square" loading="lazy"/>
                        <p class="flex-auto font-semibold">{{ pay.title }}</p>

                        <NuxtImg v-if="pay.title === 'Pay through Moonpay'" src="/img/icons/colorful/visa2.svg" width="51" height="10" class="f-registration-buy__purchase-pay-item-icon f-registration-buy__purchase-pay-item-icon-visa" alt="Visa" loading="lazy" />

                        <NuxtImg :src="$app.store.user.theme === 'dark' ? '/img/icons/mono/chevron-dark-right.svg' : '/img/icons/mono/chevron-right.svg'" class="f-registration-buy__purchase-pay-item-icon-arrow my-auto aspect-square w-[18px]" alt="Right arrow icon" loading="lazy" />
                      </div>
                    </div>

                  </div>
                </div>
              </template>

              <template v-if="currentPayStep === StepsPay.Loading">
                <div class="f-registration-buy__purchase-loading">
                  Loading...
                </div>
              </template>

              <template v-if="currentPayStep === StepsPay.Process">
                <w-buy-shares-payment-short-purchase :switches="switches" :refCode="refCode" :payType="currentPayType"  :calc-value="$app.store.purchase.amountUS" :is-fiat="false"/> <!--buyAmount-->
              </template>

              <template v-if="currentPayStep === StepsPay.Paid">
                <div class="flex flex-col justify-end items-center px-4 pt-4 pb-8 font-bold  ">
                  <a v-if="btnMoonpayActive" :href="moonpayPaymentLink" target="_blank">
                    <button
                      @click="btnMoonpayActive = false"
                      class="f-registration-buy__purchase--step-btn f-registration-buy__button-continue f-registration-buy--text-normal w-full justify-center items-center whitespace-nowrap rounded-lg" tabindex="0">
                      Pay
                    </button>
                  </a>
                  <p class="f-registration-buy__purchase--processing-text mt-4" v-if="!btnMoonpayActive">Processing payment, please wait</p>

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
import EBuySharesSuccessModal from "~/src/entities/e-buy-shares-success-modal/e-buy-shares-success-modal.vue";
import WBuySharesPaymentShortPurchase from "~/src/widgets/w-buy-shares-payment-short-purchase/w-buy-shares-payment-short-purchase.vue";
import { hostname } from '~/src/app/adapters/ethAdapter'
import { PayTypes } from '~/src/shared/constants/payWith'
import ASwitch from '~/src/shared/ui/atoms/a-switch/a-switch.vue'
import { useMoonpay } from '~/src/app/composables/useMoonpay';
import { Centrifuge } from 'centrifuge';
import { usePayment } from '~/src/app/composables/usePayment';

const emit = defineEmits([ 'update'])

const { $app } = useNuxtApp()
const router = useRouter()
const route = useRoute()
const {
  payWith,
  switches,
  getPayWallets,
  currentPayType,
  openMoonpayHandler,
  getMoonpayPaymentUrl,
} = usePayment($app)
const { isApple, isSafari } = useDevice();
const token = ref('')
const siteKey = ref(window.location.host === 'bitcoinetf.org' ? '0x4AAAAAAAO0YJKv_riZdNZX' : '1x00000000000000000000AA');
const enum Steps {
  Purchase = 'Purchase',
}
const enum StepsPay {
  PayWith = 'PayWith',
  Process = 'Process',
  Paid = 'Paid',
  Loading = 'Loading',
}

// const { init: initMoonpay, show: showMoonpay } = useMoonpay()
const moonpayPaymentLink = ref(null)
const btnMoonpayActive = ref(false)

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

      wallets.value = response.data
    })
    .catch(() => {
      // Todo: notify something went wrond
    })
}

const getMoonpayWallets = async () => {
  try {
    const moonpayUrl = await getMoonpayPaymentUrl()

    if (isSafari || isApple) {
      moonpayPaymentLink.value = moonpayUrl
      btnMoonpayActive.value = true
    } else {
      window.open(moonpayUrl, '_blank')
    }

    currentPayStep.value = StepsPay.Paid;
  } catch (e) {

  }
}

const refCodeApply = async () => {

  if(refApply.value) return



  if ($app.store.user?.info?.referrals?.used_code === null ) { //|| $app.store.user?.info?.referrals?.used_code === undefined
    await $app.api.eth.referral
      .checkReferralCode(refCode.value)
      .then(() => {
        refCodeError.value = false;
        refCodeBtnText.value = 'Applied!';
        refApply.value = true;
        $app.store.user.info.referrals.used_code = refCode.value;
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

const referralAmount = computed(() => {
  return `$${ $app.filters.rounded(Math.floor(wallets.value?.referral?.usd_amount), 0) || 0}`;
  // return `$${$app.filters.rounded(wallets.value?.referral?.usd_amount, 0) || 0}`
})
const dividendsAmount = computed(() => {
  return `$${ $app.filters.rounded(Math.floor(wallets.value?.dividends?.usd_amount), 0) || 0}`;
  return `$${$app.filters.rounded(wallets.value?.dividends?.usd_amount, 0) || 0}`
})

const discountAmount = ref(0);
const origAmount = $app.store.purchase.amount;
const originalAmount = ref($app.store.purchase.amount);
const originalWithDiscount = ref($app.store.purchase.amountUS);

const totalPayout = ref($app.store.purchase.totalPayout);

onMounted(async () => {
  $app.store.purchase.amountUS = originalWithDiscount.value;


  refCode.value = $app.store.user?.info?.referrals?.used_code || '';
  await getWallets()

  await $app.api.eth.auth.getUser().then((resp) => {
    $app.store.user.info = resp?.data
  })

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
    $app.store.purchase.amount = originalWithDiscount.value;
    totalPayout.value = originalWithDiscount.value + (originalWithDiscount.value * ( ($app.store.purchase.apy ? $app.store.purchase.apy : 33.333333333333336) / 100))*3;
  }
)


watch(
  () => switches.dividends,
  (value) => {
    if (value) {
      discountAmount.value += Math.floor(wallets.value?.dividends?.usd_amount);
      originalWithDiscount.value = $app.store.purchase.amountUS + discountAmount.value;
    } else {
      discountAmount.value -= Math.floor(wallets.value?.dividends?.usd_amount);
      originalWithDiscount.value = $app.store.purchase.amountUS + discountAmount.value;
    }
  },
)

watch(
  () => $app.store.purchase.amount,
  () => {
    originalWithDiscount.value = $app.store.purchase.amountUS + discountAmount.value;
  }
)

watch(
  () => switches.referral,
  (value) => {
    if (value) {
      discountAmount.value += Math.floor(wallets.value?.referral?.usd_amount);
      originalWithDiscount.value = $app.store.purchase.amountUS + discountAmount.value;
    } else {
      discountAmount.value -= Math.floor(wallets.value?.referral?.usd_amount);
      originalWithDiscount.value = $app.store.purchase.amountUS + discountAmount.value;
    }
  },
)

// Terms step

const registrationAgreedUS = ref(false)
const registrationAgreedTerms = ref(false)

const termsContinueDisabled = computed<boolean>(() => {
  return !registrationAgreedUS.value || !registrationAgreedTerms.value
})

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

  // todo uncomment
  // if(!$app.store.user?.info?.account?.tron_wallet) {
  //   $app.store.user.info.account.tron_wallet = $app.store.user.wallets.tron;
  // }

}
const isOpenSuccessModal = ref(false)
const centrifuge = ref(null)
const isOpenSuccessPaymentModal = ref(false)
const paymentAmount = ref({ amount: 0 })

const openMoonpay = async () => {
  return await openMoonpayHandler(getMoonpayWallets, (ctx) => {
    paymentAmount.value.amount = ctx.data.message?.data?.amount;
    console.log(paymentAmount.value.amount, ctx)
    isOpenSuccessPaymentModal.value = true
  })
}

const openEth = async () => {
  currentPayStep.value = StepsPay.Loading;
  currentPayType.value = PayTypes.Ethereum;
  currentPayStep.value = StepsPay.Process;
}

const openPolygon = async () => {
  currentPayStep.value = StepsPay.Loading;
  currentPayType.value = PayTypes.Polygon;
  currentPayStep.value = StepsPay.Process;
}

const handlePayMethod = (functionName) => {
  const handlers = {
    openMoonpay,
    openEth,
    openPolygon,
    openTrc,
  }

  handlers[functionName]()
}

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

onMounted(() => {
  if($app.store.purchase.currentStep == 'Confirm') {
    openPurchase(purchaseStepsArr[0])
  }
});

watch(
  () => $app.store.purchase.currentStep,
  () => {
    if($app.store.purchase.currentStep == 'Confirm') {
      confirmShow.value = true;
      signShow.value = false;
      payShow.value = false;
    }
  }
)

const loadPayWallets = async () => {
  currentPayStep.value = StepsPay.Loading;

  await getPayWallets()

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

  $app.store.purchase.currentStep = target.name;

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

        if(target.name === PurchaseSteps.Sign) {
          if(!confirmDisabled.value) {
            purchaseStepsArr[i].value.value = !purchaseStepsArr[i].value.value;
          } else {
            confirmShow.value = true;
          }

        } else if (target.name === PurchaseSteps.Pay) {

          if(!termsContinueDisabled.value) {
            purchaseStepsArr[i].value.value = !purchaseStepsArr[i].value.value;
          } else {
            signShow.value = true;
          }
        } else {
          purchaseStepsArr[i].value.value = !purchaseStepsArr[i].value.value;
        }



      } else {
        purchaseStepsArr[i].value.value = false;
      }
    }
  }

}

const paymentModalClose = () => {
  router.replace({ query: null })
}
</script>

<style lang="scss" src="./f-registration-buy.scss" />

