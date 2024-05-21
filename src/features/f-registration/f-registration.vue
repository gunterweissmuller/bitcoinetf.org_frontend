<template>

  <div class="f-registration-new">

    <div class="f-registration-new__bg" :class="{'f-registration-new__bg-dark':$app.store.user.theme === 'dark'}">
      <nuxt-img src="/img/signup/login_bg_new.png"></nuxt-img>
    </div>

    <div class="f-registration-new-content f-registration-new-content-left">
      <div class="f-registration-new-content__logo">
        <nuxt-link to="/" class="w-header-dark__logo">
          <a-icon class="w-aside__logo-icon" :name="Icon.ColorfulBtcDarkLogo" width="140" height="24"/>
        </nuxt-link>
      </div>
      <div class="f-registration-new-content__title">
        Passive Income for Smart Investors
      </div>
      <div class="f-registration-new-content__text">
        Bitcoin ETF that pays dividends: 
        choose to earn USDT or BTC
      </div>
      <div class="f-registration-new-content__bg">
        <nuxt-img src="/img/signup/rocket.png"></nuxt-img>
      </div>
    </div>

    <div class="f-registration-new-content f-registration-new-content-right">
      <div class="f-registration-new-content-right-wrapper">
        <div class="f-registration-right w-full">
          <template v-if="$app.store.registration.currentStep === Steps.Choice">
              <f-registration-choice/>
          </template>
          <template v-else-if="$app.store.registration.currentStep === Steps.Email">
            <f-registration-email/>
          </template>
          <template v-else-if="$app.store.registration.currentStep === Steps.Link">
              <f-registration-link/>
          </template>
          <template v-else-if="$app.store.registration.currentStep === Steps.Error">
            <f-registration-error/>
          </template>
          <template v-else-if="$app.store.registration.currentStep === Steps.Success">
            <f-registration-success/>
          </template>
          <template v-else-if="$app.store.registration.currentStep === Steps.Loading">
              <h3 class="f-registration-right__title">Loading...</h3>
          </template>
      </div>
      </div>
    </div>
  </div>
  
  <f-terms-modal v-model="$app.store.registration.isOpenTermsModal" />
</template>

<script setup lang="ts">
  import { useNuxtApp, useRouter, useRoute } from '#app'
  import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
  import { Icon } from '~/src/shared/constants/icons'
  import FTermsModal from '~/src/features/f-terms-modal/f-terms-modal.vue'
  import { Steps } from './steps'
  import fRegistrationChoice from '../f-registration-choice/f-registration-choice.vue'
  import fRegistrationEmail from '../f-registration-email/f-registration-email.vue'
  import fRegistrationLink from '../f-registration-link/f-registration-link.vue'
  import fRegistrationSuccess from '../f-registration-success/f-registration-success.vue'
  import fRegistrationError from '../f-registration-error/f-registration-error.vue'

  const { $app } = useNuxtApp()
  const router = useRouter()
  const route = useRoute()


</script>

<style lang="scss" src="./f-registration.scss" />

