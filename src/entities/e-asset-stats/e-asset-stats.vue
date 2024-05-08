<template>
  <div :class="['e-asset-stats', {'e-asset-stats--brf': data?.symbol === 'BRF'}]" v-if="statistic">
    <e-stat
      v-if="earnignsText"
      :title="earnignsText"
      info="Value"
      :subtitle="earnignsTextSub"
      :popper="valuePopper"
    />
    <div v-if="data?.symbol !== 'BRF'" class="e-asset-stats-group">
      <e-stat
        v-if="statistic.projected_apy"
        :title="`${$app.filters.rounded(statistic.projected_apy, 2)}%`"
        info="Projected APY"
        :popper="projectedApyPopper"
        fixed-header
      />
      <e-stat v-if="statistic.assetActualApy" :title="$app.filters.rounded(statistic.assetActualApy, 2)+'%'" info="Actual APY" :popper="actualApyPopper" fixed-header />
    </div>
    <e-stat
      v-if="data?.symbol !== 'BRF'"
      :title="`${allocation}%`"
      info="Allocation"
      :popper="allocationApyPopper"
    />
    <e-stat
      v-if="data?.symbol === 'BRF'"
      :title="'$' + $app.filters.rounded($app.store.user.statistic?.dividends_earned_btc * $app.store.user.btcValue, 2)"
      :subtitle="$app.filters.convertValue($app.filters.rounded($app.store.user.statistic?.dividends_earned_btc, 8))"
      :popper="earningsApyPopper"
      info="Dividends"
    />
    <e-stat
      v-else
      :title="'$' + $app.filters.rounded(data.winning_amount_btc * $app.store.user.btcValue, 2)"
      :subtitle="$app.filters.convertValue($app.filters.rounded(data.winning_amount_btc, 8))"
      :popper="earningsApyPopper"
      info="Dividends"
    />
  </div>
</template>

<script setup lang="ts">
import EStat from '~/src/entities/e-stat/e-stat.vue'
import { useNuxtApp } from '#app'

const { $app } = useNuxtApp()

const props = withDefaults(
  defineProps<{
    statistic: any
    data: any
    btcValue: any
    allocation: any
  }>(),
  {
    data: null,
    statistic: null,
    btcValue: 0,
    allocation: 0,
  },
)

const valuePopper = {
  title: 'Value',
  text: 'Welcome to the "Value" subsection! Here, you can view the amount of money the fund has allocated to this specific asset, both in USD and Bitcoin. For a deeper dive, you can extend the data up to a 5-year period. This offers a clear picture of the fund\'s commitment to this asset over time.',
}

const projectedApyPopper = {
  title: 'Projected APY',
  text: 'Explore the "Projected APY" section! This figure is our educated guess on the potential returns the fund might achieve on this asset. Dividends, based on this projection, are distributed daily to shareholders. Please note: while we strive for accuracy, this projection is for informational purposes only and doesn\'t represent a contractual promise.',
}

const actualApyPopper = {
  title: 'Actual APY',
  text: 'Welcome to the "Actual APY" zone! This displays the real-time returns the fund is achieving and distributing to investors as dividends. Rest assured, the fund always honors its contractually guaranteed promises, ensuring this figure never falls below our set threshold on an annual basis.',
}

const allocationApyPopper = {
  title: 'Allocation',
  text: 'Dive into the "Allocation" section! Understand how pivotal this asset is to the fund by viewing its percentage share in the total assets managed by the fund. This gives insight into the fund\'s strategy and how diversified its holdings are.',
}

const earningsApyPopper = {
  title: 'Dividends',
  text: 'Step into the "Dividends" subsection! Here, you can check out the financial rewards reaped from this asset. Displayed in both USD and Bitcoin, you can select any desired time frame to analyze the asset\'s earnings, offering a comprehensive view of its performance.',
}

const ActualApy = computed(() => {
  return `${$app.filters.rounded(
    ((props.data?.winning_amount_btc || 0) * $app.store.user.btcValue * 100) / props.data?.incoming_amount_usd,
    2,
  )}%`
})

const dividendsPrice = computed(() => {
  return '11';
  return `$${$app.filters.rounded($app.store.user.btcValue * (props.data.winning_amount_btc || 0), 2)}`
})


const earnignsText = computed(() => {
  return '22';
  if (props.data.symbol === 'BRF') {
    return '$' + $app.filters.rounded(props.data?.incoming_amount_btc * $app.store.user.btcValue, 2)
  }

  return `$${$app.filters.rounded(props.data?.full_balance, 2)}`
})

const earnignsTextSub = computed(() => {
  return '33';
  if (props.data.symbol === 'BRF') {
    return $app.filters.convertValue($app.filters.rounded(props.data?.incoming_amount_btc, 8))
  }

  return $app.filters.convertValue($app.filters.rounded(props.data?.full_balance / $app.store.user.btcValue, 8))
})
</script>

<style src="./e-asset-stats.scss" lang="scss" />
