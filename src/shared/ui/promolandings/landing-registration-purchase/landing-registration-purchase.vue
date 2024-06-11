<template>
  <w-buy-shares-payment-short-tether
    v-if="isUserAuthenticated"
    :calc-value-original="$app.store.user.investAmoun"
    :calc-value="amountDiscount"
    :is-fiat="isFiatLanding"
  />

  <div class="langing-calculation__chat" v-if="width > 767">
    <iframe src="https://secure.livechatinc.com/licence/16652127/open_chat.cgi"></iframe>
  </div>
  <div class="w-buy-shares-payment__divider">Or</div>
  <div class="langing-calculation__processWith">
    <span>Proceed with</span>
    <nuxt-link to="/tetherspecial" v-if="isFiatLanding">
      <a-icon :name="Icon.ColorfulUsdttron" class="langing-calculation__processWith--tron"/>
    </nuxt-link>
    <nuxt-link to="/weloverussia" v-if="!isFiatLanding">
      <NuxtImg src="/img/icons/colorful/visawhite.svg" class="w-[64px]" />
      <NuxtImg src="/img/icons/colorful/mastercard.svg" class="w-[64px]" />
    </nuxt-link>
  </div>
</template>

<script setup lang="ts">
  import {useNuxtApp, useRouter, useRoute} from "#app";
  import { useWindowSize } from '@vueuse/core'
  import {Icon} from "~/src/shared/constants/icons";
  import WBuySharesPaymentShortTether from "~/src/widgets/w-buy-shares-payment-short-tether/w-buy-shares-payment-short-tether.vue";
  import { useRegistration } from "../landing-registration/useRegistration";
  
  const { $app } = useNuxtApp()
  const {isUserAuthenticated, amountDiscount} = useRegistration($app);
  const { width } = useWindowSize()
  const props = withDefaults(
    defineProps<{
      isFiatLanding: boolean
    }>(),
    {
      isFiatLanding: false,
    },
  )
</script>

<!-- todo split -->
<!-- <style lang="scss" src="./landing-calculation.scss" /> -->
  