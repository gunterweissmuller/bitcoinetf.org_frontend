<template>
  <div class="w-assets page-max-width--big" v-if="route.params?.symbol !== undefined">
    <w-stats-marquee />
    <div class="w-assets__charts">
      <w-ticker-assets :asset="asset" :active-explorer-link="['USDT', 'BRF'].includes(asset?.symbol)" />
      <w-chart-fund title="Value" type="asset" is-main is-total-assets :asset="asset" v-if="asset" />
      <w-chart-portfolio
        ref="chartPortfolioRef"
        v-if="asset"
        :assets="assetsChartData"
        :btc-value="$app.store.user.btcValue"
        title="AUM Allocation"
        :slider="false"
        type="asset"
      />
    </div>
    <w-trades :filters="filters" is-assets />
    <w-activity :filters="filters" />
    <w-news />
  </div>
</template>

<script lang="ts" setup>
import WStatsMarquee from '~/src/widgets/w-stast-marquee/w-stats-marquee.vue';
import WTickerAssets from '~/src/widgets/w-ticker-assets/w-ticker-assets.vue';
import WChartFund from '~/src/widgets/w-chart-fund/w-chart-fund.vue';
import WChartPortfolio from '~/src/widgets/w-chart-portfolio/w-chart-portfolio.vue';
import WTrades from '~/src/widgets/w-trades/w-trades.vue';
import WActivity from '~/src/widgets/w-activity/w-activity.vue';
import WNews from '~/src/widgets/w-news/w-news.vue';
import { useRoute } from 'vue-router';
import { useNuxtApp } from '#app';
import { IAsset } from '~/src/shared/types/global';

const { $app } = useNuxtApp();
const route = useRoute();


const assets = computed(() => {
  return $app.store.assets.items.filter((item : { symbol: string }) => item?.symbol !== 'VAULT')
});

onMounted(() => {
  if (route.params?.symbol === undefined || route.name === 'personal-assets') {
    if (assets.value.length > 0) {
      navigateTo({ name: 'personal-assets-symbol', params: { symbol: assets.value[0].symbol.toLowerCase() } })
    } else {
      watch(assets, () => {
        navigateTo({ name: 'personal-assets-symbol', params: { symbol: assets.value[0].symbol.toLowerCase() } })
      });
    }
  }
})

const symbol = computed<string>(() => {
  return Array.isArray(route.params?.symbol) ? route.params?.symbol[0] : route.params?.symbol;
});

const asset = computed<IAsset | undefined>(() => {
  if (!assets.value) return false;

  return assets.value
    .find((item: { symbol: string; }) => item.symbol === symbol.value?.toUpperCase());
});

const assetsChartData = computed(() => {
  const unset = {
    symbol: 'OTHERS',
    full_balance: 0
  }
  assets.value
    .filter((item : { symbol: string }) => item.symbol !== symbol.value?.toUpperCase())
    .forEach((item : { full_balance: number }) => unset.full_balance += Number(item.full_balance))
  return [asset.value, unset];
});

const filters = computed(() => ({ asset_uuid: asset.value ? asset.value?.uuid : false }));
</script>

<style lang="scss" src="./w-assets.scss"></style>
