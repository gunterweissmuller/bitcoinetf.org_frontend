<template>
  <div class="w-fund-tablet page-max-width--small">
    <div class="w-fund-tablet__fund">
      <div class="w-fund-tablet__title">
        Fund
      </div>

      <w-stats-marquee />

      <div class="w-fund-tablet__fund-charts">
        <w-chart-fund class="w-fund-tablet__fund-chart" title="AUM Growth" is-main is-total-assets aum-size-usd />
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
import WStatsMarquee from '~/src/widgets/w-stast-marquee/w-stats-marquee.vue';
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
  return $app.store.assets.items.filter((item : { symbol: string }) => item?.symbol !== 'VAULT')
});

const strategies = [
  {
    name: 'Tether',
    percent: 60,
    icon: Icon.ColorfulUsdt,
    color: '#1BA27A'
  },
  {
    name: 'Bitcoin',
    percent: 40,
    icon: Icon.ColorfulBitcoin,
    color: '#FF8D07'
  },
];
</script>

<style lang='scss' src="./v-fund-tablet.scss"></style>
