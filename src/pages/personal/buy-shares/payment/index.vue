<template>
  <w-buy-shares-payment />
</template>

<script setup lang="ts">
import WBuySharesPayment from '~/src/widgets/w-buy-shares-payment/w-buy-shares-payment.vue'
import { definePageMeta } from '#imports'

definePageMeta({
  middleware: ['buy-shares-payment'],
})
</script>

<style scoped lang="scss"></style>
