<template>
  <div class="w-analytics page-max-width--big">
    <!--    <e-analytics-tabs v-model:active-tab="activeTab" :tab-bars="tabsList" />-->
    <keep-alive>
      <component v-if="activeComponent" :is="activeComponent.component" />
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
  { text: 'Protection', name: 'personal-protection' },
  { text: 'Portfolio', name: 'personal-portfolio' },
  { text: 'Shareholders', name: 'personal-shareholders' },
])

const activeTab = ref<string>('performance')

const protection = defineAsyncComponent(() => import('~/src/widgets/w-protection/w-protection.vue'))
const portfolio = defineAsyncComponent(() => import('~/src/widgets/w-portfolio/w-portfolio.vue'))
const shareholders = defineAsyncComponent(() => import('~/src/widgets/w-shareholders/w-shareholders.vue'))

const components = {
  'personal-portfolio': {
    id: 'portfolio',
    component: portfolio,
  },
  'personal-protection': {
    id: 'protection',
    component: protection,
  },
  'personal-shareholders': {
    id: 'shareholders',
    component: shareholders,
  },
}

const activeComponent = computed(() => components[route.name])
</script>

<style src="./w-fund.scss" lang="scss" />
