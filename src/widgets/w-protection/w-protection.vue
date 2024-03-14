<template>
  <div class="w-performance page-max-width--small">
    <!-- <w-chart-protection
      ref="chartProtectionRef"
      v-if="assets?.length"
      :assets="assets"
    /> -->
    <!-- <e-assets
      v-if="assets?.length"
      :assets="assets"
      :key="assetsKey"
      :btc-value="$app.store.user.btcValue"
      apy-needed
      right-top-title="Dividends Paid"
      right-top-subtitle="APY (Moving average)"
      @mouse-enter-asset="onMouseEnterAsset"
      @mouse-leave-asset="onMouseLeaveAsset"
      @focus-in-asset="onMouseEnterAsset"
      @focus-out-asset="onMouseLeaveAsset"
    /> -->
    <w-shareholders-stats />
    <w-trades />
    <w-activity />
    <!-- <w-news /> -->

    <w-onboarding :steps="renderedSteps" :next-route-name="nextRouteName" />
  </div>
</template>

<script setup lang="ts">
import WTrades from '~/src/widgets/w-trades/w-trades.vue';
import WShareholdersStats from '~/src/widgets/w-shareholders-stats/w-shareholders-stats.vue';
import WActivity from '~/src/widgets/w-activity/w-activity.vue';
// import EAssets from '~/src/entities/e-assets/e-assets.vue'
// import WNews from '~/src/widgets/w-news/w-news.vue'
// import WChartProtection from '~/src/widgets/w-chart-protection/w-chart-protection.vue'
import { useNuxtApp } from '#app'
import { Centrifuge } from 'centrifuge'
import { onMounted, onUnmounted, ref } from 'vue'
import { useWindowSize } from '@vueuse/core/index'
import WOnboarding from '~/src/widgets/w-onboarding/w-onboarding.vue'

const { $app } = useNuxtApp()

const centrifuge = ref(null)
const chartProtectionRef = ref(null)

const assetsKey = ref(1)

const assets = computed(() => {
  return $app.store.assets?.items?.filter((item) => item?.symbol !== 'VAULT' && item?.symbol !== 'BRF') || []
})

// Onboarding
const { width } = useWindowSize()

const journeySteps = computed(() => {
  return [
    {
      attachTo: { element: width.value < 1024 ? '#menu-personal-performance-bottom' : '#menu-personal-performance' },
      content: { title: 'Analytics', description: "Understand our fund's performance and growth." },
      options: {
        overlay: {
          padding: 10,
          borderRadius: 40,
        },
        popper: {
          placement: width.value < 1024 ? 'top' : 'bottom',
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

const steps = computed(() => {
  return [
    {
      attachTo: { element: '#marquee' },
      content: { title: 'News Ticker', description: 'Stay updated with the latest price quotes and financial data.' },
      options: {
        overlay: {
          padding: { top: 4, right: 0, bottom: 20, left: 0 },
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
      isRender: width.value < 1024,
    },
    {
      attachTo: { element: width.value < 1024 ? '#personal-performance-tab-mobile' : '#personal-performance-tab' },
      content: {
        title: 'Performance',
        description: 'Check out how well the fund is doing. Dive deep into Dividends for each asset.',
      },
      options: {
        overlay: {
          padding: 16,
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
      attachTo: { element: '#performance-chart' },
      content: {
        title: 'Dividends Summary',
        description:
          'Summary: Since 2023, this is what the fund earned and shared with its investors. For details on specific amounts, simply tap a column.',
      },
      options: {
        overlay: {
          padding: 10,
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
      attachTo: { element: '#asset-bst' },
      content: {
        title: 'Assets Overview',
        description:
          'For example, "Spot BTC Auto trade" is a key asset. Discover its contribution to shareholder Dividends. Tap for further insights.',
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
  const journey = localStorage.getItem('journey')

  if (!journey) {
    return journeySteps.value.filter((step) => step.isRender !== false)
  }

  return steps.value.filter((step) => step.isRender !== false)
})

const nextRouteName = computed(() => {
  return localStorage?.getItem('journey') ? 'personal-portfolio' : 'personal-earnings'
})
const config = useRuntimeConfig()
const centrifugeURL = config.public.WS_URL
const centrifugeToken = config.public.WS_TOKEN

onMounted(async () => {
  centrifuge.value = new Centrifuge(centrifugeURL, {
    token: $app.store.auth.websocketToken ? $app.store.auth.websocketToken : centrifugeToken
  })

  centrifuge.value.connect()

  const sub = centrifuge.value.newSubscription('event_asset')

  sub
    .on('publication', function (ctx) {
      if (assets.value?.length) {
        const updatedAssetIndex = assets.value.findIndex((asset) => asset.uuid === ctx.data.message.uuid)
        if (~updatedAssetIndex) {
          assets.value[updatedAssetIndex].full_balance = ctx.data.message.full_balance
          assets.value[updatedAssetIndex].apy = ctx.data.message.apy
        }
      }
    })
    .subscribe()
})

const onMouseEnterAsset = (symbol) => {
  chartProtectionRef.value.triggerTooltip(symbol)
}


const onMouseLeaveAsset = () => {
  chartProtectionRef.value.hideTooltip()
}

onUnmounted(() => {
  centrifuge.value?.disconnect()
})
</script>

<style src="./w-protection.scss" lang="scss" />
