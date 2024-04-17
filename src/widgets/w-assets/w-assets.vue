<template>
  <div class="w-assets page-max-width--big">
    <w-ticker-assets :asset="asset" />
    <w-chart-fund title="Value" is-main is-total-assets />
    <w-chart-portfolio
      ref="chartPortfolioRef"
      v-if="asset"
      :assets="assetsChartData"
      :btc-value="$app.store.user.btcValue"
      title="AUM Allocation"
      :slider="false"
    />
    <w-trades />
    <w-activity />
    <w-news />
  </div>
</template>

<script lang="ts" setup>
import WTickerAssets from '~/src/widgets/w-ticker-assets/w-ticker-assets.vue';
import WChartFund from '~/src/widgets/w-chart-fund/w-chart-fund.vue';
import WChartPortfolio from '~/src/widgets/w-chart-portfolio/w-chart-portfolio.vue';
import WTrades from '~/src/widgets/w-trades/w-trades.vue';
import WActivity from '~/src/widgets/w-activity/w-activity.vue';
import WNews from '~/src/widgets/w-news/w-news.vue';
import { useRoute, useRouter } from 'vue-router';
import { useNuxtApp } from '#app';

const { $app } = useNuxtApp();
const route = useRoute();
const router = useRouter();

const symbol = computed<string>(() => {
  return Array.isArray(route.params.symbol) ? route.params.symbol[0] : route.params.symbol;
});

const asset = computed(() => {
  const asset = $app.store.assets.items
    .filter((item: { symbol: string; }) => item?.symbol !== 'VAULT')
    .find((item: { symbol: string; }) => item.symbol === symbol.value.toUpperCase());

  if (asset) {
    return asset;
  }

  // router push to error page

  return false;
});

const assetsChartData = computed<Array<Record<string, string>>>(() => {
  // full balance
  const unset = {
    symbol: 'OTHERS',
    full_balance: 0
  }
  $app.store.assets.items
    .filter((el : { symbol: string }) => el.symbol !== asset.value.symbol && el.symbol !== 'VAULT')
    .forEach((el : { full_balance: string }) => unset.full_balance += Number(el.full_balance))
  return [asset.value, unset];
});
// console.log(assetsChartData.value);

</script>

<style lang="scss" src="./w-assets.scss"></style>
