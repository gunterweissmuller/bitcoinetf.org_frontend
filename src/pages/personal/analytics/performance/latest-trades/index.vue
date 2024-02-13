<template>
  <div class="latest-trades page-max-width--small">
    <w-trades is-page />
  </div>
</template>

<script setup lang="ts">
import WTrades from '~/src/widgets/w-trades/w-trades.vue'
</script>

<style lang="scss">
.latest-trades {
  .w-trades {
    max-width: torem(606);
  }
}
</style>
