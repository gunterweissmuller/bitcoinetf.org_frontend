<template>
    <landing-promo-new/>
    <landing-calculation-new />
    <s-site-footer/>
  </template>
  
  <script setup>
  import {definePageMeta} from "#imports";
  import SSiteFooter from "~/src/shared/ui/site/sections/s-site-footer/s-site-footer.vue";
  import LandingPromoNew from "~/src/shared/ui/promolandings/landing-promo-new/landing-promo-new.vue";
  import LandingCalculation from "~/src/shared/ui/promolandings/landing-calculation-new/landing-calculation-new.vue";
  
  definePageMeta({
    layout: 'site-dark-launch',
  })
  </script>
  
  <style lang="scss">
  
  </style>
  