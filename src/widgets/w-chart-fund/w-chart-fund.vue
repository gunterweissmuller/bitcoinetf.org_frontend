<template>
  <div>
    <div id="fund-chart" :class="['w-chart-fund', { 'w-chart-fund--is-main': isMain }]">
      <div v-if="title" class="w-chart-fund__caption">
        <a-live class='w-chart-fund__caption-live' />
        <span class="w-chart-fund__caption-text">
          {{ title }}
        </span>
        <a-tooltip-info
          :caption="title"
          :style="{ visibility: props.type === 'shareholders' ? 'hidden' : '' }"
          position="left"
        >
          <template #button>
            <a-icon
              width='18'
              height='18'
              class='w-chart-fund__caption-icon'
              :name='Icon.MonoInfo'
            />
          </template>
          <template #text>
            {{ tooltipText[props.type] }}
          </template>
        </a-tooltip-info>

      </div>

      <div class="w-chart-fund__head">
        <div class="w-chart-fund__titles">
          <div class="w-chart-fund__titles-title" v-if="totalAmountUsdComp && props.type === 'assets'">
            ${{$app.filters.rounded(totalAmountUsdComp, 0)}}
          </div>
          <div class="w-chart-fund__titles-title" v-if="props.type === 'shareholders'">
            {{ shareholdersAmount }} Shareholders
          </div>
        </div>

        <div v-if="props.type === 'assets'" :class="['w-chart-fund__info', { 'w-chart-fund__info--danger': difference < 0 }]">
          <div
            :class="['w-chart-fund__info-difference', { 'w-chart-fund__info-difference--danger': difference < 0 }]"
          >
            {{ amountUsdDifference > 0 ? '+' : '' }} ${{ $app.filters.rounded(amountUsdDifference, 2) }} ({{
              $app.filters.rounded(difference, 2)
            }}%)
          </div>
        </div>

        <div v-else :class="['w-chart-fund__info', { 'w-chart-fund__info--danger': !shareholdersStatistic?.is_growth }]">
          <div :class="['w-chart-fund__info-difference', { 'w-chart-fund__info-difference--danger': !shareholdersStatistic?.is_growth }]">
            {{ shareholdersStatistic?.is_growth ? '+' : '-'}}${{ $app.filters.rounded(shareholdersStatistic?.half_year_change_size_usd, 2) }}
            ({{
              $app.filters.rounded(shareholdersStatistic?.percent, 2)
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
import { Icon } from '~/src/shared/constants/icons';
import ATooltipInfo from '~/src/shared/ui/atoms/a-tooltip-info/a-tooltip-info.vue';

const { $app } = useNuxtApp();

type ChartType = 'assets' | 'shareholders' | 'asset';

const props = withDefaults(
  defineProps<{
    id?: string | null
    title: string
    isMain: boolean
    isTotalAssets?: boolean
    type: ChartType
  }>(),
  {
    isTotalAssets: false,
    isMain: false,
    id: null,
    type: 'assets'
  },
);

// always unique id
const CHART_ID : string = `${getCurrentInstance()?.uid ?? Math.floor(Math.random() * 10**10)}`;

let CHART_INSTANCE: any = null;

const totalAmountBtc = ref(0);
const totalAmountUsd = ref(0);

const totalAmountUsdComp = computed(() => {
  return $app.store.user.totalFund?.totalAmountUsd > 0 ? $app.store.user.totalFund.totalAmountUsd : '';
});

const amountUsdDifference = computed(() => {
  return $app.store.user.totalFund?.differenceUsd || 0;
});

const difference = computed(() => {
  return $app.store.user.totalFund?.difference || 0;
});

const shareholdersAmount = ref<number | null>(null);
const shareholdersStatistic = ref<SharehodlersStatistic | null>(null);

const tooltipText: Record<ChartType, string> = {
  'assets': 'AUM = Assets under management.',
  'shareholders': '',
  'asset': ''
};

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

interface DataItem {
  amount: number;
  created_at: string;
  label: string;
}

interface SharehodlersStatistic {
  is_growth: boolean;
  percent: number;
  half_year_change_size_usd: number;
}

const changeChartData = (tabs : DataItem[]) => {
  if (CHART_INSTANCE) {
    CHART_INSTANCE.data.datasets[0].data = tabs.map((item : DataItem) => Number(item.amount));
    CHART_INSTANCE.data.labels = tabs.map((item : DataItem) => {
      return $app.filters.dayjs(item?.created_at)?.format('MMM YYYY');
    });
    CHART_INSTANCE.update();
  }
}

const getStatistics = async () => {
  let response;
  let data;
  if (props.type === 'shareholders') {
    response = await $app.api.eth.statisticEth.getShareholdersGrowth();

    shareholdersAmount.value = response.find((item: Record<string, any>) => item.shareholders).shareholders;
    shareholdersStatistic.value = response.find((item: Record<string, any>) => item.percent);

    data = response.filter((item : Record<string, any>) => !item.shareholders && !item.percent);
    data = data.map((item : Record<string, any>, index : number) : DataItem => ({
      amount: item[`aum_size_${index}`],
      created_at: new Date(`2 ${item["x"+index]}`).toISOString().replace(/T.*/, ''),
      label: item[`x${index}`]
    }));
  } else {
    const requestPayload: any = {filters: {}}

    if (props.id) {
      requestPayload.filters.asset_uuid = props.id;
    }

    response = props.isTotalAssets ? await $app.api.eth.statisticEth.getAssetsFund(requestPayload) : await $app.api.info.statistic.getAssetsStat(requestPayload);

    totalAmountBtc.value = response?.total_amount_btc;
    totalAmountUsd.value = response?.total_amount_usd;

    $app.store.user.totalFund = {
      totalAmountBtc: totalAmountBtc.value,
      totalAmountUsd: totalAmountUsd.value,
      dividendsUsd: response?.dividends_usd,
      dividendsBtc: response?.dividends_btc,
      allocation: response?.allocation,
      differenceUsd: response?.difference_usd,
      difference: response?.difference
    }

    data = response.data;

  }

  if (data.length > 4) {
    data = data.filter((item : DataItem) => item.amount != 0);
    data = data.filter((item  : DataItem, index : number) => index === 0 || index === data.length - 1 || index === 4 || index === 8);
  }

  let sortedData = data.sort((a : DataItem, b : DataItem) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  sortedData = sortedData.filter((item : DataItem) => item.amount != 0);
  changeChartData(sortedData);
}

onMounted(async () => {
  const chartStatus = Chart.getChart(CHART_ID); // <canvas> id

  if (!chartStatus) {
    Chart.defaults.font.size = 10;
    Chart.defaults.font.family = 'Caption';
    Chart.defaults.font.weight = 'bold';
    Chart.defaults.color = '#888CA0';

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
      options: options,
      plugins: [],
    }

    CHART_INSTANCE = new Chart(ctx, config);
    await getStatistics();
  }
})
</script>

<style src="./w-chart-fund.scss" lang="scss"/>
