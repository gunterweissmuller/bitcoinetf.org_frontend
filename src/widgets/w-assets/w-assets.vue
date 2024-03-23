<template>
  <div class="w-assets page-max-width--big">
    <w-ticker-assets :asset="asset" />
    <w-chart-fund title="Value" is-main is-total-assets />
    <w-chart-portfolio
      ref="chartPortfolioRef"
      v-if="asset"
      :assets="[asset]"
      :btc-value="$app.store.user.btcValue"
      title="AUM Allocation"
    />
    <w-top-shareholders />
    <w-purchases />
    <w-news />
  </div>
</template>

<script lang="ts" setup>
import WTickerAssets from '~/src/widgets/w-ticker-assets/w-ticker-assets.vue';
import WChartFund from '~/src/widgets/w-chart-fund/w-chart-fund.vue';
import WChartPortfolio from '~/src/widgets/w-chart-portfolio/w-chart-portfolio.vue';
import WTopShareholders from '~/src/widgets/w-top-shareholders/w-top-shareholders.vue';
import WPurchases from '~/src/widgets/w-purchases/w-purchases.vue';
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
    .filter((item) => item?.symbol !== 'VAULT')
    .find((item) => item.symbol === symbol.value.toUpperCase())

  if (asset) {
    return asset;
  }

  // router push to error page

  return false;
});

console.log(asset.value)

</script>

<style lang="scss" src="./w-assets.scss"></style>
