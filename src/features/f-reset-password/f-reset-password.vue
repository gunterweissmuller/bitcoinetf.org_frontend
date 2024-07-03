<template>
  <div class="f-reset-password">
    <a-icon
      v-if="withBackLink"
      class="f-reset-password__back cursor-pointer"
      width="24"
      height="24"
      :name="Icon.MonoChevronLeft"
      @click="$router.go(-1)"
    />
    <h3 class="f-reset-password__title">Reset your password</h3>
    <template v-if="currentStep === Steps.Email">
      <h5 class="f-reset-password__subtitle">
        Please enter the email associated to this account and we will send you a recovery link.
      </h5>
      <form class="f-reset-password__form w-full" @submit.prevent="onSubmitEmailForm">
        <a-input
          class="f-reset-password__email"
          label="Email"
          validation-reg-exp-key="email"
          required
          :error-text="emailErrorText"
          @blur="emailFieldBlurHandler"
          @update:is-valid="isEmailValid = $event"
          v-model="email"
        />
        <vue-turnstile
          :theme="$app.store.user.theme === 'dark' ? 'dark' : 'light'"
          :site-key="siteKey"
          v-model="token"
          class="captchaTurn"
        />

        <p class="f-reset-password__error" v-if="backendError">{{ backendError }}</p>
        <a-button
          class="f-reset__button"
          :text="isSuccessEmailSend ? sentText : 'Continue'"
          type="submit"
          :disabled="emailButtonDisabled || isSuccessEmailSend"
        />
        <!--        <p v-if="sentText" style="margin-top: 20px">{{ sentText }}</p>-->
      </form>
    </template>
    <template v-else-if="currentStep === Steps.Password">
      <h5 class="f-reset-password__subtitle">Please set a secure password for your account.</h5>
      <form class="f-reset-password__form" @submit.prevent="onSubmitPasswordForm">
        <a-input
          class="f-reset-password__password"
          label="New password"
          v-model="password"
          type="password"
          passwordEye
          validation-reg-exp-key="password"
          :error-text="passwordErrorText"
          @blur="passwordFieldBlurHandler"
          @update:is-valid="isPasswordValid = $event"
          required
        ></a-input>
        <a-button class="f-reset-password__button" :disabled="!isPasswordValid" text="Continue" type="submit">
        </a-button>
      </form>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useNuxtApp, useRouter, useRoute } from '#app'
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
import AInput from '~/src/shared/ui/atoms/a-input/a-input.vue'
import { Icon } from '~/src/shared/constants/icons'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import VueTurnstile from 'vue-turnstile'
import { ref } from 'vue'

const { $app } = useNuxtApp()
const router = useRouter()
const route = useRoute()
const token = ref('')
const siteKey = ref(window.location.host === 'bitcoinetf.org' ? '0x4AAAAAAAO0YJKv_riZdNZX' : '1x00000000000000000000AA')
const props = withDefaults(
  defineProps<{
    withBackLink: boolean
  }>(),
  {
    withBackLink: true,
  },
)

const enum Steps {
  Email = 'Email',
  Password = 'Password',
}

const currentStep = ref(Steps.Email)
const backendError = ref('')
const recoveryCode = ref(null)
const sentText = ref('')

// // Email Step
// Email Field
const email = ref('')
const emailErrorText = ref('')
const isEmailValid = ref(false)
const isSuccessEmailSend = ref(false)

watch(
  () => isEmailValid.value,
  () => {
    if (isEmailValid.value) {
      emailErrorText.value = ''
    }
  },
)

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
const emailButtonDisabled = computed<boolean>(() => {
  return !isEmailValid.value || !Boolean(token.value)
})
const name = ref('')

const onSubmitEmailForm = async () => {
  isSuccessEmailSend.value = true
  await $app.api.eth.auth
    .recoveryInit({
      email: $app.filters.trimSpaceIntoString(email.value),
    })
    .then(() => {
      sentText.value = 'We have sent a recovery link to your email'
    })
    .catch((e) => {
      isSuccessEmailSend.value = false
      if (e?.errors?.error?.message) {
        backendError.value = e.errors.error.message
      } else {
        backendError.value = 'Something went wrong'
      }
    })
}

const checkRecoveryCode = async () => {
  await $app.api.eth.auth
    .recoveryCheck({
      code: $app.filters.trimSpaceIntoString(recoveryCode.value),
    })
    .then(() => {
      currentStep.value = Steps.Password
    })
    .catch((e) => {
      if (e?.errors?.error?.message) {
        backendError.value = e.errors.error.message
      } else {
        backendError.value = 'Something went wrong'
      }
    })
}

// // Password Step
// Password Field
const password = ref('')
const passwordErrorText = ref('')
const isPasswordValid = ref(false)

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

const onSubmitPasswordForm = async () => {
  await $app.api.eth.auth
    .recoveryConfirm({
      code: $app.filters.trimSpaceIntoString(recoveryCode.value),
      password: $app.filters.trimSpaceIntoString(password.value),
    })
    .then(() => {
      router.push('/personal/login')
    })
    .catch((e) => {
      if (e?.errors?.error?.message) {
        backendError.value = e.errors.error.message
      } else {
        backendError.value = 'Something went wrong'
      }
    })
}

watch(email, (v) => {
  email.value = v.toLowerCase()
})

onMounted(async () => {
  if (route.query?.code) {
    recoveryCode.value = route.query.code
    // mb delete query code
    await checkRecoveryCode()
  } else {
    recoveryCode.value = null
  }
})

onUnmounted(async () => {
  if (route.query?.code) {
    recoveryCode.value = route.query.code
    await checkRecoveryCode()
  } else {
    recoveryCode.value = null
  }
})
</script>

<style lang="scss" src="./f-reset-password.scss" />
