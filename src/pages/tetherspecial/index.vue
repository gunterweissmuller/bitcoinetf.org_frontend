<template>
  <landing-promo />
  <landing-calculation />
  <s-site-footer />
</template>

<script setup>
import landingPromo from '~/src/shared/ui/promolandings/landing-promo/landing-promo.vue'
import landingCalculation from '~/src/shared/ui/promolandings/landing-calculation/landing-calculation.vue'
import sSiteFooter from '~/src/shared/ui/site/sections/s-site-footer/s-site-footer.vue'

definePageMeta({
  layout: 'site-dark',
})
</script>
