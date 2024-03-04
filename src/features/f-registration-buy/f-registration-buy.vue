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
                <NuxtImg src="/img/icons/mono/chevron-bottom.svg" :class="['f-registration__purchase--drop-down-arrow w-6 aspect-square', {'rotate-180': confirmShow}]" alt="Down arrow icon" />
              </header>

              

              <div v-if="confirmShow">
                <div class="f-registration__purchase-line"></div>

                <div class="f-registration__purchase--confirm-wrapper">
                  <div class="f-registration__purchase--confirm-item">
                    <p class="f-registration__purchase--step-title f-registration--text-normal">Amount of Shares You’re Buying</p>
                    <p class="f-registration__purchase--step-text f-registration--text-normal"> {{  '10,000'}} </p>
                  </div>

                  <div class="f-registration__purchase--confirm-item">
                    <p class="f-registration__purchase--step-title f-registration--text-normal">Total Investment Amount</p>
                    <div class="flex gap-2 justify-between">
                      <p class="f-registration__purchase--step-text-sale f-registration--text-normal"> US${{ '10,000'}} </p>
                      <p class="f-registration__purchase--step-text f-registration--text-normal flex-auto">US${{ '10,500'}} <span class="f-registration__purchase--step-title">(-$500 off)</span></p>
                    </div>
                  </div>

                  <div class="f-registration__purchase--confirm-item-full">
                    <a-input-with-button 
                      label="Referral code"
                      v-model="refCode"
                    />
                  </div>

                 

                  <div class="f-registration__purchase--confirm-item">
                    <p class="f-registration__purchase--step-title f-registration--text-normal">Investment Currency</p>
                    <p class="f-registration__purchase--step-text f-registration--text-normal">Tether (USDT)</p>
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
                    <p class="f-registration__purchase--step-text f-registration--text-normal">US$14,700</p>
                  </div>

                  <div class="f-registration__purchase--confirm-item-btn">
                    <button @click="() => {openPurchase(purchaseStepsArr[1])}" class="f-registration__purchase--step-btn f-registration__button-continue f-registration--text-normal w-full justify-center items-center whitespace-nowrap rounded-lg" tabindex="0">Continue</button>
                  </div>
                  
                </div>
                
              </div>
            </section>

            <section :class="['f-registration__purchase--drop-down flex flex-col justify-center p-4 w-full font-bold whitespace-nowrap bg-white rounded-lg', {'f-registration__purchase--drop-down-desktop': signShow}]" >
              <header @click="() => {togglePurchase(purchaseStepsArr[1])}" class="f-registration__purchase--drop-down-title flex gap-2">
                <div class="f-registration__purchase--drop-down-title-number f-registration--text-normal flex justify-center items-center px-2 h-6 text-center aspect-square rounded-full" aria-hidden="true">2</div>
                <h2 class="f-registration__purchase--drop-down-title-text f-registration--text-normal flex-auto">Sign</h2>
                <NuxtImg src="/img/icons/mono/chevron-bottom.svg" :class="['f-registration__purchase--drop-down-arrow w-6 aspect-square', {'rotate-180': signShow}]" alt="Down arrow icon" />
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
                <NuxtImg src="/img/icons/mono/chevron-bottom.svg" :class="['f-registration__purchase--drop-down-arrow w-6 aspect-square', {'rotate-180': payShow}]" alt="Down arrow icon" />
              </header>

              <div v-if="payShow">
                <div class="f-registration__purchase-line"></div>
                <template v-if="currentPayStep === StepsPay.PayWith">
                  <div v-for="pay in payWith">
                    <div @click="currentPayStep = StepsPay.Process" class="flex flex-col justify-center mt-4 text-base bg-gray-100 rounded-lg border border-solid border-gray-200 text-zinc-800 cursor-pointer">
                      <div class="flex flex-col justify-center p-5 w-full bg-white">
                        <div class="flex gap-1">
                          <NuxtImg :src="pay.icon" alt="USDT TRC20 option" class="w-6 aspect-square" />
                          <p class="flex-auto font-semibold">{{ pay.title }}</p>
                          <NuxtImg src="/img/icons/mono/chevron-right.svg" class="my-auto aspect-square w-[18px]" alt="Right arrow icon" />
                        </div>
                      </div>
                    </div>
                  </div>
                </template>

                <template v-if="currentPayStep === StepsPay.Process">
                  <div class="f-registration__purchase--process flex flex-col">
                    <div class="flex justify-center items-center self-center px-11 mt-4 w-full bg-white rounded-xl max-w-[261px]">
                      <NuxtImg src="/img/qr-code-test.svg" alt="Payment QR Code" class="w-full aspect-[1.01]" />
                    </div>
                    <article class="flex gap-4 justify-between px-4 py-3 mt-6 rounded-lg bg-neutral-100">
                      <NuxtImg src="/img/icons/colorful/usdt-trc20.svg" alt="USDT TRC20 option" class="my-auto w-6 aspect-square" />
                      <div class="flex flex-col flex-1 pr-9">
                        <p class="f-registration__purchase--process-field-title text-xs font-bold text-gray-400">Deposit Method:</p>
                        <p class="f-registration__purchase--process-field-text whitespace-nowrap text-zinc-800 font-normal">Tether USDT (Tron, TRC-20)</p>
                      </div>
                    </article>

                    <a-input
                      class="flex gap-4 justify-between mt-6 rounded-lg bg-neutral-100 "
                      label="Deposit address on Tron chain:"
                      :model-value="'TBia4uHnb3oSSZm5isP284cA7Np1v15Vhi'"
                      :disabled="true"
                      :text-icon="addressCopied"
                      text-icon-text="Copied!"
                      :icon="Icon.ColorfulCopy"
                      position-icon="right"
                      @on-input-click="() => copyToClipboardAddress()"
                      isBoldInput
                      isTextInputSmall
                    />
                    <!-- <article class="flex gap-4 justify-between px-4 py-3.5 mt-6 rounded-lg bg-neutral-100">
                      <div class="flex flex-col flex-1 pr-2.5">
                        <p class="text-xs font-bold text-gray-400">Deposit address on Tron chain:</p>
                        <p class="text-xs font-medium text-zinc-800">TBia4uHnb3oSSZm5isP284cA7Np1v15Vhi</p>
                      </div>
                      <NuxtImg src="/img/icons/colorful/copy.svg" alt="Copy Address Icon" class="my-auto w-6 aspect-square" />
                    </article> -->

                    <a-input
                      class="flex gap-4 justify-between mt-6 rounded-lg bg-neutral-100"
                      label="Amount"
                      :model-value="'1,002.93 USDT'"
                      :disabled="true"
                      :text-icon="amountCopied"
                      text-icon-text="Copied!"
                      :icon="Icon.ColorfulCopy"
                      position-icon="right"
                      @on-input-click="() => copyToClipboardAmount()"
                      isBoldInput
                    />
                    <!-- <article class="flex gap-4 justify-between px-4 py-3 mt-6 rounded-lg bg-neutral-100">
                      <div class="flex flex-col flex-1">
                        <p class="text-xs font-bold text-gray-400">Amount</p>
                        <p class="text-base text-zinc-800">1,002.93 USDT</p>
                      </div>
                      <NuxtImg src="/img/icons/colorful/copy.svg" alt="Copy Address Icon" class="my-auto w-6 aspect-square" />
                    </article> -->
                    <button @click="currentPayStep = StepsPay.Loading" class="block	w-full justify-center items-center px-16 py-5 mt-4 text-base font-bold text-white whitespace-nowrap bg-blue-600 rounded-lg" tabindex="0">
                      I Have Paid
                    </button>
                    <button @click="currentPayStep = StepsPay.PayWith" class="block w-full justify-center items-center px-16 py-5 mt-2 text-base font-bold text-blue-600 whitespace-nowrap bg-sky-100 rounded-lg" tabindex="0">
                      Cancel Order
                    </button>
                    <footer class="text-center py-6">
                      <nuxt-link to="/personal/support" target="_blank">
                        <span  class="self-center mt-7 text-base font-bold text-blue-600 whitespace-nowrap" tabindex="0">Contact support</span>
                      </nuxt-link>
                    
                    </footer>
                  </div>
                </template>

                <template v-if="currentPayStep === StepsPay.Loading">
                  <div class="flex flex-col justify-end items-center px-4 pt-4 pb-8 font-bold  ">
                    <p class="mt-4 text-base text-black">Processing payment, please wait</p>

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

const currentSignup = ref(SignupMethods.Email);
const currentStep = ref(Steps.Purchase);
const backendError = ref('')

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

const termsContinue = () => {
  currentStep.value = Steps.Choice
}

// Email Field
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const emailErrorText = ref('')
const isEmailValid = ref(false)

const phone = ref('');
const phoneErrorText = ref('');
const isPhoneValid = ref(false);

function emailFieldBlurHandler() {
  if (isEmailValid.value) {
      emailErrorText.value = ''
      return
  }

  if (email.value) {
      emailErrorText.value = 'Invalid email address'
      return
  }

  emailErrorText.value = 'Required'
}

function phoneFieldBlurHandler() {
  if (isPhoneValid.value) {
      phoneErrorText.value = ''
      return
  }

  if (phone.value) {
      phoneErrorText.value = 'Invalid phone'
      return
  }

  phoneErrorText.value = 'Required'
}

// Choice step

const choiceToEmail = () => {
  currentStep.value = Steps.Email;
  currentSignup.value = SignupMethods.Email;
}

const isMetamaskSupported = ref(false);
const address = ref("");
const metamaskError = ref("");
const computedAddress = computed(() => address.value.substring(0, 8) + '...');

onMounted(() => {
  isMetamaskSupported.value = typeof (window as any).ethereum !== "undefined";

  (window as any).ethereum.on("chainChanged", (chainId: string) => {
      if (chainId !== "0x1") {
          metamaskError.value = "This network is not supported. Please change the network to Ethereum."
      } else if (chainId === "0x1") {
          metamaskError.value = "";
      }
  });
})

const handleDisconnect = () => {
  (window as any).ethereum.request({
      method: "wallet_revokePermissions",
      params: [
          {
              eth_accounts: {},
          },
      ],
  });
  address.value = "";
}

const isMetamaskConnecting = ref(false);

const handleMetamaskConnect = async () => {
  // if metamask button is already clicked
  if(isMetamaskConnecting.value) return;
  isMetamaskConnecting.value = true;

  //if metamask is not installed
  if (!isMetamaskSupported.value) {
      window.location.href = 'https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn';
      isMetamaskConnecting.value = false;
      return;
  }

  currentSignup.value = SignupMethods.Metamask;

  try {
    const accounts: string[] = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
    const chainId: string = await (window as any).ethereum.request({"method": "eth_chainId","params": []});
    const responseSwitchChain: any = await(window as any).ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: "0x1" }] });
    const responseBackend: any = await axios.get("https://api.stage.techetf.org/v1/auth/provider/metamask/message");

    metamaskSignatureMessage.value = responseBackend.data.message;
    address.value = accounts[0];
    const provider = new BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    metamaskWalletAddress.value = signer.address;

    const signedMsg = await (window as any).ethereum.request({"method": "personal_sign","params": [responseBackend.data.message, accounts[0],]});

    console.log("SIGNED MSG", signedMsg);
    metamaskSignature.value = signedMsg;
    isMetamaskConnecting.value = false;
    currentStep.value = Steps.Email;

  } catch (e) {
    console.error(e);
    isMetamaskConnecting.value = false;
  }

}

const googleData : any = ref();
const googleUrl = ref("");


onMounted(() => {
  axios.get("https://api.stage.techetf.org/v1/auth/provider/google-auth/redirect-url").then((url: any) => {
    googleUrl.value = url.data.url //.replace("https%3A%2F%2Ffront.stage.techetf.org", "http%3A%2F%2Flocalhost:3000");
  });

  if($app.store.authGoogle.response?.email) {
    currentStep.value = Steps.Email;
    currentSignup.value = SignupMethods.Google;
    firstName.value = $app.store.authGoogle.response.first_name;
    lastName.value = $app.store.authGoogle.response.last_name;
    email.value =$app.store.authGoogle.response.email;
  }
});

const handleGoogleDisconnect = () => {
    googleData.value = null;

    googleLogout();
}

const handleGoogleConnect = async () => {
    currentSignup.value = SignupMethods.Google;
    window.location.href = googleUrl.value;
}

const choices = ref([
  {
    title: 'Sign up with Email',
    icon: "/img/icons/mono/mail-light.svg",
    hadnleClick: choiceToEmail,
  },
  {
    title: 'Sign up with Metamask',
    icon: "/img/icons/colorful/metamask.svg",
    hadnleClick: handleMetamaskConnect,
  },
  {
    title: 'Sign up with Google',
    icon: "/img/icons/colorful/google.svg",
    hadnleClick: handleGoogleConnect,
  },
  {
    title: 'Sign up with Apple',
    icon: "/img/icons/mono/apple.svg",
    hadnleClick: () => {},
  },
  {
    title: 'Sign up with Facebook',
    icon: "/img/icons/colorful/facebook-circle.svg",
    hadnleClick: () => {},
  },
  {
    title: 'Sign up with WalletConnect',
    icon: "/img/icons/colorful/walletConnect.svg",
    hadnleClick: () => {},
  },
  {
    title: 'Sign up with WhatsApp',
    icon: "/img/icons/colorful/whatsApp.svg",
    hadnleClick: handleGoogleConnect,
  },
  {
    title: 'Sign up with Telegram',
    icon: "/img/icons/colorful/telegram2.svg",
    hadnleClick: handleGoogleConnect,
  }
]);

const payWith = ref([
  {
    icon: "/img/icons/colorful/usdt-trc20.svg",
    title: "Pay with USDT (TRC20)"
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
const emailCode = ref('')
const pincodeErrorText = ref('')
const refCode = ref('')
const metamaskSignatureMessage = ref('')
const metamaskSignature = ref('')
const metamaskWalletAddress = ref('')

const isSubmitEmailForm = ref(false);

const onSubmitEmailForm = async () => {

  if(isSubmitEmailForm.value) return;
  isSubmitEmailForm.value = true;

  backendError.value = ''
  const initPayload = {
    method: currentSignup.value,
    first_name: $app.filters.trimSpaceIntoString(firstName.value),
    last_name: $app.filters.trimSpaceIntoString(lastName.value),
    email: $app.filters.trimSpaceIntoString(email.value)
  }

  if(currentSignup.value === SignupMethods.Metamask) {
    initPayload.message = metamaskSignatureMessage.value
    initPayload.signature = metamaskSignature.value
    initPayload.wallet_address = metamaskWalletAddress.value
  }

  if (refCode.value ) {
      initPayload.ref_code = refCode.value
  }

  console.log(currentSignup.value, initPayload.ref_code);

  if (currentSignup.value === SignupMethods.Google) {

    if ($app.store.auth.refCode !== "") {
        initPayload.ref_code = $app.store.auth.refCode
        $app.store.auth.setRefCode("");
    }

    $app.api.eth.auth
      .initGoogle(initPayload)
      .then((tokens: any) => {
        $app.store.auth.setTokens(tokens.data)
        $app.store.authGoogle.setResponse({}, SignupMethods.Google);
        confirmResponse.value = tokens.data
        isSubmitEmailForm.value = false;
        currentStep.value = Steps.Bonus
      })
      .then(async () => {
            await $app.api.eth.auth.getUser().then((resp) => {
                $app.store.user.info = resp?.data
            })
        })
      .catch((e) => {
        console.error(e);
        isSubmitEmailForm.value = false;
          if (e?.errors?.error?.message) {
              backendError.value = e.errors.error.message
          } else {
              backendError.value = 'Something went wrong'
          }
      })

    return;
  }

  if (currentSignup.value === SignupMethods.Metamask) {
    await $app.api.eth.auth
      .initMetamask(initPayload)
      .then(() => {
        isSubmitEmailForm.value = false;
        currentStep.value = Steps.Code;
      })
      .catch((e) => {
        isSubmitEmailForm.value = false;
        if (e?.errors?.error?.message) {
          backendError.value = e.errors.error.message
        } else {
          backendError.value = 'Something went wrong'
        }
      })
  } else {

    await $app.api.eth.auth
      .init(initPayload)
      .then(() => {
        isSubmitEmailForm.value = false;
        currentStep.value = Steps.Code
      })
      .catch((e) => {
        isSubmitEmailForm.value = false;
        if (e?.errors?.error?.message) {
          backendError.value = e.errors.error.message
        } else {
          backendError.value = 'Something went wrong'
        }
      })
  }
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

const emailButtonDisabled = computed<boolean>(() => {
  return !isEmailValid.value || !firstName.value || !lastName.value || !Boolean(token.value) //!registrationAgreed.value
})

// Code Step

const isCodeCorrect = ref(false)

const pincodeTrigger = ref(false)
const onCodeInput = async (codePayload) => {
  backendError.value = ''

  if (codePayload.isCompleted) {
      pincodeTrigger.value = true
      await $app.api.eth.auth
          .check({ email: $app.filters.trimSpaceIntoString(email.value), code: $app.filters.trimSpaceIntoString(emailCode.value) })
          .then((checkResponse) => {
              // currentStep.value = Steps.Password
              isCodeCorrect.value = true
          })
          .catch((e) => {
              pincodeTrigger.value = false

              if (e?.errors?.error?.message) {
                  backendError.value = e.errors.error.message
              } else {
                  backendError.value = 'Something went wrong'
              }
          })
  }
}

const isCodeContinueProcess = ref(false);

const codeContinue = async () => {

  if(isCodeContinueProcess.value) return;
  isCodeContinueProcess.value = true;

  if(currentSignup.value === SignupMethods.Metamask) {
    backendError.value = ''
      await $app.api.eth.auth.
        confirmMetamask({
        email: $app.filters.trimSpaceIntoString(email.value),
        code: $app.filters.trimSpaceIntoString(emailCode.value),
        fast: true,
      })
        .then((jwtResponse: any) => {
          // TODO falling user/me
          $app.store.auth.setTokens(jwtResponse.data)
          confirmResponse.value = jwtResponse.data
          currentStep.value = Steps.Bonus
        })
        .then(async () => {
          await $app.api.eth.auth.getUser().then((resp) => {
            $app.store.user.info = resp?.data
          })
        })
        .catch((e) => {
          isCodeContinueProcess.value = false;
          if (e?.errors?.error?.message) {
            backendError.value = e.errors.error.message
          } else {
            backendError.value = 'Something went wrong'
          }
        })
  } else {
    currentStep.value = Steps.Password
  }
  isCodeContinueProcess.value = false;
}

const resendCodeClick = async () => {
  if (timerStarted.value) {
      return
  }

  backendError.value = ''

  startTimer()

  await $app.api.eth.auth
      .resend({ email: email.value })
      .then(() => {
          // currentStep.value = Steps.Password
      })
      .catch((e) => {
          if (e?.errors?.error?.message) {
              backendError.value = e.errors.error.message
          } else {
              backendError.value = 'Something went wrong'
          }
      })
}

// Password Step


const password = ref('')
const passwordErrorText = ref('')
const isPasswordValid = ref(false)
const isPasswordType = ref(true)

const passwordIconClickHandler = () => {
  isPasswordType.value = !isPasswordType.value;
}


function passwordFieldBlurHandler() {
  if (isPasswordValid.value) {
      passwordErrorText.value = ''
      return
  }

  if (password.value) {
      passwordErrorText.value = 'Must include a mix of upper case, lower case, numeric and special character.'
      return
  }

  passwordErrorText.value = 'Required'
}

const isSubmitPasswordForm = ref(false);

const onSubmitPasswordForm = async () => {

  if(isSubmitPasswordForm.value) return;
  isSubmitPasswordForm.value = true;

  backendError.value = ''
  await $app.api.eth.auth
      .confirm({
          email: $app.filters.trimSpaceIntoString(email.value),
          code: $app.filters.trimSpaceIntoString(emailCode.value),
          password: $app.filters.trimSpaceIntoString(password.value),
      })
      .then((jwtResponse: any) => {
          // TODO falling user/me
          $app.store.auth.setTokens(jwtResponse.data)
          confirmResponse.value = jwtResponse.data
          isSubmitPasswordForm.value = false;
          currentStep.value = Steps.Bonus
      })
      .then(async () => {
          await $app.api.eth.auth.getUser().then((resp) => {
              $app.store.user.info = resp?.data
          })
      })
      .catch((e) => {
        console.error(e);
        isSubmitPasswordForm.value = false;
          if (e?.errors?.error?.message) {
              backendError.value = e.errors.error.message
          } else {
              backendError.value = 'Something went wrong'
          }
      })
}

// Bonus Step
const getBonus = () => {
  router.push('/personal/analytics')
}

onMounted(() => {
  if (route.query.referral) {
      $app.store.auth.setRefCode({ref_code: route.query.referral});
      refCode.value = route.query.referral
      accordionRef.value?.open()
  }
})


// Purchase Step

const confirmShow = ref(true);
const signShow = ref(false);
const payShow = ref(false);

const currentPayStep = ref(StepsPay.PayWith);

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

