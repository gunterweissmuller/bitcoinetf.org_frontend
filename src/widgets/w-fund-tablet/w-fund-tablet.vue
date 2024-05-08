<template>
  <div class="w-fund-tablet page-max-width--small">
    <div class="w-fund-tablet__fund">
      <div class="w-fund-tablet__title">
        Fund
      </div>
      <m-slider
        class="w-fund-tablet__info"
        id="w-fund-tablet__info-slider"
        loop
        :speed="30000"
        :space-between="0"
        slides-per-view="auto"
        :mousewheel="false"
        :looped-slides="0"
        :modules="[Autoplay]"
        :autoplay="{
          delay: 0,
          disableOnInteraction: false,
        }"
        :allowTouchMove="false"
        disableOnInteraction
      >
        <template #slides>
          <swiper-slide class="w-header__item-row" v-for="index in 3" :key="index">
            <div class="w-header__item" v-for="(item, id) in filteredMarqueList" :key="id">
              <div class="w-header__item-title">{{ item.text }}</div>
              <div class="w-header__item-text" v-html="item.modifyValue"></div>
            </div>
          </swiper-slide>
        </template>
      </m-slider>
      <div class="w-fund-tablet__fund-charts">
        <w-chart-fund class="w-fund-tablet__fund-chart" title="AUM Growth" is-main is-total-assets />
        <w-chart-portfolio
          ref="chartPortfolioRef"
          class="w-fund-tablet__fund-chart"
          v-if="assets?.length"
          :assets="assets"
          :btc-value="$app.store.user.btcValue"
          title="AUM Allocation"
        />
      </div>
    </div>

    <div class="w-fund-tablet__line"></div>

    <div class="w-fund-tablet__protection">
      <div class="w-fund-tablet__title">
        Protection
      </div>
      <div class="w-fund-tablet__wrap">
        <w-shareholders-stats class="w-fund-tablet__item" />
        <w-trades class="w-fund-tablet__item" />
        <w-activity class="w-fund-tablet__item" />
      </div>
    </div>

    <div class="w-fund-tablet__line"></div>

    <div class="w-fund-tablet__shareholders">
      <div class="w-fund-tablet__title">
        Shareholders
      </div>
      <div class="w-fund-tablet__shareholders-charts">
        <w-chart-fund title="Shareholder Growth" type="shareholders" is-main is-total-assets />
        <w-chart-shareholders
          title="Investment Strategies"
          is-desktop
          :strategies="strategies"
        />
      </div>
      <div class="w-fund-tablet__wrap">
        <w-top-shareholders class="w-fund-tablet__item" />
        <w-purchases class="w-fund-tablet__item" />
      </div>
    </div>

    <div class="w-fund-tablet__line"></div>

    <w-news />
  </div>
</template>

<script lang='ts' setup>
import { Autoplay, Parallax } from 'swiper';
import MSlider from '~/src/shared/ui/molecules/m-slider/m-slider.vue';
import { SwiperSlide } from 'swiper/vue';
import WChartFund from '~/src/widgets/w-chart-fund/w-chart-fund.vue';
import WChartPortfolio from '~/src/widgets/w-chart-portfolio/w-chart-portfolio.vue';
import WShareholdersStats from '~/src/widgets/w-shareholders-stats/w-shareholders-stats.vue';
import WTrades from '~/src/widgets/w-trades/w-trades.vue';
import WActivity from '~/src/widgets/w-activity/w-activity.vue';
import WChartShareholders from '~/src/widgets/w-chart-shareholders/w-chart-shareholders.vue';
import WTopShareholders from '~/src/widgets/w-top-shareholders/w-top-shareholders.vue';
import WPurchases from '~/src/widgets/w-purchases/w-purchases.vue';
import WNews from '~/src/widgets/w-news/w-news.vue';
import { Icon } from '~/src/shared/constants/icons';
import { useNuxtApp } from '#app';

const { $app } = useNuxtApp();

const assets = computed(() => {
  return $app.store.assets.items.filter((item) => item?.symbol !== 'VAULT')
});

const strategies = [
  {
    name: 'Tether',
    percent: 0,
    icon: Icon.ColorfulUsdt,
    color: '#1BA27A'
  },
  {
    name: 'Bitcoin',
    percent: 0,
    icon: Icon.ColorfulBitcoin,
    color: '#FF8D07'
  },
];

const btcUsdt = ref(null);

const assetsByKey = computed(() => {
  if (!assets.value) return {}
  return assets.value.reduce((acc, item) => {
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
    value: $app.store.user.latestTrade || $app.filters.rounded($app.store.user.lastTrades?.find((item) => item.type === 'close')?.result_amount, 2),
    modifyValue: `$${$app.filters.rounded(
      $app.store.user.latestTrade || $app.store.user.lastTrades?.find((item) => item.type === 'close')?.result_amount,
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
    btcUsdt.value = resp?.data?._value?.lastPrice
  })
})
</script>

<style lang='scss' src="./v-fund-tablet.scss"></style>
