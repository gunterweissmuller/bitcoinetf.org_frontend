<template>
  <client-only>
    <Vue3Marquee :duration="95" class="w-fund-tablet__info">
      <div class="w-header__item-row" v-for="index in 3" :key="index">
        <div class="w-header__item" v-for="(item, id) in filteredMarqueList" :key="id">
          <div class="w-header__item-title">{{ item.text }}</div>
          <div class="w-header__item-text" v-if="item.modifyValue !== '...'" v-html="item.modifyValue"></div>
          <div class="w-header__item-loading w-header__item-text" v-else></div>
        </div>
      </div>
    </Vue3Marquee>
  </client-only>
</template>

<script lang='ts' setup>
import { computed, ref, onMounted } from 'vue';
import { useNuxtApp } from '#app';
import { IAsset } from '~/src/shared/types/global';

const { $app } = useNuxtApp();

const btcUsdt = ref<null | number>(null);

const assets = computed<IAsset[]>(() => {
  return $app.store.assets.items.filter((item : { symbol: string }) => item?.symbol !== 'VAULT')
});

const fullBalanceFund = computed(() => $app.store.assets.fullBalanceFund);

const purchases = computed(() => {
  return $app.store.user.lastPurchases || [];
});

const assetsByKey = computed<Record<string, IAsset>>(() => {
  if (!assets.value) return {};
  return assets.value.reduce((acc : Record<string, IAsset>, item : IAsset) => {
    acc[item?.symbol] = {
      ...item,
    }
    return acc;
  }, {});
});

const latestTrade = computed(() => $app.store.user.latestTrade);

const marqueList = computed<Record<string, number | string>[]>(() => [
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
    text: 'Spot BTC TD APY',
    value: $app.filters.rounded(assetsByKey.value?.BST?.apy, 2),
    modifyValue: `${$app.filters.rounded(assetsByKey.value?.BST?.apy, 2)}%`,
  },
  {
    text: 'Latest trade',
    value: latestTrade.value || '...',
    modifyValue: `${ latestTrade.value ? `$` : '...' }${ latestTrade.value ? $app.filters.rounded(latestTrade.value, 2) : '' }`,
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
    value: $app.filters.rounded(assetsByKey.value?.BRF?.incoming_amount_btc * (btcUsdt.value ?? 1), 2),
    modifyValue: `$${$app.filters.rounded(assetsByKey.value?.BRF?.incoming_amount_btc * (btcUsdt.value ?? 1), 2)}`,
  },
  {
    text: 'BTC Options TD Balance',
    value: $app.filters.rounded(assetsByKey.value?.BOT?.full_balance, 2),
    modifyValue: `$${$app.filters.rounded(assetsByKey.value?.BOT?.full_balance, 2)}`,
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
    value: $app.filters.rounded(fullBalanceFund.value, 2),
    modifyValue: `$${$app.filters.rounded(fullBalanceFund.value, 2)}`,
  },
  {
    text: 'Latest Bitcoin ETF Share Issuance',
    value: $app.filters.rounded(purchases.value?.[0]?.amount, 2),
    modifyValue: `${$app.filters.rounded(purchases.value?.[0]?.amount, 2)}`,
  },
]);

const filteredMarqueList = computed(() => marqueList.value.filter((el) => el?.value));

onMounted(async () => {
  await useFetch(`https://api3.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT`).then((resp) => {
    btcUsdt.value = resp?.data?._value?.lastPrice;
  });
})
</script>

<style lang='scss' src='./w-stats-marquee.scss'></style>