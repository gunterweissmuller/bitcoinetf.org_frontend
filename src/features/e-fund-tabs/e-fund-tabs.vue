<template>
  <div v-if="!(isDesktop || isLaptop)" class="e-fund-tabs" :class="[{'e-fund-tabs__wallet' : route.path.includes('wallet')}]">
    <div class="e-fund-tabs__list" :style="`grid-template-columns: repeat(${tabBars.length}, 1fr);`">
      <nuxt-link
        v-for="(tab, idx) in tabBars"
        :key="idx"
        :id="`${tab.name}-tab-mobile`"
        :to="{ name: tab.name }"
        :class="[
          'e-fund-tabs__item',
          { 'e-fund-tabs__item--active': tab.name === tabBars[activeTabIndex]?.name },
        ]"
      >
        {{ tab.text }}
      </nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import useMediaDevice from '~/composables/useMediaDevice'
import { useRoute } from 'vue-router'

const route = useRoute()

interface ITabsItem {
  text: string
  name: string
}

const props = defineProps<{
  tabBars: ITabsItem[]
}>()

const { isLaptop, isDesktop } = useMediaDevice()

const activeTabIndex = computed<number>(() => {
  const index = props.tabBars.findIndex((tab) => tab.name === route.name)
  return ~index ? index : -1
})
</script>

<style src="./e-fund-tabs.scss" scoped lang="scss" />
