<template>
  <div>
    <template v-if="isTopTabs">
      <div class="w-chart-fund__tabs w-chart-fund__tabs__indent" >
        <div
          v-for="(tab, idx) in tabs"
          :key="idx"
          :class="[
            'w-chart-fund__item',
            { 'w-chart-fund__item--active': currentTab.title === tab.title },
            { 'w-chart-fund__item--live': 'ALL Live' === tab.title },
            { 'w-chart-fund__item--all-live': 'ALL Live' === tab.title && currentTab.title === tab.title },
          ]"
          @click="getStatistics(tab)"
        >
          {{ tab.title }}
        </div>
      </div>
    </template>

    <div id="fund-chart" :class="['w-chart-fund', { 'w-chart-fund--is-main': isMain }]">
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

      <div class="w-chart-fund__head">
        <div class="w-chart-fund__titles">
          <div class="w-chart-fund__titles-title" v-if="totalAmountUsdComp">
            ${{$app.filters.rounded(totalAmountUsdComp, 0)}}
          </div>

          <!-- <div class="w-chart-fund__titles-subtitle">
            {{ $app.filters.rounded(totalAmountUsdComp, 0) }} Shares Issued
          </div> -->
        </div>

        <div :class="['w-chart-fund__info', { 'w-chart-fund__info--danger': difference < 0 }]">
          <div
            :class="['w-chart-fund__info-difference', { 'w-chart-fund__info-difference--danger': difference < 0 }]"
          >
            {{ amountUsdDifference > 0 ? '+' : '' }} ${{ $app.filters.rounded(amountUsdDifference, 2) }} ({{
              $app.filters.rounded(difference, 2)
            }}%)
          </div>

          <!-- <div class="w-chart-fund__info-text">
            {{ currentTab.title === 'ALL Live' ? 'Since launch in Jan 2023' : currentTab.info }}
          </div> -->
        </div>
      </div>

      <div :class="['w-chart-fund__chart', { 'w-chart-fund__chart--no-indent': isTopTabs }]">
        <canvas :id="CHART_ID"></canvas>
      </div>

      <!-- <template v-if="!isTopTabs">
        <div class="w-chart-fund__tabs">
          <div
            v-for="(tab, idx) in tabs"
            :key="idx"
            :class="[
              'w-chart-fund__item',
              { 'w-chart-fund__item--active': currentTab.title === tab.title },
              { 'w-chart-fund__item--live': 'ALL Live' === tab.title },
              { 'w-chart-fund__item--all-live': 'ALL Live' === tab.title && currentTab.title === tab.title },
            ]"
            @click="getStatistics(tab)"
          >
            {{ tab.title }}
          </div>
        </div>
      </template> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import Chart from 'chart.js/auto'
import {useNuxtApp} from '#app'
import ALive from '~/src/shared/ui/atoms/a-live/a-live.vue';
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue';
import { Icon } from '~/src/shared/constants/icons'

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

const {$app} = useNuxtApp()

const props = withDefaults(
  defineProps<{
    id?: string | null
    title: string
    isMain: boolean
    isTopTabs?: boolean
    isTotalAssets?: boolean
  }>(),
  {
    isTopTabs: false,
    isTotalAssets: false,
    isMain: false,
    id: null,
  },
)

const CHART_ID = 'chart-fund'

let CHART_INSTANCE: any = null

const tabs = ref([
  {
    title: '7d',
    info: 'Past 7 Days',
    unit: 'day',
    value: 7,
    requestType: 'daily',
    data: [],
  },
  {
    title: '1m',
    info: 'Past month',
    unit: 'month',
    value: 1,
    requestType: 'daily',
    data: [],
  },
  {
    title: '6m',
    info: 'Past 6 months',
    unit: 'month',
    value: 6,
    requestType: 'monthly',
    data: [],
  },
  {
    title: '1y',
    info: 'Past year',
    unit: 'year',
    value: 1,
    requestType: 'monthly',
    data: [],
  },
  {
    title: 'ALL Live',
    info: 'Since Jan 2023',
    requestType: 'monthly',
    data: [],
  },
])

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
const currentTab = ref(tabs.value[tabs.value.length - 1])

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
      display: false,
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

const changeChartData = (tab, requestType = 'monthly') => {

  if (CHART_INSTANCE) {
    CHART_INSTANCE.data.datasets[0].data = tab.map((item) => Number(item.amount))
    CHART_INSTANCE.data.labels = tab.map((item, index : number) => {
    if (props.isTotalAssets) {
      return $app.filters.dayjs(item?.created_at)?.format('MMM YYYY')
    } else {
      if (requestType === 'daily') {
        return $app.filters.dayjs(item?.created_at)?.format('D.MM')
      } else if (requestType === 'year') {
        return $app.filters.dayjs(item?.created_at)?.format('YYYY')
      } else {
        return $app.filters.dayjs(item?.created_at)?.format('MMM YYYY')
      }
    }
    })
    CHART_INSTANCE.update()
  }
}

const getStatistics = async (tab?: any) => {
  if (tab) {
    currentTab.value = tab
  } else {
    currentTab.value = tabs.value[tabs.value.length - 1]
  }
  const requestPayload: any = {filters: {}}

  if (props.id) {
    requestPayload.filters.asset_uuid = props.id
  }

  if (tab?.unit) {
    requestPayload.filters.period_to = $app.filters.dayjs().format('YYYY-MM-DD')
    requestPayload.filters.period_from = $app.filters.dayjs().subtract(tab.value, tab.unit).format('YYYY-MM-DD')
  }

  if (tab?.type === 'ytd') {
    requestPayload.filters.period_to = $app.filters.dayjs().format('YYYY-MM-DD')
    requestPayload.filters.period_from = $app.filters.dayjs().startOf('year').format('YYYY-MM-DD')
  }
  let response
  if (tab?.requestType) {
    response = props.isTotalAssets ? await $app.api.eth.statisticEth.getAssetsFund(requestPayload) : await $app.api.info.statistic.getAssetsStat(requestPayload, tab?.requestType)
  } else {
    response = props.isTotalAssets ? await $app.api.eth.statisticEth.getAssetsFund(requestPayload)  : await $app.api.info.statistic.getAssetsStat(requestPayload)
  }


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

  let data = response.data
  if (tab?.title === '7d'){
    data = data.filter((item, index) => !(index % 2))
  }
  if (tab?.title === '1m') {
    data = data.filter((item, index) => index === 0 || index === data.length - 1 || index === 13 || index === 20)
  }
  if (tab?.title === '6m') {
    data = data.filter((item, index) => index === 0 || index === data.length - 1 || index === 1 || index === 3)
  }
  if (tab?.title === '1y') {
    if (data.length > 4) {
      data = data.filter((item) => item.amount != 0)
      data = data.filter((item, index) => index === 0 || index === data.length - 1 || index === 4 || index === 8)
    }
  }

  if (tab === undefined || tab?.title === 'ALL Live') {
    if (data.length > 4) {
      data = data.filter((item) => item.amount != 0)
      data = data.filter((item, index) => index === 0 || index === data.length - 1 || index === 4 || index === 8)
    }
  }
  let sortedData = data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
  sortedData = sortedData.filter((item) => item.amount != 0)
  changeChartData(sortedData, tab?.requestType)
}

onMounted(async () => {
  const chartStatus = Chart.getChart(CHART_ID) // <canvas> id

  if (!chartStatus) {
    Chart.defaults.font.size = 10
    Chart.defaults.font.family = 'Caption'
    Chart.defaults.font.weight = 'bold'
    Chart.defaults.color = '#888CA0'

    const ctx = document.getElementById(CHART_ID);

    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 145);
    gradient.addColorStop(0, 'rgba(0, 102, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 102, 255, 0.1)');

    const config = {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            borderColor: '#4D94FF',
            borderWidth: 1,
            tension: 0.4,
            fill: true,
            backgroundColor: gradient,
            pointRadius: 10,
            pointBackgroundColor: 'transparent',
            pointBorderColor: 'transparent',
            drawActiveElementsOnTop: true
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            position: 'center',
            align: 'center',
            tooltip: {
              intersect: false,
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false, // Убираем отображение сетки по оси X
            },
          },
          y: {
            display: false, // Убираем отображение сетки и лейблов по оси Y
          },
        },
        interaction: {
          intersect: false,
        },
        elements: {
          point: {
            radius: 5,
          },
        },
      },
      plugins: [],
    }


    CHART_INSTANCE = new Chart(ctx, config)
    await getStatistics()
  }
})
</script>

<style src="./w-chart-fund.scss" lang="scss"/>
