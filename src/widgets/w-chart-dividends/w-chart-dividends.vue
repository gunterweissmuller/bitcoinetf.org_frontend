<template>
  <div class="w-chart-dividends">
    <div class="w-chart-dividends__title">Your Dividends</div>
    <div id="chart--dividends" class="w-chart-dividends__wrap">
      <div class="w-chart-dividends__subhead">
        <div class="w-chart-dividends__subhead-title">Dividends</div>
        <div class="w-chart-dividends__variants">
          <div class="w-chart-dividends__variants-item w-chart-dividends__variants-actual">Actual</div>
          <div class="w-chart-dividends__variants-item w-chart-dividends__variants-minimum">Minimum</div>
          <div class="w-chart-dividends__variants-item w-chart-dividends__variants-projected">Projected</div>
        </div>
      </div>
      <div class="w-chart-dividends__sums">
        <div class="w-chart-dividends__usd">
          <div v-if="wallet?.btc_amount" class="w-chart-dividends__usd-title">
            $
            {{ $app.filters.rounded(wallet.btc_amount_added * $app.store.user.btcValue, 2) }}
          </div>
        </div>
        <div class="w-chart-dividends__btc">
          <div
            v-if="wallet && $app.store.user?.info?.account?.order_type !== 'usdt'"
            class="w-chart-dividends__btc-title"
            v-html="$app.filters.convertValue($app.filters.rounded(wallet.btc_amount_added, 8))"
          ></div>
          <div
            v-if="statistic?.amount_last_dividend_btc"
            class="w-chart-dividends__btc-amount"
            v-html="`+ ${$app.filters.convertValue($app.filters.rounded(statistic.amount_last_dividend_btc, 8))}`"
          ></div>
        </div>
      </div>
      <div class="w-chart-dividends__chart">
        <canvas :id="CHART_ID"></canvas>
      </div>
    </div>
    <div class="w-chart-dividends__stats">
      <e-stat
        class="w-chart-dividends__stats-a"
        v-if="isEmpty(statistic?.projected_total_dividends_usd) && isEmpty(statistic?.projected_total_dividends_btc)"
        :title="`$${$app.filters.rounded(statistic?.projected_total_dividends_usd, 2)}`"
        :subtitle="$app.filters.convertValue($app.filters.rounded(statistic?.projected_total_dividends_btc, 8))"
        info="Projected total dividends"
        :date="`By ${dateWithThreeYears || ''}`"
        :popper="projectedTotalPopper"
      />
      <e-empty-data
        class="w-chart-dividends__stats-a"
        title="You don’t have info about projected total dividends"
        v-else
      />
      <e-stat
        class="w-chart-dividends__stats-b"
        v-if="isEmpty(Number(statistic?.received_dividends_usd)) && isEmpty(Number(statistic?.received_dividends_btc))"
        :toggle-title="receivedTitle"
        :title-color="'success'"
        :title="`$${$app.filters.rounded(receivedValues?.usd, 2)}`"
        :subtitle="$app.filters.convertValue($app.filters.rounded(receivedValues?.btc, 8))"
        info="Dividends received"
        :popper="dividendsReceivedPopper"
        @toggle-mouse-down="changeViewReceived"
        @toggle-mouse-up="changeViewReceived"
      />
      <e-empty-data
        class="w-chart-dividends__stats-b"
        title="You don’t have info about dividends received"
        v-else
      />
      <e-stat
        class="w-chart-dividends__stats-c"
        :list="personalDividends"
        type="list"
        title="Latest dividends"
        :info="!personalDividends?.length ? 'No dividends yet.' : ''"
        style="cursor: pointer"
        @click="$router.push('/personal/wallet/dividends')"
      />
      <e-stat
        class="w-chart-dividends__stats-d"
        id="e-stat-statements"
        :list="listStatements"
        title-link="personal-earnings-statements"
        list-type="files"
        type="list"
        title="Statements"
        :info="!listStatements?.length ? 'No statements yet.' : ''"
        style="cursor: pointer"
        @click="$router.push('/personal/earnings/statements')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Chart from 'chart.js/auto'
import EStat from '~/src/entities/e-stat/e-stat.vue'
import { RECEIVED_VARIANTS_STATS } from '~/src/shared/constants/global'
import { useNuxtApp } from '#app'
import EEmptyData from '~/src/entities/e-empty-data/e-empty-data.vue'
import { computed } from 'vue'

const { $app } = useNuxtApp()

const props = withDefaults(
  defineProps<{
    statistic: any
    dividends: any
    wallet: any
    personalDividends: any
    dateWithThreeYears: any
  }>(),
  {
    statistic: null,
    dividends: null,
    wallet: null,
    personalDividends: null,
    dateWithThreeYears: null,
  },
)

const projectedTotalPopper = {
  title: 'Projected total dividends',
  text: 'Peek into the future! This number is our informed estimate of the cumulative dividends we aim to distribute to you over your investment period, based on current trends and market insights.',
}
const dividendsReceivedPopper = {
  title: 'Dividends received',
  text: "<h2 style='font-weight: 800'>Cost Basis</h2>Represents the value of the Bitcoin interest you've earned, fixed in USD, at the time those satoshis were distributed to you. <br/><br/><h2 style='font-weight: 800'>Actual Value</h2>Fast forward to today, this reflects the current market value of the Bitcoin interest you've accumulated. Remember, while the interest is calculated in USD, the actual value can vary with Bitcoin's market price.",
}

const MOUNTH = {
  0: 'Jan',
  1: 'Feb',
  2: 'Mar',
  3: 'Apr',
  4: 'May',
  5: 'Jun',
  6: 'Jul',
  7: 'Aug',
  8: 'Sep',
  9: 'Oct',
  10: 'Nov',
  11: 'Dec',
}

const CHART_ID = 'chart-dividends'

let CHART_INSTANCE: any = null

const viewStatReceived = ref(null)

const listStatements = ref([])
const dataChart = ref({
  actualData: [],
  minimumData: [],
  projectedData: [],
  labels: [],
})

const isEmpty = (n) => {
  return Number(n) === n
}

const options = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 0,
  },
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
      },
      ticks: {
        callback: function (value) {
          return `$${$app.filters.rounded(value, 2)}`
        },
      },
    },
  },
}

const config = {
  type: 'bar',
  data: {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: '#12DF00',
        borderRadius: 4,
      },
      {
        data: [],
        backgroundColor: '#E99C55',
        borderRadius: 4,
      },
      {
        data: [],
        backgroundColor: '#0066FF',
        borderRadius: 4,
      },
    ],
  },
  options,
  // plugins: [backgroundBar],
}

const getReports = async () => {
  await $app.api.eth.statisticEth
    .getReports({
      per_page: 4,
      page: 1,
    })
    .then((response) => {
      listStatements.value = response.data.data
    })
}

const downloadReport = async (item) => {
  await $app.api.eth.statisticEth
    .getReport({
      uuid: item.uuid,
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob.slice(0, blob.size, 'application/pdf'))
      const link = document.createElement('a')

      link.style.display = 'none'
      link.href = url
      link.download = `${item.date}.pdf`
      link.click()

      window.URL.revokeObjectURL(url)
    })
}

const changeViewReceived = () => {
  viewStatReceived.value =
    viewStatReceived.value === RECEIVED_VARIANTS_STATS.BASIS.value
      ? RECEIVED_VARIANTS_STATS.ACTUAL.value
      : RECEIVED_VARIANTS_STATS.BASIS.value
}

const receivedTitle = computed(() => {
  return viewStatReceived.value === RECEIVED_VARIANTS_STATS.BASIS.value
    ? RECEIVED_VARIANTS_STATS.ACTUAL.text
    : RECEIVED_VARIANTS_STATS.BASIS.text
})

const receivedValues = computed(() => {
  return props.statistic?.[viewStatReceived.value] ?? {}
})

const changeChartData = (value) => {
  if (!value) return
  const actualApy = value.actual_apy
  const minimumApy = value.minimum_apy
  const projectedApy = value.projected_apy

  const actualDividends = value.actual_dividends

  for (let i = 0; i < actualDividends.length; i++) {
    const sum = actualDividends[i]?.sum
    const date = $app.filters.dayjs(actualDividends[i]?.date).month()
    dataChart.value.labels.push(MOUNTH[date])

    dataChart.value.actualData.push(Number(sum).toFixed(0))
    dataChart.value.minimumData.push(((Number(sum) * minimumApy) / actualApy).toFixed(0))
    dataChart.value.projectedData.push(((Number(sum) * projectedApy) / actualApy).toFixed(0))
  }
  let acc = 0

  for (let i = 0; i < 6; i++) {
    acc += actualDividends[i]?.sum || 0
  }

  if (dataChart.value.actualData.length !== 6) {
    const mockList = []
    let month = $app.filters.dayjs(actualDividends[actualDividends.length - 1 || 0]?.date).month()
    for (let i = 0; i < 6; i++) {
      const sum = acc / actualDividends.length
      if (!actualDividends?.[i]) {
        month += 1
        if (month === 12) {
          month = 0
          mockList.push(MOUNTH[month])
        } else {
          mockList.push(MOUNTH[month])
        }

        dataChart.value.actualData.push((Number(sum) * (i + 1)).toFixed(0))
        dataChart.value.minimumData.push(((Number(sum) * (i + 1) * minimumApy) / actualApy).toFixed(0))
        dataChart.value.projectedData.push(((Number(sum) * (i + 1) * projectedApy) / actualApy).toFixed(0))
      }
    }

    dataChart.value.labels = [...dataChart.value.labels, ...mockList]
  }

  if (!CHART_INSTANCE) {
    const ctx = document.getElementById(CHART_ID)
    CHART_INSTANCE = new Chart(ctx, config)
  }

  if (CHART_INSTANCE) {
    CHART_INSTANCE.data.datasets[0].data = [...dataChart.value.actualData]
    CHART_INSTANCE.data.datasets[1].data = [...dataChart.value.minimumData]
    CHART_INSTANCE.data.datasets[2].data = [...dataChart.value.projectedData]
    CHART_INSTANCE.data.labels = [...dataChart.value.labels]
    CHART_INSTANCE.update()
  }
}

const apyes = computed(() => {
  return $app.store.user.statistic
})

onMounted(async () => {
  await getReports()

  const chartStatus = Chart.getChart(CHART_ID) // <canvas> id

  if (!chartStatus) {
    Chart.defaults.font.size = 10
    Chart.defaults.font.family = 'Caption'
    Chart.defaults.font.weight = 'bold'
    Chart.defaults.color = '#888CA0'
  }
})

watch(() => props.dividends, (v) => {
  changeChartData(v)
}, {
  deep: true,
})

watch(() => props.statistic, (v) => {
  viewStatReceived.value = v?.received_variant
}, {
  immediate: true,
  deep: true,
})


</script>

<style src="./w-chart-dividends.scss" lang="scss" />
