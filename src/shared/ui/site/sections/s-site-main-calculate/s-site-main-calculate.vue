<template>
  <section class="s-site-main-calculate" :data-name="'Buy Bitcoin ETF Shares'">
    <landing-calculation />
  </section>
</template>

<script setup lang="ts">
  import { defineAsyncComponent } from 'vue'

  const LandingCalculation = defineAsyncComponent(
    () => import('~/src/shared/ui/molecules/m-profit-calculator-new/m-profit-calculator-new.vue'),
  )

</script>

<style src="./s-site-main-calculate.scss" lang="scss" />
