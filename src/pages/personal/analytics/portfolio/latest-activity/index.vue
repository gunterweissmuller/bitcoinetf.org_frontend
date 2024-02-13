<template>
  <div class="latest-activity page-max-width--small">
    <w-activity is-page />
  </div>
</template>

<script setup lang="ts">
import WActivity from '~/src/widgets/w-activity/w-activity.vue'
</script>

<style lang="scss">
.latest-activity {
  .w-trades {
    max-width: torem(606);
  }
}
</style>
