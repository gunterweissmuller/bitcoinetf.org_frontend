<template>
  <div class="f-registration w-full">
      <template v-if="currentStep === Steps.Terms">
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


      </template>
      <template v-else-if="currentStep === Steps.Choice">
          <div class='f-registration__back' @click='currentStep = Steps.Terms'>
              <a-icon class='f-registration__back-icon' width='24' :name='Icon.MonoChevronLeft' />
          </div>
          <h3 class="f-registration__title">Sign up</h3>
          <h5 class="f-registration__subtitle">
              If you already have an account, you can
              <nuxt-link to="/personal/login">log in here.</nuxt-link>
          </h5>

          <div class="flex flex-col items-center pb-12">
              <div @click="choiceToEmail"
                  class="flex justify-center items-center px-16 py-5 mt-8 max-w-full text-base font-bold text-white whitespace-nowrap bg-blue-600 rounded-lg max-w-[410px] w-full max-md:px-5 cursor-pointer">
                  <div class="flex gap-2 items-center">
                      <NuxtImg src="/img/icons/mono/mail-light.svg" width="18" height="14"
                          class="aspect-square w-[18px]" />
                      <div class="grow">Sign up with Email</div>
                  </div>
              </div>



              <div @click="handleMetamaskConnect"
                  class="flex justify-center items-center px-16 py-5 mt-4 max-w-full text-base font-bold whitespace-nowrap bg-white rounded-lg shadow-sm text-zinc-800 max-w-[410px] w-full max-md:px-5 cursor-pointer">
                  <div class="flex gap-2 items-center">
                      <NuxtImg src="/img/icons/colorful/metamask.svg" width="18" height="18"
                          class="aspect-square w-[18px]" />
                      <div v-if="isMetamaskSupported" class="grow">Sign up with Metamask</div>
                      <div v-else class="grow">Install Metamask Extension</div>
                  </div>
              </div>

              <div @click="handleGoogleConnect"
                  class="flex justify-center items-center px-16 py-5 mt-4 max-w-full text-base font-bold whitespace-nowrap bg-white rounded-lg shadow-sm text-zinc-800 max-w-[410px] w-full max-md:px-5 cursor-pointer">
                  <div class="flex gap-2 items-center">
                      <NuxtImg src="/img/icons/colorful/google.svg" width="18" height="18"
                          class="aspect-square w-[18px]" />
                      <div class="grow">Sign up with Google</div>
                  </div>
              </div>

              <div
                  class="flex justify-center items-center px-16 py-5 mt-4 max-w-full text-base font-bold whitespace-nowrap bg-white rounded-lg shadow-sm text-zinc-800 max-w-[410px] w-full max-md:px-5">
                  <div class="flex gap-2 items-center">
                      <NuxtImg src="/img/icons/mono/apple.svg" width="18" height="18"
                          class="aspect-square w-[18px]" />
                      <div class="grow">Sign up with Apple</div>
                  </div>
              </div>

              <div
                  class="flex justify-center items-center px-16 py-5 mt-4 max-w-full text-base font-bold whitespace-nowrap bg-white rounded-lg shadow-sm text-zinc-800 max-w-[410px] w-full max-md:px-5">
                  <div class="flex gap-2 items-center">
                      <NuxtImg src="/img/icons/colorful/facebook-circle.svg" width="18" height="18"
                          class="aspect-square w-[18px]" />
                      <div class="grow">Sign up with Facebook</div>
                  </div>
              </div>

              <div
                  class="flex justify-center items-center px-16 py-5 mt-4 max-w-full text-base font-bold whitespace-nowrap bg-white rounded-lg shadow-sm text-zinc-800 max-w-[410px] w-full max-md:px-5">
                  <div class="flex gap-2 items-center">
                      <NuxtImg src="/img/icons/colorful/walletConnect.svg" width="18" height="18"
                          class="aspect-square w-[18px]" />
                      <div class="grow">Sign up with WalletConnect</div>
                  </div>
              </div>

              <div
                  class="flex justify-center items-center px-16 py-5 mt-4 max-w-full text-base font-bold whitespace-nowrap bg-white rounded-lg shadow-sm text-zinc-800 max-w-[410px] w-full max-md:px-5">
                  <div class="flex gap-2 items-center">
                      <NuxtImg src="/img/icons/colorful/whatsApp.svg" width="18" height="18"
                          class="aspect-square w-[18px]" />
                      <div class="grow">Sign up with WhatsApp</div>
                  </div>
              </div>

              <div
                  class="flex justify-center items-center px-16 py-5 mt-4 max-w-full text-base font-bold whitespace-nowrap bg-white rounded-lg shadow-sm text-zinc-800 max-w-[410px] w-full max-md:px-5">
                  <div class="flex gap-2 items-center">
                      <NuxtImg src="/img/icons/colorful/telegram2.svg" width="18" height="18"
                          class="aspect-square w-[18px]" />
                      <div class="grow">Sign up with Telegram</div>
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
          <!-- <h5 class="f-registration__subtitle">
              We will send you a confirmation code shortly. If you already have an account, you can
              <nuxt-link to="/personal/login">log in here.</nuxt-link>
          </h5> -->
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
              <!-- <m-accordion ref="accordionRef" class="f-registration__ref" title="Referral code">
                  <a-input label="Referral code" class="f-registration__ref-code" v-model="refCode" />
                  <a href="/" target="_blank" class="f-registration__ref-link">How to get referral codes</a>
              </m-accordion> -->

              <a-button class="f-registration__button" :disabled="emailButtonDisabled" type="submit"
                  text="Continue"></a-button>

              <p class="f-registration__error" v-if="backendError">{{ backendError }}</p>
          </form>
      </template>

      <!-- <template v-else-if="currentStep === Steps.Code">
          <div class='f-registration__back' @click='currentStep = Steps.Email'>
              <a-icon class='f-registration__back-icon' width='24' :name='Icon.MonoChevronLeft' />
          </div>
          <h3 class="f-registration__title">
              Enter your <br />
              confirmation code
          </h3>
          <h5 class="f-registration__subtitle">Please enter the 6 digit confirmation code we sent to your email.</h5>

          <a-pincode-input class="f-registration__opt" v-model="emailCode" :error-text="pincodeErrorText"
              :autofocus="true" :number-digits="6" name="pincode" @update:completed="onCodeInput" />
          <p v-show="backendError" class="f-registration__error">{{ backendError }}</p>
          <p v-show="timerStarted" class="f-registration__resend-code">
              You can request the code again via {{ timeLeft }} sec.
          </p>
          <a-button :disabled="timerStarted" class="f-registration__button" text="Resend"
              :loading="pincodeTrigger && !isCodeCorrect" variant="tertiary" @click="resendCodeClick" />

          <a-button class="f-registration__button" :disabled="!isCodeCorrect" @click="() => codeContinue()"
              text="Continue"></a-button>
      </template> -->

      <template v-else-if="currentStep === Steps.Code">
          <div class='f-registration__back' @click='currentStep = Steps.Email'>
              <a-icon class='f-registration__back-icon' width='24' :name='Icon.MonoChevronLeft' />
          </div>
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
          
        <div class="flex flex-col justify-end items-start px-4 pt-2 max-w-[375px]">
          <header class="flex gap-4 text-3xl font-medium text-center whitespace-nowrap">
            <h1 class="grow text-zinc-800">I want to invest</h1>

            <div class=" grow flex justify-center text-gray-400 bg-sky-50 rounded">
              <span class="flex items-center px-2">$</span>
              <input v-model.number="investmentAmount" class="max-w-[105px] text-center flex-1 bg-transparent" type="number" placeholder="2,500"/>
            </div>

          </header>
          <p class="mt-3.5 text-3xl font-medium text-center text-zinc-800">and receive my daily</p>
          <div class="flex gap-2 mt-3.5 font-medium text-center whitespace-nowrap text-zinc-800">
            <span class="grow text-3xl">dividends in</span>

            <div class="relative">
              <div class="flex gap-2 font-medium text-center whitespace-nowrap text-zinc-800 rounded">
                <div @click="toggleCurrencyDropdown" class="relative flex items-center justify-center gap-2 py-1.5 pr-6 pl-2.5 text-xl text-gray-400 bg-sky-50 rounded cursor-pointer">
                  <NuxtImg src="/img/icons/colorful/usdt.svg" class="w-6 aspect-square cursor-pointer" alt="USDT logo" />
                  <span>{{ selectedCurrency }}</span>
                  <NuxtImg src="/img/icons/mono/chevron-bottom.svg" class="w-[18px] aspect-square cursor-pointer" alt="Down arrow icon" />
                </div>
              </div>
              <div v-if="showDropdown" class="w-full absolute mt-1 bg-white shadow-lg rounded-lg z-10">
                <ul class="text-sm font-medium text-gray-700">
                  <li v-for="currency in currencies" :key="currency" @click="selectCurrency(currency)" class="px-4 py-2 hover:bg-gray-100 cursor-pointer">{{ currency }}</li>
                </ul>
              </div>
            </div>

            <!-- <div class="flex gap-2 justify-center py-1.5 pr-6 pl-2.5 text-xl bg-sky-50 rounded">
              <NuxtImg src="/img/icons/colorful/usdt.svg" class="self-start w-6 aspect-square" alt="USDT logo" />
              <span>USDT</span>
              <NuxtImg src="/img/icons/mono/chevron-bottom.svg" class="my-auto aspect-square w-[18px]" alt="Down arrow icon" />
            </div> -->

          </div>
          <article class="flex flex-col justify-center self-stretch mt-6 whitespace-nowrap rounded-lg">
            <div class="flex overflow-hidden relative flex-col justify-center p-4 w-full aspect-[1.72] rounded-lg">
              <NuxtImg src="/img/usdtbg2.png" alt="Total Projected Payout backdrop" class="object-cover absolute inset-0 size-full" />
              <p class="relative text-xs font-bold text-white text-opacity-80"> In Total Projected Payout </p>
              <p class="relative mt-1 text-2xl font-black text-white"> $3,457,938.00 </p>
              <p class="relative mt-1 text-xs font-medium text-white text-opacity-80"> Interest + Original Investment Amount + Instant Bonus </p>
              <div class="relative shrink-0 mt-4 h-px bg-white bg-opacity-10"></div>
              <div class="flex relative gap-0 mt-4">
                <div class="flex flex-col flex-1">
                  <p class="text-xs font-medium text-white text-opacity-80"> Daily </p>
                  <p class="text-lg font-black text-white">$24.70</p>
                </div>
                <div class="flex flex-col flex-1">
                  <p class="text-xs font-medium text-white text-opacity-80"> Total Profit </p>
                  <p class="text-lg font-black text-white">100%+</p>
                </div>
                <div class="flex flex-col flex-1">
                  <p class="text-xs font-medium text-white text-opacity-80"> Monthly </p>
                  <p class="text-lg font-black text-white">$24.70</p>
                </div>
              </div>
              <p class="relative mt-4 text-xs font-medium text-white text-opacity-80"> Safety Rating ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐ 10/10 </p>
            </div>
          </article>
          <button @click="currentStep = Steps.Purchase" tabindex="0" class="justify-center items-center self-stretch px-16 py-5 mt-4 text-base font-bold text-white whitespace-nowrap bg-blue-600 rounded-lg"> Continue </button>
        </div>

      </template>

      <template v-else-if="currentStep === Steps.Purchase">

        <main class="flex flex-col mx-auto w-full max-w-[480px]">

          <header class="flex gap-4 self-stretch py-4 pr-4 pl-14 text-lg font-bold text-center whitespace-nowrap text-zinc-800">
            <h1 class="grow">Complete your purchase</h1>
            <NuxtImg src="/img/icons/mono/info.svg" class="w-6 aspect-square" alt="Confirmation icon" />
          </header>

          <section class="flex flex-col justify-end p-4 w-full bg-white rounded-lg shadow-sm">
            <header class="flex gap-2 font-bold whitespace-nowrap">
              <div class="justify-center items-center px-2.5 h-6 text-sm text-center text-blue-600 bg-sky-50 aspect-square rounded-full" aria-hidden="true">1</div>
              <h1 class="flex-auto text-base text-black">Confirm</h1>
              <NuxtImg src="/img/icons/mono/chevron-bottom.svg" class="w-6 aspect-square" alt="Down arrow icon" />
            </header>
            <div>
              <p class="mt-4 text-sm font-medium text-gray-400">Amount of Shares You’re Buying</p>
              <p class="text-sm font-bold text-zinc-800">10,000</p>
              <p class="mt-4 text-sm font-medium text-gray-400">Total Investment Amount</p>
              <div class="flex gap-2 justify-between text-sm font-bold">
                <p class="text-red-600">US$10,000</p>
                <p class="flex-auto text-zinc-800">US$10,500 (-$500 off)</p>
              </div>
              <div class="flex gap-4 justify-between px-4 py-3 mt-4 rounded-lg border-solid bg-neutral-100 border-blue-600">
                <div class="flex flex-col flex-1">
                  <p class="text-xs font-bold text-blue-600">Referral code</p>
                  <p class="text-base text-zinc-800">ABC123</p>
                </div>
                <button class="justify-center px-2 py-1 my-auto text-xs font-bold text-white whitespace-nowrap bg-blue-600 rounded">Apply</button>
              </div>
              <p class="mt-4 text-sm font-medium text-gray-400">Investment Currency</p>
              <p class="text-sm font-bold text-zinc-800">Tether (USDT)</p>
              <p class="self-start mt-4 text-sm font-medium text-gray-400 whitespace-nowrap">Interest Type</p>
              <p class="self-start text-sm font-bold whitespace-nowrap text-zinc-800">Fixed in USD</p>
              <p class="self-start mt-4 text-sm font-medium text-gray-400 whitespace-nowrap">Price per Share</p>
              <p class="self-start text-sm font-bold text-zinc-800">US$1</p>
              <p class="mt-4 text-sm font-medium text-gray-400">Buy Back Guarantee (Per Share)</p>
              <p class="text-sm font-bold text-zinc-800">US$1</p>
              <p class="mt-4 text-sm font-medium text-gray-400">Total Guaranteed Interest</p>
              <p class="text-sm font-bold text-zinc-800">42%</p>
              <p class="mt-4 text-sm font-medium text-gray-400">Dividends Schedule</p>
              <p class="text-sm font-bold text-zinc-800">Daily in USDT</p>
              <p class="self-start mt-4 text-sm font-medium text-gray-400">Dividends Withdrawal</p>
              <p class="self-start text-sm font-bold whitespace-nowrap text-zinc-800">Automatic with $100 min. threshold</p>
              <p class="mt-4 text-sm font-medium text-gray-400">Total Guaranteed Payout</p>
              <p class="text-sm font-bold text-zinc-800">US$14,700</p>
              <button @click="currentStep = Steps.Purchase2" class="justify-center items-center px-16 py-5 mt-4 text-base font-bold text-white whitespace-nowrap bg-blue-600 rounded-lg" tabindex="0">Continue</button>
            </div>
          </section>
          <section class="flex flex-col justify-center p-4 mt-2 w-full font-bold whitespace-nowrap bg-white rounded-lg shadow-sm">
            <header class="flex gap-2">
              <div class="justify-center items-center px-2 h-6 text-sm text-center text-blue-600 bg-sky-50 aspect-square rounded-full" aria-hidden="true">2</div>
              <h2 class="flex-auto text-base text-black">Sign</h2>
              <NuxtImg src="/img/icons/mono/chevron-bottom.svg" class="w-6 aspect-square" alt="Down arrow icon" />
            </header>
          </section>
          <section class="flex flex-col justify-center p-4 mt-2 w-full font-bold whitespace-nowrap bg-white rounded-lg shadow-sm">
            <header class="flex gap-2">
              <div class="justify-center items-center px-2 h-6 text-sm text-center text-blue-600 bg-sky-50 aspect-square rounded-full" aria-hidden="true">3</div>
              <h2 class="flex-auto text-base text-black">Pay</h2>
              <NuxtImg src="/img/icons/mono/chevron-bottom.svg" class="w-6 aspect-square" alt="Down arrow icon" />
            </header>
          </section>
        </main>

      </template>

      <template v-else-if="currentStep === Steps.Purchase2">
        <section class="flex flex-col justify-end p-4 bg-white rounded-lg shadow-sm max-w-[343px]">
          <header class="flex gap-2 font-bold whitespace-nowrap">
            <div class="justify-center items-center px-2 h-6 text-sm text-center text-blue-600 bg-sky-50 aspect-square rounded-full" aria-label="Step 3 of payment process">3</div>
            <h1 class="flex-auto text-base text-black">Pay</h1>
            <NuxtImg src="/img/icons/mono/chevron-bottom.svg" class="w-6 aspect-square" alt="Down arrow icon" />
          </header>
          <div @click="currentStep = Steps.Purchase3" class="flex flex-col justify-center mt-4 text-base bg-gray-100 rounded-lg border border-solid border-gray-200 text-zinc-800">
            <div class="flex flex-col justify-center p-5 w-full bg-white">
              <div class="flex gap-1">
                <NuxtImg src="/img/icons/colorful/usdt-trc20.svg" alt="USDT TRC20 option" class="w-6 aspect-square" />
                <p class="flex-auto">Pay with USDT (TRC20)</p>
                <NuxtImg src="/img/icons/mono/chevron-right.svg" class="my-auto aspect-square w-[18px]" alt="Right arrow icon" />
              </div>
            </div>
          </div>
          <div class="flex flex-col justify-center mt-4 text-base bg-gray-100 rounded-lg border border-solid border-gray-200 text-zinc-800">
            <div class="flex flex-col justify-center p-5 w-full bg-white">
              <div class="flex gap-1">
                <NuxtImg src="/img/icons/colorful/usdt-trc20.svg" alt="USDT TRC20 option" class="w-6 aspect-square" />
                <p class="flex-auto">Pay with USDT (BEP-20)</p>
                <NuxtImg src="/img/icons/mono/chevron-right.svg" class="my-auto aspect-square w-[18px]" alt="Right arrow icon" />
              </div>
            </div>
          </div>
          <div class="flex flex-col justify-center mt-4 text-base bg-gray-100 rounded-lg border border-solid border-gray-200 text-zinc-800">
            <div class="flex flex-col justify-center p-5 w-full bg-white">
              <div class="flex gap-1">
                <NuxtImg src="/img/icons/colorful/usdt-trc20.svg" alt="USDT TRC20 option" class="w-6 aspect-square" />
                <p class="flex-auto">Pay with USDT (ERC-20)</p>
                <NuxtImg src="/img/icons/mono/chevron-right.svg" class="my-auto aspect-square w-[18px]" alt="Right arrow icon" />
              </div>
            </div>
          </div>
          <div class="flex flex-col justify-center mt-4 text-base bg-gray-100 rounded-lg border border-solid border-gray-200 text-zinc-800">
            <div class="flex flex-col justify-center p-5 w-full bg-white">
              <div class="flex gap-1">
                <NuxtImg src="/img/icons/colorful/usdt-trc20.svg" alt="USDT TRC20 option" class="w-6 aspect-square" />
                <p class="flex-auto">Pay with USDT (Liquid)</p>
                <NuxtImg src="/img/icons/mono/chevron-right.svg" class="my-auto aspect-square w-[18px]" alt="Right arrow icon" />
              </div>
            </div>
          </div>
          <div class="flex flex-col justify-center mt-4 text-base bg-gray-100 rounded-lg border border-solid border-gray-200 text-zinc-800">
            <div class="flex flex-col justify-center p-5 w-full bg-white">
              <div class="flex gap-1">
                <NuxtImg src="/img/icons/colorful/metamask.svg" alt="WalletConnect option" class="w-6 aspect-square" />
                <p class="flex-auto">Pay with WalletConnect</p>
                <NuxtImg src="/img/icons/mono/chevron-right.svg" class="my-auto aspect-square w-[18px]" alt="Right arrow icon" />
              </div>
            </div>
          </div>
          <div class="flex flex-col justify-center mt-4 text-base bg-gray-100 rounded-lg border border-solid border-gray-200 text-zinc-800">
            <div class="flex flex-col justify-center p-5 w-full bg-white">
              <div class="flex gap-1">
                <NuxtImg src="/img/icons/colorful/metamask.svg" alt="Metamask option" class="w-6 aspect-square" />
                <p class="flex-auto">Pay with Metamask</p>
                <NuxtImg src="/img/icons/mono/chevron-right.svg" class="my-auto aspect-square w-[18px]" alt="Right arrow icon" />
              </div>
            </div>
          </div>
        </section>
      </template>

      <template v-else-if="currentStep === Steps.Purchase3">
        <section class="flex flex-col justify-end px-4 pt-4 pb-8 bg-white rounded-lg shadow-sm max-w-[343px]">
          <header class="flex gap-2 font-bold whitespace-nowrap">
            <div class="justify-center items-center px-2 h-6 text-sm text-center text-blue-600 bg-sky-50 aspect-square rounded-[300px]">
              3
            </div>
            <h2 class="flex-auto text-base text-black">Pay</h2>
            <NuxtImg src="/img/icons/mono/chevron-bottom.svg" class="w-6 aspect-square" alt="Down arrow icon" />
          </header>
          <div class="flex justify-center items-center self-center px-11 mt-4 w-full bg-white rounded-xl max-w-[261px]">
            <NuxtImg src="/img/qr-code-test.svg" alt="Payment QR Code" class="w-full aspect-[1.01]" />
          </div>
          <article class="flex gap-4 justify-between px-4 py-3 mt-6 rounded-lg bg-neutral-100">
            <NuxtImg src="/img/icons/colorful/usdt-trc20.svg" alt="USDT TRC20 option" class="my-auto w-6 aspect-square" />
            <div class="flex flex-col flex-1 pr-9">
              <p class="text-xs font-bold text-gray-400">Deposit Method:</p>
              <p class="text-base whitespace-nowrap text-zinc-800">Tether USDT (Tron, TRC-20)</p>
            </div>
          </article>
          <article class="flex gap-4 justify-between px-4 py-3.5 mt-6 rounded-lg bg-neutral-100">
            <div class="flex flex-col flex-1 pr-2.5">
              <p class="text-xs font-bold text-gray-400">Deposit address on Tron chain:</p>
              <p class="text-xs font-medium text-zinc-800">TBia4uHnb3oSSZm5isP284cA7Np1v15Vhi</p>
            </div>
            <NuxtImg src="/img/icons/colorful/copy.svg" alt="Copy Address Icon" class="my-auto w-6 aspect-square" />
          </article>
          <article class="flex gap-4 justify-between px-4 py-3 mt-6 rounded-lg bg-neutral-100">
            <div class="flex flex-col flex-1">
              <p class="text-xs font-bold text-gray-400">Amount</p>
              <p class="text-base text-zinc-800">1,002.93 USDT</p>
            </div>
            <NuxtImg src="/img/icons/colorful/copy.svg" alt="Copy Address Icon" class="my-auto w-6 aspect-square" />
          </article>
          <button @click="currentStep = Steps.Purchase4" class="justify-center items-center px-16 py-5 mt-4 text-base font-bold text-white whitespace-nowrap bg-blue-600 rounded-lg" tabindex="0">
            I Have Paid
          </button>
          <button class="justify-center items-center px-16 py-5 mt-2 text-base font-bold text-blue-600 whitespace-nowrap bg-sky-100 rounded-lg" tabindex="0">
            Cancel Order
          </button>
          <footer>
            <a href="#" class="self-center mt-7 text-base font-bold text-blue-600 whitespace-nowrap" tabindex="0">Contact support</a>
          </footer>
        </section>
      </template>

      <template v-else-if="currentStep === Steps.Purchase4">
        <section class="flex flex-col justify-end items-center px-4 pt-4 pb-8 font-bold bg-white rounded-lg shadow-sm max-w-[343px]">
          <header class="flex gap-2 self-stretch">
            <div class="flex justify-center items-center px-2 h-6 text-sm text-center text-blue-600 bg-sky-50 aspect-square rounded-[300px]" tabindex="0" role="button">
              3
            </div>
            <p class="flex-auto text-base text-black">Pay</p>
            <NuxtImg src="/img/icons/mono/chevron-bottom.svg" class="w-6 aspect-square" alt="Down arrow icon" />
          </header>
          <p class="mt-4 text-base text-black">Processing payment, please wait</p>
          <footer class="mt-9 text-base text-blue-600" tabindex="0" role="button">
            Having trouble? Contact Support
          </footer>
        </section>
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
  Purchase2 = 'Purchase2',
  Purchase3 = 'Purchase3',
  Purchase4 = 'Purchase4',
  Password = 'Password',
  Bonus = 'Bonus',
}

const confirmResponse = ref(null)

const currentSignup = ref(SignupMethods.Email);
const currentStep = ref(Steps.Invest)
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
const selectedCurrency = ref('USDT');
const currencies = ref(['USDT', 'BTC', 'ETH']); 
const showDropdown = ref(false);

const toggleCurrencyDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const selectCurrency = (currency : any) => {
  selectedCurrency.value = currency;
  toggleCurrencyDropdown();
}

</script>

<style lang="scss" src="./f-registration-buy.scss" />

