<template>
  <div class="w-portfolio page-max-width--small">
    <w-chart-fund title="AUM Growth" is-main is-total-assets aum-size-usd />
    <w-chart-portfolio
      ref="chartPortfolioRef"
      v-if="assets?.length"
      :assets="assets"
      :btc-value="$app.store.user.btcValue"
      title="AUM Allocation"
    />
    <w-news />

    <!-- <w-onboarding :steps="renderedSteps" next-route-name="personal-protection" /> -->
  </div>
</template>

<script setup lang="ts">
import WChartFund from '~/src/widgets/w-chart-fund/w-chart-fund.vue';
import WNews from '~/src/widgets/w-news/w-news.vue'
import WChartPortfolio from '~/src/widgets/w-chart-portfolio/w-chart-portfolio.vue'
import { useNuxtApp } from '#app'
import { Centrifuge } from 'centrifuge'
import { onUnmounted } from 'vue'
import WOnboarding from '~/src/widgets/w-onboarding/w-onboarding.vue'

const { $app } = useNuxtApp()

const centrifuge = ref(null)
const chartPortfolioRef = ref(null)

const assets = computed(() => {
  return $app.store.assets.items.filter((item) => item?.symbol !== 'VAULT')
})

// Onboarding
const { width } = useWindowSize()

const steps = computed(() => {
  return [
    {
      attachTo: { element: width.value < 1024 ? '#personal-portfolio-tab-mobile' : '#personal-portfolio-tab' },
      content: {
        title: 'Portfolio',
        description: "Dive into the composition of the fund's assets.",
      },
      options: {
        overlay: {
          padding: 16,
          borderRadius: 16,
        },
        popper: {
          placement: width.value < 1024 ? 'auto' : 'auto',
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
      attachTo: { element: '#portfolio-chart' },
      content: {
        title: 'Asset Breakdown',
        description: 'Tap the pie chart for specific details on each asset and its value allocation.',
      },
      options: {
        overlay: {
          borderRadius: 16,
        },
        popper: {
          placement: 'bottom',
        },
      },
      on: {
        beforeStep: function (options) {
          // const elem = document.querySelector(options.step.attachTo.element)
          // elem?.classList.add('onboarding-index')

          if (window.innerHeight < 800) {
            const scrollPx = 800 - window.innerHeight
            setTimeout(() => {
              window.scrollTo(0, scrollPx)
            }, 0)
          }
        },
        afterStep: function (options) {
          // const elem = document.querySelector(options.step.attachTo.element)
          // elem?.classList.remove('onboarding-index')
        },
      },
    },
  ]
})

const renderedSteps = computed(() => {
  return steps.value.filter((step) => step.isRender !== false)
})

const config = useRuntimeConfig()
const centrifugeURL = config.public.WS_URL
const centrifugeToken = config.public.WS_TOKEN

onMounted(async () => {
  centrifuge.value = new Centrifuge(centrifugeURL, {
    token: $app.store.auth.websocketToken ? $app.store.auth.websocketToken : centrifugeToken,
  })

  centrifuge.value.connect()

  const sub = centrifuge.value.newSubscription('event_asset')

  sub
    .on('publication', function (ctx) {
      if (assets.value?.length) {
        const updatedAssetIndex = assets.value.findIndex((asset) => asset.uuid === ctx.data.message.uuid)
        if (~updatedAssetIndex) {
          assets.value[updatedAssetIndex].full_balance = ctx.data.message.full_balance
        }
      }
    })
    .subscribe()
})

const onMouseEnterAsset = (symbol) => {
  chartPortfolioRef.value.triggerTooltip(symbol)
}

const onMouseLeaveAsset = () => {
  chartPortfolioRef.value.hideTooltip()
}

onUnmounted(() => {
  centrifuge.value?.disconnect()
})
</script>

<style src="./w-portfolio.scss" lang="scss" />
