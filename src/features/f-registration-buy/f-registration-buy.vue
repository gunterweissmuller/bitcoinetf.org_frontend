<template>
  <div class="f-registration w-full">

      <!-- <template v-if="currentStep === Steps.Terms">
          <div class='f-registration__back' @click='$router.back()'>
              <a-icon class='f-registration__back-icon' width='24' :name='Icon.MonoChevronLeft' />
          </div>
          <h3 class="f-registration__title">Sign up</h3>
          <h5 class="f-registration__subtitle">
              If you already have an account, you can
              <nuxt-link to="/personal/login">log in here.</nuxt-link>
          </h5>

          <div class="f-registration__agree">
              <div class="mb-10">
                  <a-checkbox v-model="registrationAgreedUS" id="with_email"
                      label="<p >I declare that I am neither a U.S. citizen nor a resident, nor am I subject to U.S. tax or legal jurisdiction.</p>"
                      single />
              </div>
              <a-checkbox v-model="registrationAgreedTerms" id="with_email1"
                  label="<p>I agree to the <span class='link'>Terms & Conditions</a></p>" @label-click="openTermsModal"
                  single />
          </div>
          <a-button class="f-registration__button" :disabled="termsContinueDisabled" @click="termsContinue"
              text="Continue"></a-button>
      </template> -->

      <template v-if="currentStep === Steps.Choice">
          <div class='f-registration__back' @click='$router.back()'>
              <a-icon class='f-registration__back-icon' width='24' :name='Icon.MonoChevronLeft' />
          </div>
          <h3 class="f-registration__title">Sign up</h3>
          <h5 class="f-registration__subtitle">
              If you already have an account, you can
              <nuxt-link to="/personal/login">log in here.</nuxt-link>
          </h5>

          <div v-for="choice in choices">
            <div @click="choice.hadnleClick" :class="['f-registration__choice-button', {'flex justify-center items-center mt-4 px-16 py-5 max-w-full text-base font-bold whitespace-nowrap bg-white rounded-lg shadow-sm text-zinc-800 max-w-[410px] w-full max-md:px-5 cursor-pointer': choice.title !== 'Sign up with Email'}, {'flex justify-center items-center px-16 py-5 max-w-full text-base font-bold text-white whitespace-nowrap bg-blue-600 rounded-lg max-w-[410px] w-full max-md:px-5 cursor-pointer': choice.title == 'Sign up with Email'}]" >
              <div class="flex gap-2 items-center">
                  <NuxtImg :src="choice.icon" width="18" height="18"
                      class="aspect-square w-[18px]" />
                  <div class="grow">{{ choice.title }}</div>
              </div>
            </div>
          </div>
      </template>

      <template v-else-if="currentStep === Steps.Email">
          <div class='f-registration__back' @click='currentStep = Steps.Choice'>
              <a-icon class='f-registration__back-icon' width='24' :name='Icon.MonoChevronLeft' />
          </div>
          <h3 class="f-registration__title">Sign up with {{ currentSignup }}</h3>
          <h5 class="f-registration__subtitle">
              Enter your details below and press Continue. We will send you a confirmation code shortly.
          </h5>
          <form class="f-registration__form" @submit.prevent="onSubmitEmailForm">

              <a-input v-model="firstName" label="First name" required class="f-registration__name" />
              <a-input v-model="lastName" label="Last name" required class="f-registration__name" />
              <a-input class="f-registration__email" label="Email" validation-reg-exp-key="email" :disabled="currentSignup === SignupMethods.Google ? true : false" required
                  :error-text="emailErrorText" @blur="emailFieldBlurHandler" @update:is-valid="isEmailValid = $event"
                  v-model="email" />
              <a-input class="f-registration__phone" type="tel" label="Phone Number" validation-reg-exp-key="tel" required
                :error-text="phoneErrorText" @blur="phoneFieldBlurHandler" @update:is-valid="isPhoneValid = $event"
                v-model="phone" />

              <vue-turnstile :site-key="siteKey" v-model="token" class="captchaTurn" />

              <a-button class="f-registration__button" :disabled="emailButtonDisabled" type="submit"
                  text="Continue"></a-button>

              <p class="f-registration__error" v-if="backendError">{{ backendError }}</p>
          </form>
      </template>

      <template v-else-if="currentStep === Steps.Code">
          <!-- <div class='f-registration__back' @click='currentStep = Steps.Email'>
              <a-icon class='f-registration__back-icon' width='24' :name='Icon.MonoChevronLeft' />
          </div> -->
          <h3 class="f-registration__title">
              Confirm your Email
          </h3>
          <h5 class="f-registration__subtitle">Please open the link we just sent to your email in order to continue.</h5>

          <p v-show="backendError" class="f-registration__error">{{ backendError }}</p>
          <p v-show="timerStarted" class="f-registration__resend-code">
              You can request the code again via {{ timeLeft }} sec.
          </p>
          <a-button :disabled="timerStarted" class="f-registration__button-resend " text="Resend Link"
               :loading="pincodeTrigger && !isCodeCorrect" variant="tertiary"  /> <!--@click="resendCodeClick" -->

          <button @click="currentStep=Steps.Invest">CONTINUE (test)</button>

      </template>
      

      <template v-else-if="currentStep === Steps.Invest">
        <div class="f-registration__invest flex flex-col justify-end items-start px-4 pt-2 "> <!--max-w-[375px]-->
          <header class="flex f-registration__invest-text font-medium text-center whitespace-nowrap"> <!--gap-4-->
            <h1 class="grow text-zinc-800">I want to invest</h1>

            <div class="f-registration__invest-input ml-4 grow flex justify-center text-gray-400 font-semibold bg-sky-50 rounded">
              <span class="f-registration__invest-input-text flex items-center pl-2">$</span>
              <input v-model="investmentAmountModified" class="f-registration__invest-input-text max-w-[90px] flex-1 bg-transparent" placeholder="2,500"/>
            </div>

          </header>
          <p class="mt-3.5 f-registration__invest-text font-medium text-center text-zinc-800">and receive my daily</p>
          <div class="flex gap-2 mt-3.5 f-registration__invest-text font-medium text-center whitespace-nowrap text-zinc-800">
            <span class="grow">dividends in</span>

            <div class="relative">
              <div class="flex gap-2 font-medium text-center whitespace-nowrap text-zinc-800 rounded">
                <div @click="toggleCurrencyDropdown" class="relative flex items-center justify-center gap-2 py-1.5 pr-2.5 pl-2.5 text-xl text-gray-400 bg-sky-50 rounded cursor-pointer">
                  <NuxtImg :src="selectedCurrency.icon" class="w-6 aspect-square cursor-pointer" alt="USDT logo" />
                  <span class="font-semibold text-black">{{ selectedCurrency.value }}</span>
                  <NuxtImg src="/img/icons/mono/chevron-bottom.svg" :class="['w-[18px] aspect-square cursor-pointer', {'rotate-180': showDropdown}]" alt="Down arrow icon"/>
                </div>
              </div>
              <div v-if="showDropdown" class="w-full absolute mt-1 bg-white shadow-lg rounded-lg z-10">
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
          <article class="f-registration__invest flex flex-col justify-center self-stretch mt-6 whitespace-nowrap rounded-lg">
            <div class="f-registration__invest-font flex overflow-hidden relative flex-col justify-center p-4 w-full aspect-[1.72] rounded-lg">
              <NuxtImg :src="selectedCurrency.background" alt="Total Projected Payout backdrop" class="object-cover absolute inset-0 size-full" />
              <p class="f-registration__invest-title relative font-semibold text-white text-opacity-80"> In Total Projected Payout </p>
              <p class="f-registration__invest-sum relative font-black text-white"> $3,457,938.00 </p>
              <p class="f-registration__invest-subtitle relative font-medium text-white text-opacity-80"> Interest + Original Investment Amount + Instant Bonus </p>
              <div class="relative shrink-0 mt-4 h-px bg-white bg-opacity-10"></div>
              <div class="flex relative gap-0 mt-4">
                <div class="f-registration__invest--stats flex flex-col flex-1">
                  <p class="f-registration__invest--stats-title font-medium text-white text-opacity-80"> Daily </p>
                  <p class="f-registration__invest--stats-value text-lg font-black text-white">$24.70</p>
                </div>
                <div class="flex flex-col flex-1">
                  <p class="f-registration__invest--stats-title font-medium text-white text-opacity-80"> Total Profit </p>
                  <p class="text-lg font-black text-white">100%+</p>
                </div>
                <div class="flex flex-col flex-1">
                  <p class="f-registration__invest--stats-title font-medium text-white text-opacity-80"> Monthly </p>
                  <p class="text-lg font-black text-white">$24.70</p>
                </div>
              </div>
              <p class="relative mt-4 text-xs font-medium text-white text-opacity-80"> Safety Rating <span v-for="item in new Array(selectedCurrency.stars)">⭐</span> {{selectedCurrency.stars}}/10 </p>
            </div>
          </article>
          <button @click="currentStep = Steps.Purchase" tabindex="0" class="justify-center items-center self-stretch px-16 py-5 mt-4 text-base font-bold text-white whitespace-nowrap bg-blue-600 rounded-lg"> Continue </button>
        </div>

      </template>

      <template v-else-if="currentStep === Steps.Purchase">
        <main class="flex flex-col mx-auto w-full max-w-[480px]">
          <header class=" flex gap-4 self-stretch mb-6 py-4 pr-4 pl-14 text-lg font-bold text-center whitespace-nowrap text-zinc-800"> <!-- f-registration__purchase-head -->
            <h1 class="grow">Complete your purchase</h1>
            <m-popper hover :title="'Title Info'" :text="'Text Info'">
              <a-icon class="w-6 aspect-square" width="24" height="28" :name="Icon.MonoInfo" />
            </m-popper>
            <!-- <NuxtImg src="/img/icons/mono/info.svg" class="w-6 aspect-square" alt="Confirmation icon" /> -->
          </header>

          <section class="f-registration__purchase-drop-down flex flex-col justify-end p-4 w-full bg-white rounded-lg shadow-sm">
            <header class="f-registration__purchase-title flex gap-2 font-bold whitespace-nowrap cursor-pointer" @click="confirmShow = !confirmShow">
              <div class="justify-center items-center px-2.5 h-6 text-sm text-center text-blue-600 bg-sky-50 aspect-square rounded-full" aria-hidden="true">1</div>
              <h1 class="f-registration__purchase-title-text flex-auto text-black">Confirm</h1>
              <NuxtImg src="/img/icons/mono/chevron-bottom.svg" :class="['w-6 aspect-square', {'rotate-180': confirmShow}]" alt="Down arrow icon" />
            </header>
            <div v-if="confirmShow">
              <p class="mt-4 text-sm font-medium text-gray-400">Amount of Shares You’re Buying</p>
              <p class="text-sm font-bold text-zinc-800"> {{ investmentAmount ?? '10,000'}} </p>
              <p class="mt-4 text-sm font-medium text-gray-400">Total Investment Amount</p>
              <div class="flex gap-2 justify-between text-sm font-bold">
                <p class="text-red-600 line-through"> US${{ investmentAmount ?? '10,000'}} </p>
                <p class="flex-auto text-zinc-800">US${{ investmentAmount ? investmentAmount+500 : '10,500'}} (-$500 off)</p>
              </div>

              <a-input-with-button 
                label="Referral code"
                class="py-3 mt-4"
                v-model="refCode"
                
              />

              <p class="mt-4 text-sm font-medium text-gray-400">Investment Currency</p>
              <p class="text-sm font-bold text-zinc-800">Tether (USDT)</p>
              <p class="self-start mt-4 text-sm font-medium text-gray-400 whitespace-nowrap">Interest Type</p>
              <p class="self-start text-sm font-bold whitespace-nowrap text-zinc-800">Fixed in USD</p>
              <p class="self-start mt-4 text-sm font-medium text-gray-400 whitespace-nowrap">Price per Share</p>
              <p class="self-start text-sm font-bold text-zinc-800">US$1</p>
              <p class="mt-4 text-sm font-medium text-gray-400">Buy Back Guarantee (Per Share)</p>
              <p class="text-sm font-bold text-zinc-800">US$1</p>
              <p class="mt-4 text-sm font-medium text-gray-400">Total Projected Interest</p>
              <p class="text-sm font-bold text-zinc-800">100%+</p>
              <p class="mt-4 text-sm font-medium text-gray-400">Total Guaranteed Interest</p>
              <p class="text-sm font-bold text-zinc-800">42%</p>
              <p class="mt-4 text-sm font-medium text-gray-400">Dividends Schedule</p>
              <p class="text-sm font-bold text-zinc-800">Daily in {{ selectedCurrency.value ?? 'USDT' }}</p>
              <p class="self-start mt-4 text-sm font-medium text-gray-400">Dividends Withdrawal</p>
              <p class="self-start text-sm font-bold whitespace-nowrap text-zinc-800">Automatic with $100 min. threshold</p>
              <p class="mt-4 text-sm font-medium text-gray-400">Total Guaranteed Payout</p>
              <p class="text-sm font-bold text-zinc-800">US$14,700</p>
              <button @click="() => {confirmShow = false; payShow = true}" class="f-registration__purchase--confirm-button w-full justify-center items-center px-16 py-5 mt-4 font-bold text-white whitespace-nowrap bg-blue-600 rounded-lg" tabindex="0">Continue</button>
            </div>
          </section>

          <section class="f-registration__purchase-drop-down flex flex-col justify-center p-4 mt-2 w-full font-bold whitespace-nowrap bg-white rounded-lg shadow-sm">
            <header class="f-registration__purchase-title flex gap-2">
              <div class="justify-center items-center px-2 h-6 text-sm text-center text-blue-600 bg-sky-50 aspect-square rounded-full" aria-hidden="true">2</div>
              <h2 class="f-registration__purchase-title-text flex-auto text-black">Sign</h2>
              <NuxtImg src="/img/icons/mono/chevron-bottom.svg" class="w-6 aspect-square" alt="Down arrow icon" />
            </header>
          </section>

          <section class="f-registration__purchase-drop-down flex flex-col justify-center p-4 mt-2 w-full font-bold whitespace-nowrap bg-white rounded-lg shadow-sm cursor-pointer">
            <header @click="payShow = !payShow" class="f-registration__purchase-title flex gap-2">
              <div class="justify-center items-center px-2 h-6 text-sm text-center text-blue-600 bg-sky-50 aspect-square rounded-full" aria-hidden="true">3</div>
              <h2 class="f-registration__purchase-title-text flex-auto text-black">Pay</h2>
              <NuxtImg src="/img/icons/mono/chevron-bottom.svg" :class="['w-6 aspect-square', {'rotate-180': payShow}]" alt="Down arrow icon" />
            </header>

            <div v-if="payShow">
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
                    <a href="#" class="self-center mt-7 text-base font-bold text-blue-600 whitespace-nowrap" tabindex="0">Contact support</a>
                  </footer>
                </div>
              </template>

              <template v-if="currentPayStep === StepsPay.Loading">
                <div class="flex flex-col justify-end items-center px-4 pt-4 pb-8 font-bold  ">
                  <p class="mt-4 text-base text-black">Processing payment, please wait</p>
                  <footer class="mt-9 text-base text-blue-600" tabindex="0" role="button">
                    Having trouble? Contact Support
                  </footer>
                </div>
              </template>
            </div>
          </section>
        </main>
      </template>

      <template v-else-if="currentStep === Steps.Password">
          <div class='f-registration__back' @click='currentStep = Steps.Code'>
              <a-icon class='f-registration__back-icon' width='24' :name='Icon.MonoChevronLeft' />
          </div>
          <h3 class="f-registration__title">Set your password</h3>
          <h5 class="f-registration__subtitle">Please set a secure password for your account.</h5>

          <form class="f-registration__form" @submit.prevent="onSubmitPasswordForm">

              <a-input class="f-registration__password" label="Password" :type="isPasswordType ? 'password' : 'text'"
                  validation-reg-exp-key="password" required :icon="Icon.MonoEye" iconWithAction
                  @icon-click-handler="passwordIconClickHandler" positionIcon="right" :error-text="passwordErrorText"
                  @blur="passwordFieldBlurHandler" @update:is-valid="isPasswordValid = $event"
                  v-model="password"></a-input>


              <div class="f-registration__password_info">
                  Must include a mix of upper case, lower case, numeric and special character.
              </div>
              <a-button class="f-registration__button" :disabled="!isPasswordValid" type="submit"
                  text="Continue"></a-button>
          </form>
      </template>
      <!--    <template v-else-if="currentStep === Steps.Bonus">-->
      <!--      <div class="f-registration__bonus">-->
      <!--        <div class="f-registration__bonus-wrap">-->
      <!--          <img src="/img/bonus.png" alt="bonus" class="f-registration__bonus-wrap-pic" />-->
      <!--          <div class="f-registration__bonus-wrap-title">$50 Welcome and referral bonus!</div>-->
      <!--          <div class="f-registration__bonus-wrap-text">-->
      <!--            You just earned a $50 bonus for signing up! Your bonus can be accessed in your bonus wallet, and can be-->
      <!--            applied to your ETF purchases.-->
      <!--          </div>-->
      <!--          <a-button class="f-registration__bonus-wrap-btn" @click="getBonus" text="Got it!"></a-button>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--    </template>-->
  </div>
  <e-registration-bonus-modal :confirmData="confirmResponse" v-model="isOpenModal" @accept="getBonus" @close="getBonus" />
  <f-terms-modal v-model="isOpenTermsModal" />
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

const { $app } = useNuxtApp()
const router = useRouter()
const route = useRoute()
const token = ref('')
const siteKey = ref(window.location.host === 'bitcoinetf.org' ? '0x4AAAAAAAO0YJKv_riZdNZX' : '1x00000000000000000000AA');
const enum Steps {
  Terms = 'Terms',
  Choice = 'Choice',
  Email = 'Email',
  Code = 'Code',
  Invest = 'Invest',
  Purchase = 'Purchase',
  Password = 'Password',
  Bonus = 'Bonus',
}
const enum StepsPay {
  PayWith = 'PayWith',
  Process = 'Process',
  Loading = 'Loading',
}

const confirmResponse = ref(null)

const currentSignup = ref(SignupMethods.Email);
const currentStep = ref(Steps.Choice);
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

// Invest Step
const investmentAmount = ref();
const investmentAmountModified = computed<string>({
  get: () => investmentAmount.value, 
  set: (newValue) => {
    const originalNumber = newValue.split(",").join("");
    investmentAmount.value = originalNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
},
});

watch(
  () => investmentAmount.value,
  () => {
      console.log(investmentAmount.value);
  },
)

const currencies = ref([
  {
    value: 'USDT',
    icon: "/img/icons/colorful/usdt.svg",
    background: "/img/usdtbg2.png",
    stars: 10,
    
  }, 
  {
    value: 'Bitcoin',
    icon: "/img/icons/colorful/bitcoin.svg",
    background: "/img/bitcoinbg.png",
    stars: 8,
    
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


</script>

<style lang="scss" src="./f-registration-buy.scss" />

