<template>
  <div class="w-chart-buy-shares">
    <div class="w-chart-buy-shares__head">
      <!--      <div class="w-chart-buy-shares__head-title">Compound Growth</div>-->
      <!--      <div class="w-chart-buy-shares__head-subtitle">Of your ETF shares with Bitcoin-Indexed Interest</div>-->
      <div class="w-chart-buy-shares__head-item" id="buy-shares-daily">
        <div class="w-chart-buy-shares__head-item-title">DAILY DIVIDENDS</div>
        <div class="w-chart-buy-shares__head-item-sum">${{ $app.filters.rounded(dailyDividends, 2) }}</div>
        <div class="w-chart-buy-shares__head-item-text">{{ currentChartData?.text }}</div>
      </div>
      <div class="w-chart-buy-shares__head-item" id="buy-shares-total">
        <div class="w-chart-buy-shares__head-item-title">TOTAL DIVIDENDS</div>
        <div class="w-chart-buy-shares__head-item-sum">${{ $app.filters.rounded(totalDividends, 2) }}</div>
        <div class="w-chart-buy-shares__head-item-text">{{ currentChartData?.text }}</div>
      </div>
    </div>
    <div class="w-chart-buy-shares__wrap">
      <div class="w-chart-buy-shares__subhead">
        <div class="w-chart-buy-shares__projected">
          <div class="w-chart-buy-shares__projected-title">{{ currentChartData?.text }} total value</div>
          <div class="w-chart-buy-shares__projected-usd">${{ $app.filters.rounded(resultSumUsd, 2) }}</div>
          <!--          <div class="w-chart-buy-shares__projected-btc">-->
          <!--            {{ $app.filters.convertValue($app.filters.rounded(resultSumBtc, 5)) }}-->
          <!--          </div>-->
        </div>
        <div class="w-chart-buy-shares__origin">
          <div class="w-chart-buy-shares__origin-title">{{ currentChartData?.text }} APY</div>
          <div class="w-chart-buy-shares__origin-amount">
            {{ currentApy }}%{{ isApplyRefCode && currentChartData.type === 'guaranteed' ? '*' : '' }}
          </div>
        </div>
      </div>
      <div class="w-chart-buy-shares__chart">
        <canvas :id="CHART_ID"></canvas>
      </div>
    </div>
    <div class="w-chart-buy-shares__tabs">
      <div
        :class="[
          'w-chart-buy-shares__tab',
          { 'w-chart-buy-shares__tab--active': tabs?.[0]?.title === currentChartData?.title },
        ]"
        @mousedown="changeChartData(tabs?.[0])"
        @mouseup="changeChartData(tabs?.[1])"
        @touchstart="changeChartData(tabs?.[0])"
        @touchend="changeChartData(tabs?.[1])"
      >
        <div class="w-chart-buy-shares__apy">
          <m-popper hover :title="guaranteedApyPopper.title" :text="guaranteedApyPopper.text">
            <a-icon class="w-chart-buy-shares__apy-icon" width="16" height="16" :name="Icon.MonoInfo" />
          </m-popper>

          <div class="w-chart-buy-shares__apy-text">{{ tabs?.[0]?.title }}</div>
        </div>
      </div>
    </div>
    <!--    <div class="w-chart-buy-shares__info">-->
    <!--      <div class="w-chart-buy-shares__item">-->
    <!--        <div class="w-chart-buy-shares__item-title">DAILY DIVIDENDS</div>-->
    <!--        <div class="w-chart-buy-shares__item-sum">${{ $app.filters.rounded(dailyDividends, 2) }}*</div>-->
    <!--        <div class="w-chart-buy-shares__item-text">{{ currentChartData?.text }}</div>-->
    <!--      </div>-->
    <!--      <div class="w-chart-buy-shares__item">-->
    <!--        <div class="w-chart-buy-shares__item-title">TOTAL DIVIDENDS</div>-->
    <!--        <div class="w-chart-buy-shares__item-sum">${{ $app.filters.rounded(totalDividends, 2) }}</div>-->
    <!--        <div class="w-chart-buy-shares__item-text">{{ currentChartData?.text }}</div>-->
    <!--      </div>-->
    <!--      <div class="w-chart-buy-shares__item">-->
    <!--        <div class="w-chart-buy-shares__item-title">APY</div>-->
    <!--        <div class="w-chart-buy-shares__item-sum">-->
    <!--          {{ currentApy }}%{{ userInfo?.account?.increased && currentChartData.type === 'guaranteed' ? '**' : '' }}-->
    <!--        </div>-->
    <!--        <div class="w-chart-buy-shares__item-text">{{ currentChartData?.text }}</div>-->
    <!--      </div>-->
    <!--    </div>-->
    <div class="w-chart-buy-shares__footer">
      Paid in Bitcoin. Term: 1095 Days.<br>
      {{ isApplyRefCode && currentChartData.type === 'guaranteed' ? `*Guaranteed ${currentApy}% APY is an elevated promotional APY for the first 6 months of the investment period for the investors that used an eligible referral code.` : '' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import Chart from 'chart.js/auto'
import { Icon } from '~/src/shared/constants/icons'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import { useNuxtApp } from '#app'
import MPopper from '~/src/shared/ui/molecules/m-popper/m-popper.vue'
import { computed } from 'vue'

const CHART_ID = 'chart-buy-shares'

const { $app } = useNuxtApp()

const apyes = computed(() => {
  return $app.store.user.statistic
})

const props = withDefaults(
  defineProps<{
    modelValue: number
    switches: any
    wallets: any
    isApplyRefCode?: boolean
  }>(),
  {
    switches: null,
    wallets: null,
    isApplyRefCode: false,
    modelValue: 0,
  },
)

const tabs = ref([
  {
    title: 'Guaranteed APY',
    subTitle: 'Projected total value',
    text: 'Guaranteed',
    type: 'guaranteed',
    data: [],
  },
  {
    title: 'Projected APY',
    subTitle: 'Actual total value',
    text: 'Projected',
    type: 'projected',
    data: [],
  },
])

const guaranteedApyPopper = {
  title: 'Guaranteed APY',
  text: "Come rain or shine, this is the minimum APY you'll receive. It's our promise to you, independent of how the market performs. <br /><br />If you had an elevated promotional 19% APY rate, please note, that the guarantee for the elevated APY only extends to the first 6 months of your lockup period. The rest of the period, your APY is guaranteed at the standard 14% rate.",
}

const currentChartData = ref(tabs.value[1])

let CHART_INSTANCE: any = null

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
    labels: currentChartData.value.data.map((item) => item.date),
    datasets: [
      {
        data: currentChartData.value.data.map((item) => item.amount),
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
    projected: [],
    guaranteed: [],
  }
  const guaranteedApy = apyes.value?.minimal_apy
  const projectedApy = apyes.value?.projected_apy
  let projectedAmountUsd = props.modelValue
  let projectedAmountUsdStart = props.modelValue
  let guaranteedAmountUsd = props.modelValue
  let guaranteedAmountUsdStart = props.modelValue

  for (let i = 0; i < 4; i++) {
    const date = $app.filters.dayjs()
    if (i === 3) {
      dateList.push({ date: date.add(i, 'year').toDate(), type: 'main' })
    } else if (i) {
      dateList.push({ date: date.add(i, 'year').toDate(), type: 'main' })
    } else {
      dateList.push({ date: date.toDate(), type: 'main' })
    }
  }

  dateList.forEach(({ date, type, apy }, idx) => {
    if (type === 'main') {
      resultList.projected.push({
        date: $app.filters.dayjs(date).format('MM YYYY'),
        amount: idx !== 0 ? projectedAmountUsd + projectedAmountUsdStart * (projectedApy / 100) : projectedAmountUsd,
      })

      resultList.guaranteed.push({
        date: $app.filters.dayjs(date).format('MM YYYY'),
        amount:
          idx !== 0 ? guaranteedAmountUsd + guaranteedAmountUsdStart * (guaranteedApy / 100) : guaranteedAmountUsd,
      })

      if (idx !== 0) {
        guaranteedAmountUsd = guaranteedAmountUsd + guaranteedAmountUsdStart * (guaranteedApy / 100)
        projectedAmountUsd = projectedAmountUsd + projectedAmountUsdStart * (projectedApy / 100)
      }
    } else {
      resultList.projected.push({
        date: $app.filters.dayjs(date).format('MM YYYY'),
        amount:
          idx !== 0
            ? projectedAmountUsd + projectedAmountUsdStart * ((projectedApy - apy * 3) / 100)
            : projectedAmountUsd,
      })

      resultList.guaranteed.push({
        date: $app.filters.dayjs(date).format('MM YYYY'),
        amount:
          idx !== 0
            ? guaranteedAmountUsd + guaranteedAmountUsdStart * ((guaranteedApy - apy) / 100)
            : guaranteedAmountUsd,
      })
    }
  })
  tabs.value[0].data = resultList.guaranteed
  tabs.value[1].data = resultList.projected
}

const resultSumUsd = computed(() => {
  if (!currentChartData.value?.data?.length) {
    return 0
  }

  return currentChartData.value.data[currentChartData.value.data?.length - 1]?.amount
})

onMounted(() => {
  const chartStatus = Chart.getChart(CHART_ID) // <canvas> id

  if (!chartStatus) {
    Chart.defaults.color = '#FFFFFF99'
    const ctx = document.getElementById(CHART_ID)
    CHART_INSTANCE = new Chart(ctx, config)
  }
})

const dailyDividends = computed(() => {
  if (!apyes.value) return 0
  if (currentChartData.value.type === 'guaranteed') {
    return (props.modelValue * (apyes.value?.minimal_apy / 100)) / 365
  }
  if (currentChartData.value.type === 'projected') {
    return (props.modelValue * (apyes.value?.projected_apy / 100)) / 365
  }
})

const totalDividends = computed(() => {
  if (!resultSumUsd.value) return 0
  return resultSumUsd.value - props.modelValue
})

const currentApy = computed(() => {
  if (!apyes.value) {
    return 0
  }
  if (currentChartData.value.type === 'projected') {
    return apyes.value?.projected_apy
  }
  if (currentChartData.value.type === 'guaranteed') {
    return $app.store.user.info.account.increased ? apyes.value?.minimal_apy : props.isApplyRefCode ? apyes.value?.minimal_apy + 5 : apyes.value?.minimal_apy
  }
})

const userInfo = computed(() => {
  return $app.store.user.info
})

onMounted(() => {
  createChartData()
  changeChartData(tabs.value[1])
})

watch(
  [() => props.modelValue, () => props.switches],
  () => {
    createChartData()
    changeChartData(currentChartData.value)
  },
  {
    deep: true,
  },
)
</script>

<style src="./w-chart-buy-shares.scss" lang="scss" />
