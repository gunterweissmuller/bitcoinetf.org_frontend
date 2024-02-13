<template>
  <div class="e-stats-apy">
    <div class="e-stats-apy__title">Your APY</div>
    <div class="e-stats-apy__box">
      <e-stat
        v-if="isEmpty(apy?.projected_apy)"
        class="e-stats-apy--big"
        :title="`${apy?.projected_apy}%`"
        info="Projected APY"
        :popper="projectedApyPopper"
      />
      <e-empty-data v-else title="You don’t have info about projected APY" />

      <div class="e-stats-apy__wrap">
        <e-stat
          v-if="isEmpty(apy?.actual_apy)"
          :title="`${$app.filters.rounded(apy?.actual_apy,2)}%`"
          info="Actual APY"
          fixed-header
          :popper="actualApyPopper"
        />
        <e-empty-data small v-else title="You don’t have info about actual APY" />

        <e-stat
          v-if="isEmpty(apy?.minimum_apy)"
          :title="`min. ${apy?.minimum_apy}%`"
          info="Guaranteed APY"
          fixed-header
          :popper="guaranteedApyPopper"
        />
        <e-empty-data small v-else title="You don’t have info about guaranteed APY" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import EStat from '~/src/entities/e-stat/e-stat.vue'
import EEmptyData from '~/src/entities/e-empty-data/e-empty-data.vue'

const props = withDefaults(
  defineProps<{
    apy: any
  }>(),
  {
    apy: null,
  },
)

const isEmpty = (n) => {
  return Number(n) === n
}

const projectedApyPopper = {
  title: 'Projected APY',
  text: "The displayed number represents our educated projection of the cumulative APY you could earn throughout your investment duration, grounded in present market trends and insights. We anticipate your earnings to significantly surpass our guaranteed minimums. With a stellar track record since our 2017 inception, we're committed to fulfilling our promises to you.",
}

const actualApyPopper = {
  title: 'Actual APY',
  text: "This reflects the Annual Percentage Yield (APY) you're currently earning. It's calculated based on the most recent daily dividends to our shareholders.",
}

const guaranteedApyPopper = {
  title: 'Guaranteed APY',
  text: "Come rain or shine, this is the minimum APY you'll receive. It's our promise to you, independent of how the market performs. <br /><br />If you had an elevated promotional 19% APY rate, please note, that the guarantee for the elevated APY only extends to the first 6 months of your lockup period. The rest of the period, your APY is guaranteed at the standard 14% rate.",
}
</script>

<style src="./e-stats-apy.scss" lang="scss" />
