<template>
  <landing-promo />
  <landing-calculation />
  <s-site-footer-new />
</template>

<script setup>
import { defineAsyncComponent } from 'vue'

import { definePageMeta } from '#imports'
const SSiteFooterNew = defineAsyncComponent(
  () => import('~/src/shared/ui/site/sections/s-site-footer-new/s-site-footer-new.vue'),
)
const LandingPromo = defineAsyncComponent(
  () => import('~/src/shared/ui/promolandings/landing-promo-new/landing-promo-new.vue'),
)
const LandingCalculation = defineAsyncComponent(
  () => import('~/src/shared/ui/promolandings/landing-calculation-new/landing-calculation-new.vue'),
)

definePageMeta({
  layout: 'site-dark',
})
</script>

<style lang="scss"></style>
