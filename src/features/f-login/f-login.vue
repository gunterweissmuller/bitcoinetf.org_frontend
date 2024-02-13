<template>
  <div class="f-login">
    <div class='f-login__back' @click='$router.back()'>
      <a-icon class='f-login__back-icon' width='24' :name='Icon.MonoChevronLeft'/>
    </div>
    <h3 id="test_1" class="f-login__title">Log in</h3>
    <h5 class="f-login__subtitle">
      Please enter your email and password to get started. No account?
      <nuxt-link to="/personal/registration">Create an account here.</nuxt-link>
    </h5>
    <form class="f-login__form" @submit.prevent="onSubmitEmailForm">
      <div id="test_2">
        <a-input
          class="f-login__email"
          label="Email"
          validation-reg-exp-key="email"
          required
          :error-text="emailErrorText"
          @blur="emailFieldBlurHandler"
          @update:is-valid="isEmailValid = $event"
          v-model="email"
        />
      </div>

      <a-input
        id="test_3"
        class="f-login__password"
        v-model="password"
        label="Password"
        type="password"
        @blur="passwordFieldBlurHandler"
        @update:is-valid="isPasswordValid = $event"
        required
      ></a-input>
      <div id="test_4" class="f-login__forgot">
        <span class="f-login__forgot-text" @click="onForgotPasswordClick">Forgot your password?</span>
      </div>
      <a-button
        id="test_5"
        class="f-login__button"
        text="Log in"
        :disabled="!isEmailValid || !password"
        type="submit"
      ></a-button>
      <p v-if="backendError" class="f-login__error">{{ $app.filters.capitalize(backendError) }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import {useNuxtApp, useRouter} from '#app'
import AInput from '~/src/shared/ui/atoms/a-input/a-input.vue'
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
import { Icon } from '~/src/shared/constants/icons'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'

const {$app} = useNuxtApp()
const router = useRouter()

const backendError = ref('')

// Email Field
const email = ref(process.dev ? 'emard.roselyn11136@yahoo.com' : '')
const emailErrorText = ref('')
const isEmailValid = ref(false)

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

// Password Field
const password = ref(process.dev ? 'k3kLXI0AEykmcJFc3dV44fSNDA6-jjvtiWDWPuT0n7DjzqmYPIm' : '')
const passwordErrorText = ref('')
const isPasswordValid = ref(false)

function passwordFieldBlurHandler() {
  if (isPasswordValid.value) {
    passwordErrorText.value = ''
    return
  }

  passwordErrorText.value = 'Required'
}

const onSubmitEmailForm = () => {
  $app.api.eth.auth
    .login({email: $app.filters.trimSpaceIntoString(email.value), password: $app.filters.trimSpaceIntoString(password.value)})
    .then((jwtResponse: any) => {
      $app.store.auth.setTokens(jwtResponse.data)
    })
    .then(async () => {
      await $app.api.eth.auth.getUser().then((resp) => {
        $app.store.user.info = resp?.data
      })
      await $app.api.info.blockchainProxy.getUserBlockchainWallet().then((resp) => {
        $app.store.user.blockchainUserWallet = resp?.data.uid
      })
      await $app.store.auth.reInitData()
      await router.push('/personal/analytics/performance')
    })
    .catch((e) => {
      if (e?.errors?.error?.message) {
        backendError.value = e.errors.error.message
      } else {
        backendError.value = 'Something went wrong'
      }
    })
}

const onForgotPasswordClick = () => {
  router.push('/personal/reset')
}
</script>

<style lang="scss" src="./f-login.scss"/>
