import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  routes: (_routes) => [
    {
      name: 'login',
      path: '/login',
      component: () => import('~/pages/login.vue'),
    }
  ],
}
