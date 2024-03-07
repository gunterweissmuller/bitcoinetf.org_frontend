<template>
  <landing-promo/>
  <landing-calculation />
  <s-site-footer/>
</template>

<script setup>
import {definePageMeta} from "#imports";
import SSiteFooter from "~/src/shared/ui/site/sections/s-site-footer/s-site-footer.vue";

definePageMeta({
  layout: 'site-dark',
})
</script>

<style lang="scss">

</style>
