<template>
  <div id="performance-chart" class="w-chart-performance">
    <div v-if="title" class="w-chart-performance__caption">{{ title }}</div>
    <div class="w-chart-performance__head">
      <div class="w-chart-performance__head-title">Total Dividends Paid</div>
      <div class="w-chart-performance__head-subtitle">{{ paymentStatistic }}</div>
    </div>
    <div class="w-chart-performance__info">
      <div class="w-chart-performance__info-title">
        <div class="w-chart-performance__info-title-usd">
          ${{ $app.filters.rounded($app.store.user.statistic?.dividends_earned_btc * $app.store.user.btcValue, 2) }}
        </div>
      </div>
      <div class="w-chart-performance__info-text">
        <div
          class="w-chart-performance__info-text-btc"
          v-html="
            $app.filters.convertValue(
              $app.filters.rounded($app.store.user.statistic?.dividends_earned_btc, 8),
            )
          "
        ></div>
        <div class="w-chart-performance__info-text-info">Since Jan 2023</div>
      </div>
    </div>
    <div class="w-chart-performance__chart">
      <div class="w-chart-performance__chart-ticker">Ticker:</div>
      <canvas :id="CHART_ID"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import Chart from 'chart.js/auto'
import { IAsset } from '~/src/shared/types/global'
import { useNuxtApp } from '#app'
import useMediaDevice from '~/composables/useMediaDevice'
import { computed, nextTick, onMounted, watch } from 'vue'
import { RECEIVED_VARIANTS_STATS } from '~/src/shared/constants/global'

const images = [
  '/img/chart/baa.svg',
  '/img/chart/bft.svg',
  '/img/chart/bot.svg',
  '/img/chart/bst.svg',
  '/img/chart/usdt.svg',
].map((png) => {
  const image = new Image()
  image.src = png
  return image
})

const { $app } = useNuxtApp()
const { isMobile, isTablet } = useMediaDevice()

const fundEarningsBtc = computed(() => {
  return $app.store.user.statistic?.dividends_earned_btc || 0
})


const fundEarningsUsd = computed(() => {
  return $app.store.user.statistic?.dividends_earned_usd || 0
})

let CHART_INSTANCE = null

const props = defineProps<{
  assets?: IAsset[]
  title?: string
}>()
const paymentStatistic = computed(() =>
  fundEarningsUsd.value >
  fundEarningsBtc.value * $app.store.user.btcValue
    ? RECEIVED_VARIANTS_STATS.BASIS.text
    : RECEIVED_VARIANTS_STATS.ACTUAL.text,
)
const CHART_ID = 'chart-performance'
const labels = ['BAA', 'BFT', 'BOT', 'BST', 'USDT']

const options = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 0,
  },
  scales: {
    x: {
      ticks: {
        padding: 2,
        font: {
          size: '10px',
          weight: 500,
          family: 'Dm ,sans-serif',
          align: 'end',
        },
        callback: function(value, index, ticks) {
          if (isMobile.value) {
            return labels[index]
          } else {
            return `       ${labels[index]}`
          }
        },
      },
      grid: {
        color: 'rgba(34, 36, 43, 1)',
        borderColor: 'rgba(34, 36, 43, 1)',
        display: false,
      },
      border: {
        display: false,
      },
    },
    y: {
      border: {
        display: false,
      },
      ticks: {
        font: {
          size: '10px',
          weight: 700,
          family: 'Dm ,sans-serif',
        },
        callback: function(value) {
          return `$${$app.filters.rounded(value, 2)}`
        },
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.parsed.y
          return `$${$app.filters.rounded(label, 2)}`
        },
      },
    },
  },
}

const bgMap = {
  bst: 'rgb(218, 86, 126)',
  bft: 'rgb(84, 120, 212)',
  bot: 'rgb(199, 93, 208)',
  usdt: 'rgb(27, 162, 122)',
  baa: 'rgb(237, 205, 92)',
  brf: '#E99C55',
}

const config = ref({
  type: 'bar',
  data: {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderRadius: 15,
      },
    ],
  },
  options,
  plugins: [
    {
      afterDraw: (chart) => {
        const ctx = chart.ctx
        const xAxis = chart.scales.x
        const yAxis = chart.scales.y
        if (isMobile.value) return
        xAxis.ticks.forEach((value, index) => {
          const x = xAxis.getPixelForTick(index)
          ctx.drawImage(images[index], x - 25, yAxis.bottom + 6)
        })
      },
    },
  ],
})

const updateChart = (arr) => {
  if (!Array.isArray(arr)) {
    return
  }
  const chartData = {
    labels: [],
    data: [],
  }
  arr.forEach((asset) => {
    chartData.labels.push(asset.symbol)
    chartData.data.push(asset.winning_amount_usd)
  })
  if (CHART_INSTANCE) {
    CHART_INSTANCE.data.datasets[0].data = [...chartData.data]
    CHART_INSTANCE.data.labels = [...chartData.labels]
  }
}

onMounted(() => {
  const chartStatus = Chart.getChart(CHART_ID) // <canvas> id
  props.assets.forEach((asset) => {
    config.value.data.labels.push(asset.symbol)
    config.value.data.datasets[0].data.push(asset.winning_amount_usd)
    config.value.data.datasets[0].backgroundColor.push(bgMap[asset.symbol.toLowerCase()])
  })

  if (!chartStatus) {
    const ctx = document.getElementById(CHART_ID)
    CHART_INSTANCE = new Chart(ctx, config.value)
  }
})

watch(
  () => props.assets,
  (value) => {
    updateChart(value)
    CHART_INSTANCE?.update()
  },
  {
    immediate: true,
    deep: true,
  },
)

function triggerTooltip(symbol) {
  const instansChart = Chart.getChart(CHART_ID)

  if (!instansChart) {
    return
  }
  const tooltip = instansChart.tooltip

  const symbolIndex = props.assets.findIndex((item) => item.symbol === symbol)

  if (tooltip.getActiveElements().length > 0) {
    tooltip.setActiveElements([], { x: 0, y: 0 })
  } else {
    const chartArea = instansChart.chartArea
    tooltip.setActiveElements(
      [
        {
          datasetIndex: 0,
          index: symbolIndex,
        },
      ],
      {
        x: (chartArea.left + chartArea.right) / 2,
        y: (chartArea.top + chartArea.bottom) / 2,
      },
    )
  }

  instansChart.update()
}

function hideTooltip() {
  const instansChart = Chart.getChart(CHART_ID)

  if (!instansChart) return

  const tooltip = instansChart.tooltip

  tooltip.setActiveElements([], { x: 0, y: 0 })
  instansChart.update()
}

defineExpose({
  triggerTooltip,
  hideTooltip,
})
</script>

<style src="./w-chart-performance.scss" lang="scss" />
