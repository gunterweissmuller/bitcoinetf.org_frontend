<template>
  <div class="w-fund page-max-width--big">
    <keep-alive :key="activeComponent.id">
      <component v-if="activeComponent" :is="activeComponent.component" />
    </keep-alive>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useMediaDevice from '~/composables/useMediaDevice';
import { Breakpoints } from '~/src/shared/constants/breakpoints';

const {$app} = useNuxtApp()
const route = useRoute();
const router = useRouter();
const { isLaptop, isDesktop } = useMediaDevice();
const { width } = useWindowSize()

const fundTablet = defineAsyncComponent(() => import('~/src/widgets/w-fund-tablet/w-fund-tablet.vue'));
const protection = defineAsyncComponent(() => import('~/src/widgets/w-protection/w-protection.vue'));
const portfolio = defineAsyncComponent(() => import('~/src/widgets/w-portfolio/w-portfolio.vue'));
const shareholders = defineAsyncComponent(() => import('~/src/widgets/w-shareholders/w-shareholders.vue'));

const components = {
  'personal-fund': {
    id: 'fund-tablet',
    component: fundTablet,
  },
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

const activeComponent = computed(() => isLaptop.value || isDesktop.value ? components['personal-fund'] : components[route.name]);

watch(width, (newWidth : number, oldWidth : number) => {
  if (!Object.keys(components).includes(route.name as string)) return;
  if ((newWidth < Breakpoints.Laptop && oldWidth < Breakpoints.Laptop) || (newWidth >= Breakpoints.Laptop && oldWidth >= Breakpoints.Laptop)) return;
  if (newWidth >= Breakpoints.Laptop) navigateTo({ name: 'personal-fund' });
  if (newWidth < Breakpoints.Laptop) navigateTo({ name: 'personal-portfolio' });
})

onMounted(() => {
  const action = route.query?.action
  const actionsCallback = {
    'open-purchase-modal': () => {
      $app.store.user.isInvestModalShow.show = true
      router.replace({name:'personal-fund'})
    },
    'open-buy-shares': () => {
      router.replace({name: 'personal-buy-shares'})
    },
    'use-discount': () => {
      $app.store.purchase.setInitialDiscount(true)
      router.push('/personal/buy-shares');
    }
  } 
  const checkActionToCallback = Object.keys(actionsCallback).find(callback => callback == action)

  if (action && checkActionToCallback){
    actionsCallback[action as string]()
  }
})
</script>

<style src="./w-fund.scss" lang="scss" />
