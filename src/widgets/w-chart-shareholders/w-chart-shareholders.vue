<template>
  <div class="w-chart-shareholders" :class="{ desktop: props.isDesktop }" v-show="strategiesData && strategiesData.length">
    <div class="w-chart-shareholders__title">
      <a-live />

      <div class="w-chart-shareholders__title-name">
        {{ props.title }}
      </div>
    </div>

    <div class="w-chart-shareholders__strategies">
      <div class="w-chart-shareholders__strategies-names">
        <div
          class="w-chart-shareholders__strategies-name"
          v-for="strategy in strategies"
          :key="strategy.name"
        >
          <a-icon :width="props.isDesktop ? 32 : 24" v-show="strategy.icon" :name="strategy.icon ?? ''" />
          <div class="w-chart-shareholders__strategies-text">
            {{ strategy.name }}
          </div>
        </div>
      </div>

      <div class="w-chart-shareholders__percentbar">
        <div class="w-chart-shareholders__percentbar-bar">
          <div
            class="w-chart-shareholders__percentbar-line"
            :class="{ 'is-null': strategy.color === null }"
            v-for="strategy in strategies"
            :style="{ 'width': strategy.percent + '%', 'background': strategy.color ?? '' }"
            :key="strategy.name"
          ></div>
        </div>

        <div class="w-chart-shareholders__percentbar-percentes">

          <div
            class="w-chart-shareholders__percentbar-percent"
            :class="{ 'is-null': strategy.color === null }"
            v-for="strategy in strategies"
            :key="strategy.name"
            :style="{ 'color': strategy.color ?? '' }"
          >
            {{ strategy.percent }}% of Investors
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import ALive from '~/src/shared/ui/atoms/a-live/a-live.vue';
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue';
import {useNuxtApp} from '#app';

const { $app } = useNuxtApp();

interface Strategy {
  name: string;
  percent: number;
  icon: string | null;
  color: string | null;
}

const props = withDefaults(
  defineProps<{
    title: string,
    strategies: Strategy[],
    isDesktop: boolean
  }>(),
  {
    title: 'Investment Strategies',
    isDesktop: false
  },
);

const getStrategies = async () => {
  $app.api.eth.statisticEth.getStrategies()
    .then((data : Strategy[] | undefined) => {
      strategiesData.value = data ? data : [];
    })
    .catch(() => {
      strategiesData.value = [];
    });
}

const strategiesData = ref<Strategy[]>([]);

const strategies = computed<Strategy[]>(() => {
  return strategiesData.value
    .map( (strategy : Strategy) => {
      const newStrategy = props.strategies.find((el : Strategy) => el.name === strategy.name);

      if (newStrategy) {
        newStrategy.percent = strategy.percent;
        return newStrategy;
      }
      return Object.assign(strategy, {
        icon: null,
        color: null
      });
    })
});

onMounted(() => {
  getStrategies();
});
</script>

<style src="./w-chart-shareholders.scss" lang='scss'></style>
