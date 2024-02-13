<template>
  <div class="e-stats-protection">
    <div class="e-stats-protection__title">Protection vault</div>
    <div id="e-stat-vault" class="e-stats-protection__wrap">
      <e-stat
        :title="`$${$app.filters.rounded(statistic?.usd_amount || 0, 2)}`"
        :subtitle="$app.filters.convertValue($app.filters.rounded(statistic?.btc_amount || 0, 5))"
        info="Protection vault balance"
        :popper="projectedTotalPopper"
      />
      <e-stat :list="vault" type="list" title="Vault contributions" :info="vault?.length ? '' : 'No deposits yet.'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import EStat from '~/src/entities/e-stat/e-stat.vue'
import { useNuxtApp } from '#app'
import EEmptyData from '~/src/entities/e-empty-data/e-empty-data.vue'

const { $app } = useNuxtApp()

const props = withDefaults(
  defineProps<{
    statistic: any
    vault: any
  }>(),
  {
    statistic: null,
    vault: null,
  },
)

const isEmpty = (n) => {
  return Number(n) === n
}

const projectedTotalPopper = {
  title: 'Protection Vault',
  text: 'Automated Hedging Our advanced trading bot performs hedging operations every time the Bitcoin price drops, making a profit. <br /><br /> Deposits to the Vault Every time our bot makes a profit from these hedging operations, the profit is deposited into the Protection Vault in the form of stablecoins. This ensures that the value of these funds remains stable, regardless of the Bitcoin price volatility.',
}
</script>

<style src="./e-stats-protection.scss" lang="scss"></style>
