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
          :style="{ visibility: [ 'shareholders', 'asset' ].includes(props.type) ? 'hidden' : '' }"
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

          </template>
        </a-tooltip-info>

      </div>

      <div class="w-chart-fund__head">
        <div class="w-chart-fund__titles">
          <!-- assets -->
          <div
            v-if="!!assetsStatistic && props.type === 'assets'"
            class="w-chart-fund__titles-title"
          >
            ${{$app.filters.rounded(totalAmountUsdComp, 0)}}
          </div>

          <!-- asset -->
          <div
            v-if="!!assetStatistic && props.type === 'asset'"
            class="w-chart-fund__titles-title"
          >
          ${{$app.filters.rounded(dataAmount, 0)}}
          </div>

          <!-- shareholders -->
          <div
            v-if="!!shareholdersStatistic && props.type === 'shareholders'"
            class="w-chart-fund__titles-title"
          >
            {{ dataAmount }} Shareholders
          </div>
        </div>

        <!-- assets -->
        <div
          v-if="!!assetsStatistic && props.type === 'assets'"
          :class="['w-chart-fund__info', { 'w-chart-fund__info--danger': amountUsdDifference < 0 }]"
        >
          <div
            :class="['w-chart-fund__info-difference', { 'w-chart-fund__info-difference--danger': amountUsdDifference < 0 }]"
          >
            {{ amountUsdDifference > 0 ? '+' : '' }} ${{ $app.filters.rounded(amountUsdDifference, 2) }} ({{
              $app.filters.rounded(assetsStatistic?.percent_aum, 2)
            }}%)
          </div>
        </div>

        <!-- asset -->
        <div
          v-if="!!assetStatistic && props.type === 'asset'"
          :class="['w-chart-fund__info']"
        >
          <div class="w-chart-fund__info-convert">
            <a-icon
              width='11'
              height='11'
              class='w-chart-fund__caption-icon'
              :class="{ 'bitcoin' : orderType !== 'usdt', 'usdt' : orderType === 'usdt' }"
              :name="(orderType === 'usdt' ? Icon.ColorfulAssetUsd : Icon.MonoBitcoinB)"
            />
            <div class="w-chart-fund__info-text">
              {{$app.filters.rounded(((dataAmount ?? 0)) / (orderType === 'usdt' ? 1 : btcPrice), 0)}}
            </div>
          </div>
        </div>

        <!-- shareholders -->
        <div
          v-if="!!shareholdersStatistic && props.type === 'shareholders'"
          :class="['w-chart-fund__info', { 'w-chart-fund__info--danger': !shareholdersStatistic?.is_growth }]"
        >
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
import { IAsset } from '~/src/shared/types/global';

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

interface AssetsStatistic {
  is_growth_aum: boolean;
  percent_aum: number;
  half_year_change_size_usd_aum: number;
}

interface AssetStatistic {
  is_growth: boolean;
  percent: number;
  half_year_change_size_usd: number;
}

const { $app } = useNuxtApp();

type ChartType = 'assets' | 'shareholders' | 'asset';

const props = withDefaults(
  defineProps<{
    id?: string | null
    title: string
    isMain: boolean
    isTotalAssets?: boolean
    aumSizeUsd?: boolean
    type: ChartType,
    asset: IAsset,
  }>(),
  {
    isTotalAssets: false,
    isMain: false,
    id: null,
    type: 'assets',
    aumSizeUsd: false,
  },
);

const btcPrice = computed(() => $app.store.user?.statistic?.btc_price);
const orderType = computed(() => $app.store.user?.info?.account?.order_type || 'init_btc');

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

const dataAmount = ref<number | null>(null);

const shareholdersStatistic = ref<SharehodlersStatistic | null>(null);
const assetsStatistic = ref<AssetsStatistic | null>(null);
const assetStatistic = ref<AssetStatistic | null>(null);

const tooltipText: Record<ChartType, string> = {
  'assets': 'AUM = Assets under management.',
  'shareholders': '',
  'asset': 'Value'
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
  // shareholders, assets
  if (['shareholders', 'assets'].includes(props.type)) {
    response = await $app.api.eth.statisticEth.getShareholdersGrowth();

    const statisticField = props.type === 'shareholders' ? 'shareholders' : 'aum_size_usd';
    dataAmount.value = response.find((item: Record<string, any>) => item.shareholders)[statisticField];
    shareholdersStatistic.value = response.find((item: Record<string, any>) => item.percent);
    assetsStatistic.value = response.find((item: Record<string, any>) => item.percent_aum);

    if (statisticField === 'shareholders') {
      $app.store.user.totalFund.shareholders = dataAmount.value;
    } else {
      $app.store.user.totalFund.totalAmountUsd = dataAmount.value;
    }
    $app.store.user.totalFund.differenceUsd = assetsStatistic.value?.half_year_change_size_usd_aum;

    const valueType = props.type === 'shareholders' ? 'y' : 'aum_size_';
    data = response.filter((item : Record<string, any>) => !item.shareholders && !item.percent && !item.percent_aum);
    data = data.map((item : Record<string, any>, index : number) : DataItem => ({
      amount: item[`${valueType}${index}`],
      created_at: new Date(`2 ${item["x"+index]}`).toISOString().replace(/T.*/, ''),
      label: item[`x${index}`]
    }));

  // asset
  } else if (['asset'].includes(props.type)) {
    const { data: { flow: responseData } } = await $app.api.eth.statisticEth.getStatisticFlow({ asset: props.asset });
    response = responseData;

    dataAmount.value = response.find((item: Record<string, any>) => item.value).value;

    assetStatistic.value = response.find((item: Record<string, any>) => item.percent);

    data = response.filter((item : Record<string, any>) => !item.shareholders && !item.percent && !item.value && !item.percent_aum);
    data = data.map((item : Record<string, any>, index : number) : DataItem => ({
      amount: item[`y${index}`],
      created_at: new Date(`2 ${item["x"+index]}`).toISOString().replace(/T.*/, ''),
      label: item[`x${index}`]
    }));

  // xz che
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
            borderColor: '#0066ff', // '#4D94FF'
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
