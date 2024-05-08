<template>
  <div class="w-assets page-max-width--big" v-if="route.params.symbol !== undefined">
    <m-slider
      class="w-assets__info"
      id="w-assets__info-slider"
      loop
      :speed="30000"
      :space-between="0"
      slides-per-view="auto"
      :mousewheel="false"
      :looped-slides="0"
      :autoplay="{
        delay: 0,
        disableOnInteraction: false,
      }"
      :modules="[Autoplay]"
      :allowTouchMove="false"
      disableOnInteraction
    >
      <template #slides>
        <swiper-slide class="w-header__item-row" v-for="index  in 3" :key="index">
        <div class='w-header__item' v-for='(item, id) in filteredMarqueList' :key='id'>
            <div class='w-header__item-title'>{{ item.text }}</div>
            <div class='w-header__item-text' v-html="item.modifyValue"></div>
        </div>
        </swiper-slide>
      </template>

    </m-slider>
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
      />
    </div>
    <w-trades :filters="filters" />
    <w-activity :filters="filters" />
    <w-news />
  </div>
</template>

<script lang="ts" setup>
import { Autoplay } from 'swiper';
import MSlider from '~/src/shared/ui/molecules/m-slider/m-slider.vue';
import { SwiperSlide } from 'swiper/vue';
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

if (route.params.symbol === undefined || route.name === 'personal-assets') {
  if (assets.value) {
    navigateTo({ name: 'personal-assets-symbol', params: { symbol: assets.value[0].symbol.toLowerCase() } })
  } else {
    watch(assets, () => navigateTo({ name: 'personal-assets-symbol', params: { symbol: assets.value[0].symbol.toLowerCase() } }));
  }
}

const symbol = computed<string>(() => {
  return Array.isArray(route.params.symbol) ? route.params.symbol[0] : route.params.symbol;
});

const asset = computed<IAsset | undefined>(() => {
  if (!assets.value) return false;

  return assets.value
    .find((item: { symbol: string; }) => item.symbol === symbol.value?.toUpperCase());
});

console.log(asset.value);


const assetsChartData = computed(() => {
  const unset = {
    symbol: 'OTHERS',
    full_balance: 0
  }
  assets.value
    .forEach((el : { full_balance: string }) => unset.full_balance += Number(el.full_balance))
  return [asset.value, unset];
});

const filters = computed(() => ({ asset_uuid: asset.value?.uuid }));

const btcUsdt = ref(null);

const assetsByKey = computed(() => {
  if (!assets.value) return {}
  return assets.value.reduce((acc : Record<string, IAsset>, item : IAsset) => {
    acc[item?.symbol] = {
      ...item,
    }
    return acc;
  }, {})
});

const shareholdersTotalUsd = computed(() => {
  return $app.store.user.shareholdersTotalUsd;
});

const shareholdersTotalBtc = computed(() => {
  return $app.store.assets.shareholdersTotalBtc;
});

const purchases = computed(() => {
  return $app.store.user.lastPurchases || [];
});

const marqueList = computed(() => [
  {
    text: 'Bitcoin ETF Dividends Paid in 2023',
    value: $app.filters.rounded($app.store.user?.statistic?.dividends_earned_btc * $app.store.user.btcValue, 2),
    modifyValue: `$${$app.filters.rounded($app.store.user?.statistic?.dividends_earned_btc * $app.store.user.btcValue, 2)}`,
  },
  {
    text: 'Total Bitcoin ETF Dividends Paid',
    value: $app.filters.rounded($app.store.user?.statistic?.dividends_earned_btc * $app.store.user.btcValue, 2),
    modifyValue: `$${$app.filters.rounded($app.store.user?.statistic?.dividends_earned_btc * $app.store.user.btcValue, 2)}`,
  },
  {
    text: 'USDT APY',
    value: $app.filters.rounded(assetsByKey.value?.USDT?.apy, 2),
    modifyValue: `${$app.filters.rounded(assetsByKey.value?.USDT?.apy, 2)}%`,
  },
  {
    text: 'BTC AI APY',
    value: $app.filters.rounded(assetsByKey.value?.BAA?.apy, 2),
    modifyValue: `${$app.filters.rounded(assetsByKey.value?.BAA?.apy, 2)}%`,
  },
  {
    text: 'BTC Options APY',
    value: $app.filters.rounded(assetsByKey.value?.BOA?.apy, 2),
    modifyValue: `${$app.filters.rounded(assetsByKey.value?.BOA?.apy, 2)}%`,
  },
  {
    text: 'BTC Futures APY',
    value: $app.filters.rounded(assetsByKey.value?.FBA?.apy, 2),
    modifyValue: `${$app.filters.rounded(assetsByKey.value?.FBA?.apy, 2)}%`,
  },
  {
    text: 'Spot BTC TD APY',
    value: $app.filters.rounded(assetsByKey.value?.SBA?.apy, 2),
    modifyValue: `${$app.filters.rounded(assetsByKey.value?.SBA?.apy, 2)}%`,
  },
  {
    text: 'Latest trade',
    value: $app.store.user.latestTrade || $app.filters.rounded($app.store.user.lastTrades?.find((item : { type: string }) => item.type === 'close')?.result_amount, 2),
    modifyValue: `$${$app.filters.rounded(
      $app.store.user.latestTrade || $app.store.user.lastTrades?.find((item : { type: string }) => item.type === 'close')?.result_amount,
      2,
    )}`,
  },
  {
    text: 'BTC/USDT',
    value: $app.filters.rounded(btcUsdt.value, 2),
    modifyValue: `$${$app.filters.rounded(btcUsdt.value, 2)}`,
  },
  {
    text: 'Bitcoin ETF Share / USDT',
    value: 1,
    modifyValue: 1,
  },
  {
    text: 'High Yield USDT Staking Balance',
    value: $app.filters.rounded(assetsByKey.value?.USDT?.full_balance, 2),
    modifyValue: `$${$app.filters.rounded(assetsByKey.value?.USDT?.full_balance, 2)}`,
  },
  {
    text: 'BTC AI Arbitrage Balance',
    value: $app.filters.rounded(assetsByKey.value?.BAA?.full_balance, 2),
    modifyValue: `$${$app.filters.rounded(assetsByKey.value?.BAA?.full_balance, 2)}`,
  },
  {
    text: 'Bitcoin Reserve Fund Balance',
    value: shareholdersTotalBtc.value,
    modifyValue: `${$app.filters.convertValue($app.filters.rounded(shareholdersTotalBtc.value, 5)) }`,
  },
  {
    text: 'BTC Options TD Balance',
    value: $app.filters.rounded(assetsByKey.value?.BOA?.full_balance, 2),
    modifyValue: `$${$app.filters.rounded(assetsByKey.value?.BOA?.full_balance, 2)}`,
  },
  {
    text: 'BTC Futures TD Balance',
    value: $app.filters.rounded(assetsByKey.value?.BFT?.full_balance, 2),
    modifyValue: `$${$app.filters.rounded(assetsByKey.value?.BFT?.full_balance, 2)}`,
  },
  {
    text: 'BTC Spot TD Balance',
    value: $app.filters.rounded(assetsByKey.value?.BST?.full_balance, 2),
    modifyValue: `$${$app.filters.rounded(assetsByKey.value?.BST?.full_balance, 2)}`,
  },
  {
    text: 'Total AUM',
    value: $app.filters.rounded(shareholdersTotalUsd.value, 2),
    modifyValue: `$${$app.filters.rounded(shareholdersTotalUsd.value, 2)}`,
  },
  {
    text: 'Latest Bitcoin ETF Share Issuance',
    value: $app.filters.rounded(purchases.value?.[0]?.amount, 2),
    modifyValue: `$${$app.filters.rounded(purchases.value?.[0]?.amount, 2)}`,
  },
]);

const filteredMarqueList = computed(() => {
  return marqueList.value.filter((el) => el?.value)
});

onMounted(async () => {
  await useFetch(`https://api3.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT`).then((resp) => {
    btcUsdt.value = resp?.data?.value?.lastPrice;
  });
});
</script>

<style lang="scss" src="./w-assets.scss"></style>
