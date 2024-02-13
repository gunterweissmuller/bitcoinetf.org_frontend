<template>
  <div class="latest-purchases page-max-width--big">
    <w-shareholders is-page />
  </div>
</template>

<script setup lang="ts">
import WShareholders from '~/src/widgets/w-shareholders/w-shareholders.vue'
</script>

<style lang="scss">
.latest-purchases {
  .w-trades {
    max-width: torem(606);
  }
}
</style>
