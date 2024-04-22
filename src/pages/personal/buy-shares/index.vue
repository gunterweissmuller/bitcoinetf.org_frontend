<template>
  <!-- <w-buy-shares /> -->
  <f-registration-buy />
</template>

<script setup lang="ts">
import WBuyShares from '~/src/widgets/w-buy-shares/w-buy-shares.vue'
import FRegistrationBuy from '~/src/features/f-registration-buy/f-registration-buy.vue'

definePageMeta({
  layout: 'default',
})
</script>
