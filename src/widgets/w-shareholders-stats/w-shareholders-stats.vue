<template>
  <div class="w-fund-stats">
    <e-stat
      :title="`$${$app.filters.rounded(globalStatistic?.average_size_usd)}`"
      :subtitle="`${$app.filters.convertValue(globalStatistic?.average_size_btc)}`"
      info="Average ETF Size"
    />
    <e-stat
      :title="`${$app.filters.rounded(globalStatistic?.shareholders_count)}`"
      :difference="`${$app.filters.rounded(globalStatistic?.shareholders_today_count)}`"
      info="Shareholders"
    />
  </div>
</template>

<script setup lang="ts">
import EStat from '~/src/entities/e-stat/e-stat.vue'
import { useNuxtApp } from '#app'
const { $app } = useNuxtApp()

const globalStatistic = computed(() => {
  return $app.store.user.statistic
})
</script>

<style src="./w-shareholders-stats.scss" lang="scss" />
