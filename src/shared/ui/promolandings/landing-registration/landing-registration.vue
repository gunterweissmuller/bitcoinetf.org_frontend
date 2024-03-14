<template>
  <div class="landing-registration">
    <div class="landing-registration__title">Please fill out the form to continue</div>
    <div class="landing-registration__subtitle">
      Get started by entering your name and email. If you already have an account, you can <nuxt-link to="/personal/login">log in here.</nuxt-link>
    </div>
    <div class="landing-registration__support" @click="scrollToChat">
      <img src="/img/landginregsupport.png" alt="">
      <span>Need help? Talk to one of our support agents!</span>
      <a-icon :name="Icon.MonoChevronRight" />
    </div>
    <div class="landing-registration__captcha">
      <vue-turnstile :site-key="siteKey" v-model="token" class="captchaTurn"/>
    </div>
    <form class="landing-registration__form" @submit.prevent="onSubmitEmailForm" v-if="token">
      <div class="landing-registration__form-inputfield">
        <a-input v-model="firstName" label="First name" required/>
      </div>
      <div class="landing-registration__form-inputfield">
        <a-input v-model="lastName" label="Last name" required/>
      </div>
      <div class="landing-registration__form-inputfield">
        <a-input
          label="Email"
          validation-reg-exp-key="email"
          required
          :error-text="emailErrorText"
          @blur="emailFieldBlurHandler"
          @update:is-valid="isEmailValid = $event"
          v-model="email"
        />
      </div>
      <div class="landing-registration__form-inputfield">
        <a-button
          :disabled="!isEmailValid"
          type="submit"
          text="Get Confirmation Code"
          is-full-width
          :loading="sendCodeLoading"
          v-if="!codeSended"
        />
        <a-input v-model="confirmCode" label="Email Confirmation Code" required v-if="codeSended"/>
      </div>
      <div class="landing-registration__form-agree">
        <a-checkbox
          v-model="registrationAgreed"
          id="with_email"
          label="<p>I agree to the <span class='link'>Terms & Conditions</a></p>"
          @label-click="openTermsModal"
          single
        />
      </div>
      <div class="landing-registration__form-button">
        <a-button
          :disabled="emailButtonDisabled"
          :text="`$${$app.filters.rounded(calcValueDiscount,1)} BUY`"
          is-full-width
          @click="fastRegistration"
        />
      </div>
      <p class="f-registration__error" v-if="backendError">{{ backendError }}</p>
    </form>
  </div>
  <f-terms-modal v-model="isOpenTermsModal" />
  <e-registration-bonus-modal
    :confirmData="confirmResponse"
    v-model="isOpenModal"
    @close="closeModal"
  />
</template>

<script setup lang="ts">
import AIcon from "~/src/shared/ui/atoms/a-icon/a-icon.vue";
import {Icon} from "~/src/shared/constants/icons";
import AInput from "~/src/shared/ui/atoms/a-input/a-input.vue";
import AButton from "~/src/shared/ui/atoms/a-button/a-button.vue";
import VueTurnstile from "vue-turnstile";
import ACheckbox from "~/src/shared/ui/atoms/a-checkbox/a-checkbox.vue";
import {computed, ref} from "vue";
import {useNuxtApp, useRouter} from "#app";
import FTermsModal from "~/src/features/f-terms-modal/f-terms-modal.vue";
import ERegistrationBonusModal from "~/src/entities/e-registration-bonus-modal/e-registration-bonus-modal.vue";
const { $app } = useNuxtApp()
const router = useRouter()
const props = withDefaults(
  defineProps<{
    calcValue: number
    calcValueDiscount: number
    refCode: string
    isFiat: boolean
  }>(),
  {
    calcValue: 1000,
    calcValueDiscount: 950,
    refCode: '',
    isFiat: false
  },
)
const token = ref('')
const siteKey = ref(window.location.host === 'bitcoinetf.org' ? '0x4AAAAAAAO0YJKv_riZdNZX' : '1x00000000000000000000AA');
const backendError = ref('')

const firstName = ref('')
const lastName = ref('')

// Email Field
const email = ref('')
const confirmCode = ref('')
const emailErrorText = ref('')
const isEmailValid = ref(false)
const registrationAgreed = ref(false)
const isOpenTermsModal = ref(false)
function openTermsModal() {
  isOpenTermsModal.value = true
}
const emailButtonDisabled = computed<boolean>(() => {
  return !isEmailValid.value || !registrationAgreed.value || !firstName.value || !lastName.value || !Boolean(token.value) || !confirmCode.value
})
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
const sendCodeLoading = ref(false)
const codeSended = ref(false)
const onSubmitEmailForm = async () => {
  backendError.value = ''
  sendCodeLoading.value = true

  const initPayload = { first_name: $app.filters.trimSpaceIntoString(firstName.value), last_name: $app.filters.trimSpaceIntoString(lastName.value), email: $app.filters.trimSpaceIntoString(email.value), refcode: $app.filters.trimSpaceIntoString(props.refCode) }

  await $app.api.eth.auth
    .init(initPayload).then(()=>{
      sendCodeLoading.value = false
      codeSended.value = true
    })
    .catch((e) => {
      if (e?.errors?.error?.message) {
        if (e.errors.error.code === 'ETF:011002') {
          router.push('/personal/login')
        }
        backendError.value = e.errors.error.message
        sendCodeLoading.value = false
      } else {
        backendError.value = 'Something went wrong'
      }
    })
}
const isOpenModal = ref(false)
const confirmResponse = ref(null)

const closeModal = () =>{
  isOpenModal.value = false
}
const fastRegistration = async () => {
  backendError.value = ''
  await $app.api.eth.auth
    .confirmFast({
      email: $app.filters.trimSpaceIntoString(email.value),
      code: $app.filters.trimSpaceIntoString(confirmCode.value),
    })
    .then((jwtResponse: any) => {
      // TODO falling user/me
      $app.store.auth.setTokens(jwtResponse.data)
      confirmResponse.value = jwtResponse.data
      isOpenModal.value = true
    })
    .then(async () => {
      await $app.api.eth.auth.getUser().then((resp) => {
        $app.store.user.info = resp?.data
      })
      await $app.api.info.blockchainProxy.getUserBlockchainWallet().then((resp) => {
        $app.store.user.blockchainUserWallet = resp?.data.uid
      })
    })
    .then(async () => {

      const aAid = window.localStorage.getItem('PAPVisitorId');
      if(aAid) {
        $app.api.eth.auth.papSignUp({
          payload: {
            pap_id: aAid,
            utm_label: window.localStorage.getItem('a_utm'),
          }}).then((r: any) => {
          //window.localStorage.removeItem('a_aid');
          //window.localStorage.removeItem('a_utm');
        });
      }

      if (props.isFiat) {
        await $app.api.eth.billingEth
          .buyShares({
            amount: 1000,
            dividends: false,
            referral: false,
            bonus: false,
          })
          .then(({ data }) => {
            if (data) {
              router.replace({
                query: { replenishment: data.uuid }
              })
              $app.store.user.buyShares = data
            }
          })
      }
    })
    .catch((e) => {
      if (e?.errors?.error?.message) {
        backendError.value = e.errors.error.message
      } else {
        backendError.value = 'Something went wrong'
      }
    })
}
const scrollToChat = () =>{
  if (window.innerWidth > 767) {
    const element = document.querySelector(".langing-calculation__chat");
    let headerOffset
    if (window.innerWidth < 768) {
      headerOffset = 155;
    } else {
      headerOffset = 155;

    }
    const elementPosition = element.offsetTop;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  } else {
    window?.LiveChatWidget.call('maximize')
  }
}
</script>

<style lang="scss" src="./landing-registration.scss" />
