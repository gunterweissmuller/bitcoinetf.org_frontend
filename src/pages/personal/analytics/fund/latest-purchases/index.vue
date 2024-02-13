<template>
  <div class="latest-purchases page-max-width--big">
    <w-purchases is-page />
  </div>
</template>

<script setup lang="ts">
import WPurchases from '~/src/widgets/w-purchases/w-purchases.vue'
</script>

<style lang="scss">
.latest-purchases {
  .w-trades {
    max-width: torem(606);
  }
}
</style>
