<template>
  <div id="portfolio-chart" class="w-chart-portfolio">
    <div v-if="title" class="w-chart-fund__caption">
      <a-live class='w-chart-fund__caption-live' />
      <span class="w-chart-fund__caption-text">
        {{ title }}
      </span>
      <a-icon
        width='18'
        height='18'
        class='w-chart-fund__caption-icon'
        :name='Icon.MonoInfo'
      />
    </div>
    <div class="w-chart-portfolio__chart">
      <canvas :id="CHART_ID" />
    </div>
    <m-slider
        id="portfolio"
        :navigation="false"
        :modules="[]"
        slides-per-view="auto"
        :space-between="8"
      >
        <template #slides>
          <swiper-slide class="w-chart-portfolio__slide" v-for="(asset, id) in props.assets" :key="id">
          <nuxt-link class="w-chart-portfolio__slide-link" :to="{ name: 'personal-assets-symbol', params: { symbol: asset.symbol.toLowerCase() } }">
              <div :class="['w-chart-portfolio__type-symbol', `bg--${asset.symbol.toLowerCase()}`]"></div>
              <div class="w-chart-portfolio__type-desc">
                <span class="w-chart-portfolio__type-name">
                  {{ asset.name }}
                </span>
                <span class="w-chart-portfolio__type-price">
                  ${{ $app.filters.rounded(asset.full_balance, 2) }}
                </span>
              </div>
            </nuxt-link>
          </swiper-slide>
        </template>
      </m-slider>
  </div>
</template>

<script setup lang="ts">
import { IAsset } from '~/src/shared/types/global';
import { useNuxtApp } from '#app';
import { Chart, registerables } from 'chart.js';
import { getChartLabelPlugin } from 'chart.js-plugin-labels-dv';
import MSlider from '~/src/shared/ui/molecules/m-slider/m-slider.vue';
import { SwiperSlide } from 'swiper/vue';
import { Icon } from '~/src/shared/constants/icons';
import ALive from '~/src/shared/ui/atoms/a-live/a-live.vue';
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue';

Chart.register(...registerables, getChartLabelPlugin())

const { $app } = useNuxtApp()

const CHART_ID = 'chart-portfolio'
let CHART_INSTANCE = null

const props = defineProps<{
  btcValue: any
  assets: IAsset[]
  title: string
}>()

const fullBalanceFund = computed(() => {
  return $app.store.assets.fullBalanceFund
})

const bgMap = {
  bst: 'rgba(252, 43, 94)',
  bft: 'rgba(14, 133, 237)',
  bot: 'rgba(117, 64, 239)',
  usdt: 'rgba(29, 202, 140)',
  baa: 'rgba(239, 186, 50)',
  brf: 'rgba(255, 141, 7)',
  vault: 'rgba(92, 206, 214)',
}

const textCenter = {
  id: 'textCenter',
  afterDatasetsDraw: (chart) => {
    const { ctx } = chart
    const xCoor = chart.getDatasetMeta(0).data[0]?.x
    const yCoor = chart.getDatasetMeta(0).data[0]?.y
    ctx.save()
    ctx.textAlign = 'center'
    // ctx.fillText('Real-time Portfolio Value', xCoor, yCoor - 20)

    ctx.font = 'bold 16px Dm, sans-serif'
    ctx.fillStyle = $app.store.user.theme === 'dark' ? '#F1F2F4' : '#22242b'
    ctx.fillText('$' + $app.filters.rounded(fullBalanceFund.value, 2), xCoor, yCoor + 0)

    ctx.font = 'bold 12px Dm, sans-serif'
    ctx.fillStyle = '#888ca0'

    const value = localStorage.getItem('display-currency') || 'btc'
    let text = ''
    if (value === 'btc') {
      text = `₿ ${$app.filters.rounded(resultSumBtc.value, 8)}`
    } else {
      text = `丰 ${$app.filters.rounded(resultSumBtc.value * 100000000)}`
    }
    ctx.fillText(text, xCoor, yCoor + 20)
  },
}

const colorBgSvg = computed(() => {
  return $app.store.user.theme === 'dark' ? '#22242B' : 'white'
})

const options = ref({
  responsive: true,
  maintainAspectRatio: false,
  borderWidth: 0,
  cutout: 80,
  hoverOffset: -20,
  animation: {
    duration: 0,
  },
  plugins: {
    legend: {
      display: false,
    },
    // labels: {
    //   render: 'image',
    //   images: [
    //     { src: '/img/portfolio/baa.svg', width: 16, height: 16 },
    //     { src: '/img/portfolio/fba.svg', width: 16, height: 16 },
    //     { src: '/img/portfolio/boa.svg', width: 16, height: 16 },
    //     { src: '/img/portfolio/brf.svg', width: 16, height: 16 },
    //     { src: '/img/portfolio/sba.svg', width: 16, height: 16 },
    //     { src: '/img/portfolio/usdt.svg', width: 16, height: 16 },
    //     { src: '/img/portfolio/vault.svg', width: 16, height: 16 },
    //   ],
    // },
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.parsed;
          return `$${$app.filters.rounded(label, 2)}`;
        }
      }
    },
  },
})

const config = ref({
  type: 'doughnut',
  data: {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        // hoverOffset: -10,
      },
    ],
  },
  options: options.value,
  plugins: [textCenter],
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
    if (asset.symbol === 'BRF') {
      chartData.data.push(asset?.incoming_amount_btc * $app.store.user.btcValue)
    } else {
      chartData.data.push(asset.full_balance)
    }
  })
  if (CHART_INSTANCE) {
    CHART_INSTANCE.data.datasets[0].data = [...chartData.data]
    CHART_INSTANCE.data.labels = [...chartData.labels]
  }
}

const resultSumBtc = computed(() => {
  if (!fullBalanceFund.value) {
    return 0
  }
  return (1 / $app.store.user.btcValue) * fullBalanceFund.value
})

const totalSum = computed(() => {
  if (!props.assets.length) return 0
  return props.assets.reduce((sum, item) => {
    sum += Number(item.full_balance)
    return sum
  }, 0)
})

onMounted(() => {
  const chartStatus = Chart.getChart(CHART_ID) // <canvas> id
  if (!props.assets.length) {
    return
  }

  props.assets.forEach((asset) => {
    config.value.data.labels.push(asset.symbol)

    if (asset.symbol === 'BRF') {
      config.value.data.datasets[0].data.push(asset?.incoming_amount_btc * $app.store.user.btcValue)
    } else {
      config.value.data.datasets[0].data.push(asset.full_balance)
    }
    config.value.data.datasets[0].backgroundColor.push(bgMap[asset.symbol.toLowerCase()])
  })

  if (!chartStatus) {
    Chart.defaults.font.size = 10
    Chart.defaults.font.family = 'Caption'
    Chart.defaults.font.weight = 'bold'
    Chart.defaults.color = '#888CA0'
    const ctx = document.getElementById(CHART_ID)
    CHART_INSTANCE = new Chart(ctx, config.value)
  }

  if (chartStatus) {
    updateChart(props.assets)
    CHART_INSTANCE?.update()
  }
})

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

watch(fullBalanceFund, () => {
  updateChart(props.assets)
  CHART_INSTANCE?.update()

})
</script>

<style src="./w-chart-portfolio.scss" lang="scss" />
