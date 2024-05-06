<template>
  <div class="w-fund-stats">
    <e-stat
      info="AVERAGE ETF SIZE"
      :title="`$${$app.filters.rounded(globalStatistic?.average_size_usd)}`"
      :icon="Icon.MonoMoney"
      iconType="small"
      bottom="none"
    />
    <e-stat
      info="DIVIDENTS PAID"
      :title="`$${$app.filters.rounded($app.store.user?.dividends?.usd_amount)}`"
      :icon="Icon.MonoEarnings"
      iconType="small"
      bottom="dropdown"
    />
    <e-stat
      info="BTC IN RESERVE FUND"
      :title="`$${$app.filters.rounded($app.store.user?.btcValue)}`"
      :icon="Icon.ColorfulBitcoin"
      iconType="full"
      bottom="link"
    />
    <e-stat
      info="USDT PROTECTION VAULT"
      :title="`$${$app.filters.rounded(globalStatistic?.average_size_usd)}`"
      :icon="Icon.ColorfulUsdt"
      iconType="full"
      bottom="link"
    />
    <e-stat
      info="AUM"
      :title="`$${$app.filters.rounded(globalStatistic?.aum_usd)}`"
      :icon="Icon.MonoAnalytics"
      iconType="small"
      bottom="dropdown"
    />
    <e-stat
      info="Corp. Paid-In Share Capital"
      :title="`$${$app.filters.rounded(globalStatistic?.average_size_usd)}`"
      :icon="Icon.MonoMoney"
      iconType="small"
      bottom="none"
    />
  </div>
</template>

<script setup lang="ts">
import EStat from '~/src/entities/e-stat/e-stat.vue';
import { Icon } from '~/src/shared/constants/icons';
import { useNuxtApp } from '#app';

const { $app } = useNuxtApp()
const globalStatistic = computed(() => {
  return $app.store.user.statistic
})

</script>

<style src="./w-shareholders-stats.scss" lang="scss" />
