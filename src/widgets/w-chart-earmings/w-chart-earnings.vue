<template>
  <div class="w-chart-earnings">
    <div class="w-chart-earnings__head">
      <div class="w-chart-earnings__head-title" v-if="earnings?.total_balance_usd">
        {{ $app.filters.rounded(earnings.total_balance_usd,2) }} ETF Shares
      </div>
      <div class="w-chart-earnings__head-subtitle">
        {{ $app.filters.rounded(earnings.total_balance_usd / fundTotalUsd, 8) }}% of the circulation
      </div>
    </div>
    <div id="chart--earnings" class="w-chart-earnings__wrap">
      <div class="w-chart-earnings__subhead">
        <div class="w-chart-earnings__projected">
          <div v-if="resultSumUsd && resultSumBtc" class="w-chart-earnings__projected-title">
            {{ currentChartData?.subTitle }}
          </div>
          <div v-if="resultSumUsd" class="w-chart-earnings__projected-usd">
            ${{ $app.filters.rounded(resultSumUsd, 2) }}
          </div>
          <div
            v-if="resultSumBtc"
            class="w-chart-earnings__projected-btc"
            v-html="$app.filters.convertValue($app.filters.rounded(resultSumBtc, 8))"
          ></div>
        </div>
        <div class="w-chart-earnings__origin">
          <div class="w-chart-earnings__origin-title">Original value</div>
          <div v-if="earnings?.total_balance_usd" class="w-chart-earnings__origin-amount">
            ${{ $app.filters.rounded(earnings.total_balance_usd,2) }}
          </div>
        </div>
      </div>
      <div class="w-chart-earnings__chart">
        <canvas :id="CHART_ID"></canvas>
      </div>
    </div>
    <div class="w-chart-earnings__tabs">
      <div
        v-for="(tab, idx) in visibleTabs"
        :key="idx"
        :class="['w-chart-earnings__tab', { 'w-chart-earnings__tab--active': tab.title === currentChartData.title }]"
        @mousedown="changeChartData(tabs?.[idx])"
        @mouseup="changeChartData(tabs?.[2])"
        @touchstart="changeChartData(tabs?.[idx])"
        @touchend="changeChartData(tabs?.[2])"
      >
        {{ tab.title }}
      </div>
    </div>
    <a
      id="chart-earnings-view"
      target="_blank"
      :href="`${explorerHostname}/account/${$app.store.user?.blockchainUserWallet}`"
      class="w-chart-earnings__link"
      >View on Blockchain</a
    >
    <div class="w-chart-earnings__info">*Paid in Bitcoin. Term: 1095 Days</div>
  </div>
</template>

<script setup lang="ts">
import Chart from 'chart.js/auto'
import { useNuxtApp } from '#app'
import { computed } from 'vue'
const runtimeconfig = useRuntimeConfig()
const explorerURL = runtimeconfig.public.EXPLORER_API
const explorerHostname = `https://${explorerURL}`
const CHART_ID = 'chart-earnings'

let CHART_INSTANCE: any = null

const { $app } = useNuxtApp()

const fundTotalUsd = computed(() => {
  return $app.store.user.fundTotalUsd
})

const props = withDefaults(
  defineProps<{
    earnings: any
    apy: any
  }>(),
  {
    earnings: null,
    apy: null,
  },
)

const tabs = ref([
  {
    title: 'Guaranteed',
    subTitle: 'Guaranteed total value',
    data: [],
  },
  {
    title: 'Actual',
    subTitle: 'Actual total value',
    data: [],
  },
  {
    title: 'Projected',
    subTitle: 'Projected total value',
    data: [],
  },
])

const visibleTabs = computed(() => {
  return tabs.value.slice(0, 2)
})
const currentChartData = ref(tabs.value[2])

const options = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 0,
  },
  scales: {
    y: {
      ticks: {
        font: {
          size: '10px',
          weight: 700,
          family: 'Dm ,sans-serif',
        },
        callback: function (value) {
          return `$${$app.filters.rounded(value, 2)}`
        },
      },
      border: {
        display: false,
      },
    },
    x: {
      ticks: {
        font: {
          size: '10px',
          weight: 700,
          family: 'Dm ,sans-serif',
        },
      },
      grid: {
        display: false,
      },
      border: {
        display: false,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
}

const config = {
  type: 'line',
  data: {
    labels: currentChartData.value.data.map((item) => item?.date),
    datasets: [
      {
        data: currentChartData.value.data.map((item) => item?.amount),
        backgroundColor: '#FFFFFFCC',
        borderColor: '#FFFFFF',
        tension: 0.4,
        fill: true,
      },
    ],
  },
  options,
  plugins: [],
}
const changeChartData = (tab) => {
  currentChartData.value = tab
  if (CHART_INSTANCE) {
    CHART_INSTANCE.data.datasets[0].data = tab.data.map((item) => item.amount)
    CHART_INSTANCE.data.labels = tab.data.map((item) => item.date)
    CHART_INSTANCE.update()
  }
}

const createChartData = () => {
  const dateList = []
  const resultList = {
    actual: [],
    guaranted: [],
    projected: [],
  }
  const actualApy = props.apy?.actual_apy
  const guarantedApy = props.apy?.minimum_apy
  const projectedApy = props.apy?.projected_apy

  let actualAmountUsd = props.earnings?.total_balance_usd
  let actualAmountUsdStart = props.earnings?.total_balance_usd
  let guarantedAmountUsdStart = props.earnings?.total_balance_usd
  let guarantedAmountUsd = props.earnings?.total_balance_usd
  let projectedAmountUsdStart = props.earnings?.total_balance_usd
  let projectedAmountUsd = props.earnings?.total_balance_usd

  for (let i = 0; i < 4; i++) {
    const date = $app.filters.dayjs()
    if (i === 3) {
      dateList.push({ date: date.add(i, 'year').toDate(), type: 'main' })
    } else if (i) {
      dateList.push({ date: date.add(i, 'year').toDate(), type: 'main' })
      dateList.push({ date: date.add(i, 'year').add(3, 'month').toDate(), type: 'second', apy: 14 * i })
      dateList.push({ date: date.add(i, 'year').add(6, 'month').toDate(), type: 'second', apy: 2 * i })
      dateList.push({ date: date.add(i, 'year').add(9, 'month').toDate(), type: 'second', apy: 8 * i })
    } else {
      dateList.push({ date: date.toDate(), type: 'main' })
      dateList.push({ date: date.add(3, 'month').toDate(), type: 'second', apy: -4 })
      dateList.push({ date: date.add(6, 'month').toDate(), type: 'second', apy: 1 })
      dateList.push({ date: date.add(9, 'month').toDate(), type: 'second', apy: -6 })
    }
  }

  dateList.forEach(({ date, type, apy }, idx) => {
    if (type === 'main') {
      resultList.actual.push({
        date: $app.filters.dayjs(date).format('MM YYYY'),
        amount: idx !== 0 ? actualAmountUsd + actualAmountUsdStart * (actualApy / 100) : actualAmountUsd,
      })

      resultList.guaranted.push({
        date: $app.filters.dayjs(date).format('MM YYYY'),
        amount: idx !== 0 ? guarantedAmountUsd + guarantedAmountUsdStart * (guarantedApy / 100) : guarantedAmountUsd,
      })

      resultList.projected.push({
        date: $app.filters.dayjs(date).format('MM YYYY'),
        amount: idx !== 0 ? projectedAmountUsd + projectedAmountUsdStart * (projectedApy / 100) : projectedAmountUsd,
      })

      if (idx !== 0) {
        actualAmountUsd = actualAmountUsd + actualAmountUsdStart * (actualApy / 100)
        guarantedAmountUsd = guarantedAmountUsd + guarantedAmountUsdStart * (guarantedApy / 100)
        projectedAmountUsd = projectedAmountUsd + projectedAmountUsdStart * (projectedApy / 100)
      }
    } else {
      resultList.actual.push({
        date: $app.filters.dayjs(date).format('MM YYYY'),
        amount: idx !== 0 ? actualAmountUsd + actualAmountUsdStart * ((actualApy - apy * 3) / 100) : actualAmountUsd,
      })

      resultList.guaranted.push({
        date: $app.filters.dayjs(date).format('MM YYYY'),
        amount:
          idx !== 0 ? guarantedAmountUsd + guarantedAmountUsdStart * ((guarantedApy - apy) / 100) : guarantedAmountUsd,
      })

      resultList.projected.push({
        date: $app.filters.dayjs(date).format('MM YYYY'),
        amount:
          idx !== 0 ? projectedAmountUsd + projectedAmountUsdStart * ((projectedApy - apy) / 100) : projectedAmountUsd,
      })
    }
  })

  tabs.value[0].data = resultList.guaranted
  tabs.value[1].data = resultList.actual
  tabs.value[2].data = resultList.projected
}

const resultSumUsd = computed(() => {
  if (!currentChartData.value?.data?.length) {
    return null
  }

  return currentChartData.value.data[currentChartData.value.data?.length - 1]?.amount
})

const resultSumBtc = computed(() => {
  if (!currentChartData.value?.data?.length) {
    return null
  }
  return (
    (1 / props.earnings?.btc_price) * currentChartData.value?.data?.[currentChartData.value?.data?.length - 1]?.amount
  )
})


onMounted(() => {
  const chartStatus = Chart.getChart(CHART_ID) // <canvas> id

  if (!chartStatus) {
    Chart.defaults.color = '#FFFFFF99'
    const ctx = document.getElementById(CHART_ID)
    CHART_INSTANCE = new Chart(ctx, config)
  }
})

watch([() => props.earnings, () => props.apy], ([earnings, apy]) => {
  if (!earnings || !apy) return
  createChartData(earnings)
  changeChartData(tabs.value[2])
}, {
  deep: true, immediate: true
})

// TODO hardcode: View on Blockchain
</script>

<style src="./w-chart-earnings.scss" lang="scss" />
