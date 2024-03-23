<template>
  <div class="w-chart-shareholders" v-show="(props.left && props.right) || (props.strategies.length && props.strategies)">
    <div class="w-chart-shareholders__title">
      <a-live />

      <div class="w-chart-shareholders__title--name">
        {{ props.title }}
      </div>
    </div>

    <div class="w-chart-shareholders__strategies">
      <div class="w-chart-shareholders__strategies--names">
        <div
          class="w-chart-shareholders__strategies--name"
          v-for="strategy in strategies"
          :key="strategy.name"
        >
          <a-icon :name="strategy.icon" />
          <div class="w-chart-shareholders__strategies--text">
            {{ strategy.name }}
          </div>
        </div>
      </div>

      <div class="w-chart-shareholders__percentbar">
        <div class="w-chart-shareholders__percentbar--bar">
          <div
            class="w-chart-shareholders__percentbar--line"
            v-for="strategy in strategies"
            :style="{ 'width': strategy.percent + '%', 'background': strategy.color }"
            :key="strategy.name"
          ></div>
        </div>

        <div class="w-chart-shareholders__percentbar--percentes">

          <div
            class="w-chart-shareholders__percentbar--percent"
            v-for="strategy in strategies"
            :key="strategy.name"
            :style="{ 'color': strategy.color }"
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

interface Strategy {
  name: string;
  icon: string;
  percent: number;
  color: string;
}

const props = withDefaults(
  defineProps<{
    title?: string,
    left?: Strategy,
    right?: Strategy,
    strategies?: Strategy[]
  }>(),
  {
    title: 'Investment Strategies'
  },
)

const strategies = computed(() => props.strategies || [ props.left, props.right ]);
</script>

<style src="./w-chart-shareholders.scss" lang='scss'></style>
