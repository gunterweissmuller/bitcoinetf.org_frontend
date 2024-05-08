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
      :title="`$${$app.filters.rounded(dividentsPaid, 2)}`"
      :icon="Icon.MonoEarnings"
      iconType="small"
      bottom="dropdown"
      @get-current-option="(currentOption : ADropdownOption) => handleDropdown(currentOption, 'dividends_earned_btc')"
    />
    <e-stat
      info="BTC IN RESERVE FUND"
      :title="`$${$app.filters.rounded(btcReserve)}`"
      :icon="Icon.ColorfulBitcoin"
      iconType="full"
      bottom="link"
    />
    <e-stat
      info="USDT PROTECTION VAULT"
      :title="`$${$app.filters.rounded(usdtReserve)}`"
      :icon="Icon.ColorfulUsdt"
      iconType="full"
      bottom="link"
    />
    <e-stat
      info="AUM"
      :title="`$${$app.filters.rounded(filteredValues.aum_usd ?? globalStatistic?.aum_usd)}`"
      :icon="Icon.MonoAnalytics"
      iconType="small"
      bottom="none"
    />
    <e-stat
      info="Corp. Paid-In Share Capital"
      :title="`$${$app.filters.rounded(50000000)}`"
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
import { ADropdownOption } from '~/src/shared/types/global';

const { $app } = useNuxtApp();

const globalStatistic = computed(() => $app.store.user?.statistic);

const dividentsPaid = computed<number>(() => (filteredValues.dividends_earned_btc ?? $app.store.user?.statistic?.dividends_earned_btc) * $app.store.user?.btcValue);

const btcReserve = computed(() => $app.store.assets.brf?.full_balance);
const usdtReserve = computed(() => $app.store.assets.usdt?.full_balance);


const filteredValues = reactive<Record<string, number | null>>({
  'dividends_earned_btc': null,
  'aum_usd': null
});

const handleDropdown = (currentOption : ADropdownOption, filter: string) => {
  const filterObj : Record<string, any> = {}
  if (currentOption.value !== 'all') {
    filterObj[filter+'_daily_filter'] = currentOption.value;
  }

  $app.api.eth.statisticEth.getGlobalStats({ filters: filterObj })
    .then(({ data } : Record<string, any>) => {
      filteredValues[filter] = data[filter];
    });
}
</script>

<style src="./w-shareholders-stats.scss" lang="scss" />
