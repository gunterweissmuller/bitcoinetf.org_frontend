<template>
  <div class="w-certificate" :class="`w-certificate--${props.type}`">
    <span class="w-certificate__name">
      {{ props.username }}
    </span>
    <span class="w-certificate__count">
      1,000
    </span>
    <span class="w-certificate__title">
      Bitcoin ETF Shares
    </span>
    <p class="w-certificate__desc">
      Dividends Paid in {{ currency }}
    </p>
    <p class="w-certificate__desc">
      Maturity in: {{ props.time }} Days
    </p>
  </div>
</template>

<script lang='ts' setup>
import { computed, PropType } from 'vue';

const props = defineProps({
  type: {
    type: String as PropType<'btc' | 'usdt' | 'init_btc'>,
    required: true,
    default: 'btc'
  },
  username: {
    type: String,
    required: true,
    default: 'User Name'
  },
  time: {
    type: Number,
    required: true,
    default: 1
  }
});

const currency = computed<string>(() => props.type === 'usdt' ? 'USDT' : 'Bitcoin');
</script>

<style lang='scss' src="./w-certificate.scss"></style>
