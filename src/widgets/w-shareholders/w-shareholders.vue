<template>
  <div class="w-fund page-max-width--small">
    <w-chart-fund title="Shareholder Growth" is-main is-total-assets />
    <w-chart-shareholders
      title="Investment Strategies"
      :strategies="strategies"
    />
    <!-- <w-shareholders-stats /> -->

    <!-- new component diffirent chart -->
    <w-top-shareholders />
    <w-purchases />
    <!-- <w-news /> -->

    <w-onboarding :steps="renderedSteps" :next-route-name="lastPayment ? 'personal-earnings' : 'personal-wallet'" />
  </div>
</template>

<script setup lang="ts">
// import WNews from '~/src/widgets/w-news/w-news.vue'
// import WShareholdersStats from '~/src/widgets/w-shareholders-stats/w-shareholders-stats.vue'
import WTopShareholders from '~/src/widgets/w-top-shareholders/w-top-shareholders.vue'
import WPurchases from '~/src/widgets/w-purchases/w-purchases.vue'
import WChartFund from '~/src/widgets/w-chart-fund/w-chart-fund.vue'
import WOnboarding from '~/src/widgets/w-onboarding/w-onboarding.vue'
import WChartShareholders from '~/src/widgets/w-chart-shareholders/w-chart-shareholders.vue'
import { Icon } from '~/src/shared/constants/icons'

// Onboarding
const { width } = useWindowSize()

const { $app } = useNuxtApp()

const lastPayment = computed(() => {
  return $app.store.user.lastPayment
})

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
]

const steps = computed(() => {
  return [
    {
      attachTo: { element: width.value < 1024 ? '#personal-fund-tab-mobile' : '#personal-fund-tab' },
      content: {
        title: 'Shareholders',
        description: "Witness the shareholders's growth journey.",
      },
      options: {
        overlay: {
          padding: 16,
          borderRadius: 16,
        },
        popper: {
          placement: width.value < 1024 ? 'bottom-start' : 'auto',
        },
      },
      on: {
        beforeStep: async function (options) {
          const elem = document.querySelector(options.step.attachTo.element)
          elem?.classList.add('onboarding-index')
        },
        afterStep: function (options) {
          const elem = document.querySelector(options.step.attachTo.element)
          elem?.classList.remove('onboarding-index')
        },
      },
    },
    {
      attachTo: { element: '#fund-chart' },
      content: {
        title: 'Shareholders Management',
        description: "Here's the total capital under our expert management.",
      },
      options: {
        overlay: {
          borderRadius: 16,
        },
      },
      on: {
        beforeStep: function (options) {
          const elem = document.querySelector(options.step.attachTo.element)
          elem?.classList.add('onboarding-index')

          if (window.innerHeight < 700) {
            const scrollPx = 700 - window.innerHeight
            setTimeout(() => {
              window.scrollTo(0, scrollPx * 2)
            }, 0)
          }
        },
        afterStep: function (options) {
          const elem = document.querySelector(options.step.attachTo.element)
          elem?.classList.remove('onboarding-index')
        },
      },
    },
    {
      attachTo: { element: '#shareholder' },
      content: {
        title: 'Shareholders Insight',
        description: 'See the top 100 shareholders, their ownership, and Dividends.',
      },
      options: {
        overlay: {
          borderRadius: 16,
        },
      },
      on: {
        beforeStep: function (options) {
          const elem = document.querySelector(options.step.attachTo.element)
          elem?.classList.add('onboarding-index')
        },
        afterStep: function (options) {
          const elem = document.querySelector(options.step.attachTo.element)
          elem?.classList.remove('onboarding-index')
        },
      },
    },
    {
      attachTo: { element: '#purchase' },
      content: {
        title: 'Latest Purchases',
        description:
          'Latest share issuance? Tap to view all transaction details. With blockchain verification, we offer unmatched transparency.',
      },
      options: {
        overlay: {
          borderRadius: 16,
        },
      },
      on: {
        beforeStep: function (options) {
          const elem = document.querySelector(options.step.attachTo.element)
          elem?.classList.add('onboarding-index')
        },
        afterStep: function (options) {
          const elem = document.querySelector(options.step.attachTo.element)
          elem?.classList.remove('onboarding-index')
        },
      },
    },
  ]
})

const renderedSteps = computed(() => {
  return steps.value.filter((step) => step.isRender !== false)
})
</script>

<style src="./w-shareholders.scss" lang="scss" />
