<template>
      
    <div class="landing-calculation__signup-main">
      <p class="landing-calculation__signup-main-notification">
        Only Email confirmation is required.
      </p>
      <vue-turnstile :theme="'dark'" :site-key="siteKey" v-model="token" class="captchaTurn" />
      <a-input bgColor="tetherspecial" :disabled="$app.store.tetherspecial.dataDisabled || $app.store.tetherspecial.isMainInputDisabled" v-model="$app.store.tetherspecial.firstName" label="First Name" required class="landing-calculation__signup-main-input landing-calculation__signup-main-input-first-name" />
      <p class="landing-calculation__error" v-if="$app.store.tetherspecial.backendError.value && $app.store.tetherspecial.backendError.field === 'first_name'">{{ $app.store.tetherspecial.backendError.value }}</p>

      <a-input bgColor="tetherspecial" :disabled="$app.store.tetherspecial.dataDisabled || $app.store.tetherspecial.isMainInputDisabled" v-model="$app.store.tetherspecial.lastName" label="Last Name" required class="landing-calculation__signup-main-input landing-calculation__signup-main-input-last-name" />
      <p class="landing-calculation__error" v-if="$app.store.tetherspecial.backendError.value && $app.store.tetherspecial.backendError.field === 'last_name'">{{ $app.store.tetherspecial.backendError.value }}</p>

      <vue-tel-input :disabled="$app.store.tetherspecial.dataDisabled || $app.store.tetherspecial.isMainInputDisabled"  mode='international' v-on:country-changed="countryChanged" v-model="$app.store.tetherspecial.phone" validCharactersOnly autoFormat :inputOptions="{'showDialCode':true, 'placeholder': 'Phone Number', 'required': true}" ></vue-tel-input>
      <p class="landing-calculation__error" v-if="$app.store.tetherspecial.backendError.value && $app.store.tetherspecial.backendError.field === 'phone'">{{ $app.store.tetherspecial.backendError.value }}</p>

      <a-input
        bgColor="tetherspecial"
        class="landing-calculation__signup-main-input landing-calculation__signup-main-input-email"
        label="Email"
        v-model="$app.store.tetherspecial.email"
        validation-reg-exp-key="email"
        :disabled="$app.store.tetherspecial.dataDisabled || $app.store.tetherspecial.isEmailDisabled"
        required
        :error-text="emailErrorText"
        @blur="emailFieldBlurHandler"
        @update:is-valid="isEmailValid = $event"
      />
      <p class="landing-calculation__error" v-if="$app.store.tetherspecial.backendError.value && $app.store.tetherspecial.backendError.field === 'default'">{{ $app.store.tetherspecial.backendError.value }}</p>

      <div class="landing-calculation__signup-main__agree">
          <div class="mb-10">
              <a-checkbox v-model="registrationAgreedUS" id="with_email" label="<p >I declare that I am neither a U.S. citizen nor a resident, nor am I subject to U.S. tax or legal jurisdiction.</p>" single />
          </div>
          <a-checkbox v-model="registrationAgreedTerms" id="with_email1" label="<p>I Agree to the <span class='link'>Terms & Conditions</a></p>" @label-click="openTermsModal" single />
      </div>

      <a-button class="landing-calculation__signup-main__button" :disabled="isDisabled" @click="sendCode" :text="codeSendBuyText"></a-button>
      <div class="landing-calculation__error-message">
        <p v-if="$app.store.user.investAmount < 100">The minimum investment amount must be at least 100</p>
      </div>
    </div>

</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import {useNuxtApp, useRouter, useRoute} from "#app";
  import VueTurnstile from 'vue-turnstile';
  import AInput from '~/src/shared/ui/atoms/a-input/a-input.vue'
  import { useRegistration } from "../landing-registration/useRegistration";
  import 'vue-tel-input/vue-tel-input.css';

  import ACheckbox from '~/src/shared/ui/atoms/a-checkbox/a-checkbox.vue'
  import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'

  const { $app } = useNuxtApp()
  const {emailErrorText, emailFieldBlurHandler, isEmailValid, sendCode, token, siteKey, codeSendBuyText, timerStarted, countryCode, countryChanged, openTermsModal} = useRegistration($app);

  const registrationAgreedUS = ref(false)
  const registrationAgreedTerms = ref(false)

  const isDisabled = computed(() => {
    return !registrationAgreedUS || !registrationAgreedTerms || $app.store.user.investAmount < 100 || timerStarted.value || $app.store.tetherspecial.firstName === '' || $app.store.tetherspecial.lastName === '' || $app.store.tetherspecial.email === '' || $app.store.tetherspecial.phone === '' || !isEmailValid
  })

</script>

<!-- todo split -->
<!-- <style lang="scss" src="./landing-calculation.scss" /> -->
  