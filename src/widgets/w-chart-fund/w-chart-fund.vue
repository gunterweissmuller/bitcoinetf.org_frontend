<template>
  <div>
    <div id="fund-chart" :class="['w-chart-fund', { 'w-chart-fund--is-main': isMain }]">
      <div v-if="title" class="w-chart-fund__caption">
        <a-live class='w-chart-fund__caption-live' />
        <span class="w-chart-fund__caption-text">
          {{ title }}
        </span>
        <a-icon
          :style="{ visibility: props.type === 'shareholders' ? 'hidden' : '' }"
          width='18'
          height='18'
          class='w-chart-fund__caption-icon'
          :name='Icon.MonoInfo'
        />
      </div>

      <div class="w-chart-fund__head">
        <div class="w-chart-fund__titles">
          <div class="w-chart-fund__titles-title" v-if="totalAmountUsdComp">
            ${{$app.filters.rounded(totalAmountUsdComp, 0)}} {{ props.type === 'shareholders' ? 'Shareholders' : '' }}
          </div>
        </div>

        <div :class="['w-chart-fund__info', { 'w-chart-fund__info--danger': difference < 0 }]">
          <div
            :class="['w-chart-fund__info-difference', { 'w-chart-fund__info-difference--danger': difference < 0 }]"
          >
            {{ amountUsdDifference > 0 ? '+' : '' }} ${{ $app.filters.rounded(amountUsdDifference, 2) }} ({{
              $app.filters.rounded(difference, 2)
            }}%)
          </div>
        </div>
      </div>

      <div class='w-chart-fund__chart'>
        <canvas :id="CHART_ID"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Chart from 'chart.js/auto'
import { useNuxtApp } from '#app'
import ALive from '~/src/shared/ui/atoms/a-live/a-live.vue';
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue';
import { Icon } from '~/src/shared/constants/icons'

const {$app} = useNuxtApp()

const props = withDefaults(
  defineProps<{
    id?: string | null
    title: string
    isMain: boolean
    isTotalAssets?: boolean
    type: 'assets' | 'shareholders'
  }>(),
  {
    isTotalAssets: false,
    isMain: false,
    id: null,
    type: 'assets'
  },
)

// always unique id
const CHART_ID : string = `${getCurrentInstance()?.uid ?? Math.floor(Math.random() * 10**10)}`;

let CHART_INSTANCE: any = null

const totalAmountBtc = ref(0)
const totalAmountUsd = ref(0)

const totalAmountUsdComp = computed(() => {
  return $app.store.user.totalFund?.totalAmountUsd > 0 ? $app.store.user.totalFund.totalAmountUsd : ''
})

const amountUsdDifference = computed(() => {
  return $app.store.user.totalFund?.differenceUsd || 0
})

const difference = computed(() => {
  return $app.store.user.totalFund?.difference || 0
})

const options = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 0,
  },
  scales: {
    x: {
      grid: {
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
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: 'rgba(77, 148, 255, 0.3)',
        borderColor: '#4D94FF',
        tension: 0.4,
        fill: true,
      },
    ],
  },
  options,
  plugins: [],
}

const changeChartData = (tab) => {
  if (CHART_INSTANCE) {
    CHART_INSTANCE.data.datasets[0].data = tab.map((item) => Number(item.amount))
    CHART_INSTANCE.data.labels = tab.map((item) => {
      if (props.isTotalAssets) {
        return item.label
      } else {
        return $app.filters.dayjs(item?.created_at)?.format('MM.YY')
      }
    });
    CHART_INSTANCE.update();
  }
}

const getStatistics = async (tab?: any) => {
  const requestPayload: any = {filters: {}}

  if (props.id) {
    requestPayload.filters.asset_uuid = props.id
  }

  const response = props.isTotalAssets ? await $app.api.eth.statisticEth.getAssetsFund(requestPayload)  : await $app.api.info.statistic.getAssetsStat(requestPayload)

  totalAmountBtc.value = response?.total_amount_btc
  totalAmountUsd.value = response?.total_amount_usd

  $app.store.user.totalFund = {
    totalAmountBtc: totalAmountBtc.value,
    totalAmountUsd: totalAmountUsd.value,
    dividendsUsd: response?.dividends_usd,
    dividendsBtc: response?.dividends_btc,
    allocation: response?.allocation,
    differenceUsd: response?.difference_usd,
    difference: response?.difference
  }

  let data = response.data;

  interface DataItem {
    amount: number;
    created_at: number;
  }

  if (data.length > 4) {
    data = data.filter((item : DataItem) => item.amount != 0)
    data = data.filter((item  : DataItem, index : number) => index === 0 || index === data.length - 1 || index === 4 || index === 8)
  }

  let sortedData = data.sort((a : DataItem, b : DataItem) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  sortedData = sortedData.filter((item : DataItem) => item.amount != 0)
  changeChartData(sortedData)
}

onMounted(async () => {
  const chartStatus = Chart.getChart(CHART_ID) // <canvas> id

  if (!chartStatus) {
    Chart.defaults.font.size = 10;
    Chart.defaults.font.family = 'Caption';
    Chart.defaults.font.weight = 'bold';
    Chart.defaults.color = '#888CA0';
    const ctx = document.getElementById(CHART_ID) as HTMLCanvasElement;
    CHART_INSTANCE = new Chart(ctx, config)
    await getStatistics()
  }
})
</script>

<style src="./w-chart-fund.scss" lang="scss"/>
