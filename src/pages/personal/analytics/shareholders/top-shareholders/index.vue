<template>
  <div class="latest-purchases page-max-width--big">
    <w-top-shareholders is-page />
  </div>
</template>

<script setup lang="ts">
import WTopShareholders from '~/src/widgets/w-top-shareholders/w-top-shareholders.vue'
</script>

<style lang="scss">
.latest-purchases {
  .w-trades {
    max-width: torem(606);
  }
}
</style>
