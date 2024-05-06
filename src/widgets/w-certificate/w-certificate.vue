<template>
  <div v-show="props.type !== 'init_btc'" class="w-certificate" :class="`w-certificate--${props.type}`">
    <span class="w-certificate__name">
      {{ props.username }}
    </span>
    <span class="w-certificate__count">
      {{ formatter.format(props.shares) }}
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
    default: 'init_btc'
  },
  username: {
    type: String,
    required: true,
  },
  shares: {
    type: Number,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  }
});

const formatter = new Intl.NumberFormat('en-US');

const currency = computed<string>(() => props.type === 'usdt' ? 'USDT' : 'Bitcoin');
</script>

<style lang='scss' src="./w-certificate.scss"></style>
