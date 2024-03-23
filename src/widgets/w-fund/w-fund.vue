<template>
  <div class="w-fund page-max-width--big">
    <keep-alive>
      <component v-if="activeComponent" :is="activeComponent.component" />
    </keep-alive>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()

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

const activeComponent = computed(() => components[route.name]);

// BUG: если пользователь не авторизирован, при router before открывается auth page и после авторизации кидает на старые страницы (analytics)
</script>

<style src="./w-fund.scss" lang="scss" />
