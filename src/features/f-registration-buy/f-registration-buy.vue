<template>
  <div class="f-registration w-full">

      <e-success-modal :isBtc="isBtcModal" :model-value="succesModalVisible" @update:modelValue="updateModalVisible"></e-success-modal>

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
              <div @click="() => {openPurchase(purchaseStepsArr[2])}" :class="['f-registration__purchase-steps-desktop-step', {'f-registration__purchase-steps-desktop-step-active': payShow}]">3. Pay</div>
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
                    <div class="flex gap-2 justify-between">
                      <p class="f-registration__purchase--step-text-sale f-registration--text-normal"> US${{ $app.filters.rounded($app.store.purchase.amount, 0)  }} </p>
                      <p class="f-registration__purchase--step-text f-registration--text-normal flex-auto">US${{ $app.filters.rounded($app.store.purchase.amount+discountAmount, 2) }} <span class="f-registration__purchase--step-title">(-${{ $app.filters.rounded(discountAmount, 2)  }} off)</span></p>
                    </div>
                  </div>

                  <div class="f-registration__purchase--confirm-item-full">
                    <a-input-with-button
                      label="Referral code"
                      v-model="refCode"
                      buttonText="Apply"
                    />
                  </div>

                  <div class="f-registration__purchase--confirm-item">
                    <p class="f-registration__purchase--step-title f-registration--text-normal">Investment Currency</p>
                    <p class="f-registration__purchase--step-text f-registration--text-normal"> {{ $app.store.purchase.type === 'USDT' ? 'Tether (USDT)' : 'Bitcoin (BTC)'}} </p>
                  </div>

                  <div class="f-registration__purchase--confirm-item">
                    <p class="f-registration__purchase--step-title f-registration--text-normal">Interest Type</p>
                    <p class="f-registration__purchase--step-text f-registration--text-normal">Fixed in USD</p>
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

                  <div class="f-registration__purchase--confirm-item">
                    <p class="f-registration__purchase--step-title f-registration--text-normal">Total Projected Interest</p>
                    <p class="f-registration__purchase--step-text f-registration--text-normal">100%+</p>
                  </div>

                  <div class="f-registration__purchase--confirm-item">
                    <p class="f-registration__purchase--step-title f-registration--text-normal">Total Guaranteed Interest</p>
                    <p class="f-registration__purchase--step-text f-registration--text-normal">42%</p>
                  </div>

                  <div class="f-registration__purchase--confirm-item">
                    <p class="f-registration__purchase--step-title f-registration--text-normal">Dividends Schedule</p>
                    <p class="f-registration__purchase--step-text f-registration--text-normal">Daily in USDT</p>
                  </div>

                  <div class="f-registration__purchase--confirm-item">
                    <p class="f-registration__purchase--step-title f-registration--text-normal">Dividends Withdrawal</p>
                    <p class="f-registration__purchase--step-text f-registration--text-normal">Automatic with $100 min. threshold</p>
                  </div>

                  <div class="f-registration__purchase--confirm-item">
                    <p class="f-registration__purchase--step-title f-registration--text-normal">Total Guaranteed Payout</p>
                    <p class="f-registration__purchase--step-text f-registration--text-normal">US${{ $app.store.purchase.totalPayout }}</p>
                  </div>

                  <div class="f-registration__purchase--confirm-item-btn">
                    <button @click="() => {openPurchase(purchaseStepsArr[1])}" class="f-registration__purchase--step-btn f-registration__button-continue f-registration--text-normal w-full justify-center items-center whitespace-nowrap rounded-lg" tabindex="0">Continue</button>
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
                <a-button class="f-registration__button f-registration__button-continue" :disabled="termsContinueDisabled" @click="() => {openPurchase(purchaseStepsArr[2])}"
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
                    <div @click="pay.onClick ? pay.onClick() : () => currentPayStep = StepsPay.Process" class="f-registration__purchase-pay-item flex flex-col justify-center cursor-pointer">
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

                <template v-if="currentPayStep === StepsPay.Process">
                  <w-buy-shares-payment-short-purchase :calc-value-original="buyAmountOriginal" :calc-value="buyAmount" :is-fiat="false"/>
                </template>

                <template v-if="currentPayStep === StepsPay.Loading">
                  <div class="flex flex-col justify-end items-center px-4 pt-4 pb-8 font-bold  ">
                    <p class="f-registration__purchase--processing-text mt-4">Processing payment, please wait</p>

                    <button @click="() => {isBtcModal = false; succesModalVisible = true}" style="color: var(--text-secondary)">Open success USDT</button>
                    <button @click="() => {isBtcModal = true; succesModalVisible = true}" style="color: var(--text-secondary)">Open success BTC</button>

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
  Loading = 'Loading',
}

const confirmResponse = ref(null)

const currentStep = ref(Steps.Purchase);
const backendError = ref('')

// confirm

const discountAmount = ref(($app.store.purchase.amount/100)*$app.store.user.statistic?.trc_bonus?.percent); //5

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

// Terms step

const registrationAgreedUS = ref(false)
const registrationAgreedTerms = ref(false)

const termsContinueDisabled = computed<boolean>(() => {
  return !registrationAgreedUS.value || !registrationAgreedTerms.value
})


const openTrc = async () => {
  // await $app.api.eth.auth.getUser().then((resp) => {
  //   $app.store.user.info = resp?.data
  // });

  // await $app.api.info.blockchainProxy.getUserBlockchainWallet().then((resp) => {
  //   $app.store.user.blockchainUserWallet = resp?.data.uid
  // });

  currentPayStep.value = StepsPay.Process;
}

const payWith = ref([
  {
    icon: "/img/icons/colorful/usdt-trc20.svg",
    title: "Pay with USDT (TRC20)",
    onClick: openTrc,
  },
  {
    icon: "/img/icons/colorful/usdt-trc20.svg",
    title: "Pay with USDT (BEP-20)"
  },
  {
    icon: "/img/icons/colorful/usdt-trc20.svg",
    title: "Pay with USDT (ERC-20)"
  },
  {
    icon: "/img/icons/colorful/usdt-trc20.svg",
    title: "Pay with USDT (Liquid)"
  },
  {
    icon: "/img/icons/colorful/metamask.svg",
    title: "Pay with WalletConnect"
  },
  {
    icon: "/img/icons/colorful/metamask.svg",
    title: "Pay with Metamask"
  },

]);

// Ref code field

const refCode = ref('')

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
const defaultBuyAmount = $app.store.purchase.amount - ($app.store.purchase.amount/100)*discountPercent;
// const buyAmount = ref(isNaN(defaultBuyAmount) ? 100 : defaultBuyAmount);
const buyAmount = computed(() => {
  return $app.store.purchase.amount - ($app.store.purchase.amount/100)*discountPercent
});
const buyAmountOriginal = computed(() => {
  return $app.store.purchase.amount
});



const copiedAddressValue = ref('TBia4uHnb3oSSZm5isP284cA7Np1v15Vhi');
const addressCopied = ref(false);
const copiedAmountValue = ref('1,002.93 USDT');
const amountCopied = ref(false);



const { copy } = useClipboard({ copiedAddressValue });

const copyToClipboardAddress = () => {
  copy(copiedAddressValue.value);
  addressCopied.value = true;
}

const copyToClipboardAmount = () => {
  copy(copiedAmountValue.value);
  amountCopied.value = true;
}

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

const openPurchase = (target: any) => {
  confirmShow.value = false;
  signShow.value = false;
  payShow.value = false;

  target.value.value = true;
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

const succesModalVisible = ref(false);
const isBtcModal = ref(false);

const updateModalVisible = (isVisible: boolean) => {
  succesModalVisible.value = isVisible
  emit('update', isVisible)
}

</script>

<style lang="scss" src="./f-registration-buy.scss" />

