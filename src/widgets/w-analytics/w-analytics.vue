<template>
  <div class="w-analytics page-max-width--big">
    <!--    <e-analytics-tabs v-model:active-tab="activeTab" :tab-bars="tabsList" />-->
    <keep-alive>
      <component
        v-if="activeComponent"
        :is="activeComponent.component"
        :key="`active-tab-route-${route.name}`"
      />
    </keep-alive>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import EAnalyticsTabs from '~/src/features/e-analytics-tabs/e-analytics-tabs.vue'

const route = useRoute()

interface ITabsItem {
  text: string
  name: string
}

const tabsList = ref<ITabsItem[]>([
  { text: 'Performance', name: 'personal-performance' },
  { text: 'Portfolio', name: 'personal-portfolio' },
  { text: 'Fund', name: 'personal-fund' },
])

const activeTab = ref<string>('performance')

const performance = defineAsyncComponent(() => import('~/src/widgets/w-performance/w-performance.vue'))
const portfolio = defineAsyncComponent(() => import('~/src/widgets/w-portfolio/w-portfolio.vue'))
const fund = defineAsyncComponent(() => import('~/src/widgets/w-fund/w-fund.vue'))

const components = {
  'personal-performance': {
    id: 'performance',
    component: performance,
  },
  'personal-portfolio': {
    id: 'portfolio',
    component: portfolio,
  },
  'personal-fund': {
    id: 'fund',
    component: fund,
  },
}

const activeComponent = computed(() => components[route.name])
</script>

<style src="./w-analytics.scss" lang="scss" />
