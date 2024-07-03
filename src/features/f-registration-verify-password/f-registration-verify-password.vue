<template>
  <h3 class="f-registration-right__title">Password sent</h3>
  <h5 class="f-registration-right__subtitle">
    We've sent a password to your email address: <span class="underline" v-text="$app.store.registration.email"></span>.
    <br /><br />Please check your inbox and enter the password below to proceed.
  </h5>
  <form class="f-login__form" @submit.prevent="submitRegistrationFields">
    <a-input class="f-login__password" v-model="$app.store.login.password" label="Password" type="password" required />
    <a-button
      class="f-login__button w-full mt-8"
      text="Continue"
      :disabled="!$app.store.login.password || isLoading"
      type="submit"
    />
  </form>

  <a-button
    size="no-padding"
    :disabled="$app.store.registration.timerStarted"
    :text="
      $app.store.registration.timerStarted ? `Resend Email ${$app.store.registration.timeLeft} sec.` : 'Resend Email'
    "
    variant="tertiary"
    @click="resendCodeClick"
  />
</template>

<script setup lang="ts">
import { useNuxtApp } from '#app'
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
import AInput from '~/src/shared/ui/atoms/a-input/a-input.vue'
import { useRegistration } from '../f-registration/useRegistration'

const { $app } = useNuxtApp()
const { resendCodeClick, registerNewUser, stopTimer } = useRegistration($app)

const isLoading = ref(false)
const submitRegistrationFields = async () => {
  try {
    isLoading.value = true
    const payload = {
      email: $app.filters.trimSpaceIntoString($app.store.registration.email) as string,
      password: $app.filters.trimSpaceIntoString($app.store.login.password) as string,
    }
    await registerNewUser(payload)
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
onUnmounted(() => {
  stopTimer()
  $app.store.login.password = ''
})
</script>
