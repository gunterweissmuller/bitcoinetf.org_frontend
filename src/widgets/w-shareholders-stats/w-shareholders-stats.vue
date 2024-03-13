<template>
  <div class="w-fund-stats">
    <e-stat
      :title="`$${$app.filters.rounded(globalStatistic?.average_size_usd)}`"
      :subtitle="`${$app.filters.convertValue(globalStatistic?.average_size_btc)}`"
      :popper="averageEtfSizePopper"
      info="Average ETF Size"
    />
    <e-stat
      :title="`${$app.filters.rounded(globalStatistic?.shareholders_count)}`"
      :popper="shareholdersPopper"
      :difference="shareholders_today_count ? `${$app.filters.rounded(globalStatistic?.shareholders_today_count)}` : ''"
      info="Shareholders"
    />
  </div>
</template>

<script setup lang="ts">
import EStat from '~/src/entities/e-stat/e-stat.vue'
import { useNuxtApp } from '#app'
const { $app } = useNuxtApp()

const averageEtfSizePopper = {
  title: 'Average ETF Size',
  text: "Welcome to a quick insight! Here, you'll see the average number of shares typically owned by a BitcoinETF.org shareholder. This gives you a perspective on the average stake of our investors in the fund. Gauge where you stand in comparison!",
}

const shareholdersPopper = {
  title: 'Total Shareholders',
  text: "Curious about our community size? This popup reveals the total number of investors who've entrusted their finances with BitcoinETF.org. Join our growing family and be a part of an informed, forward-thinking investor community!",
}

const globalStatistic = computed(() => {
  return $app.store.user.statistic
})
</script>

<style src="./w-shareholders-stats.scss" lang="scss" />
