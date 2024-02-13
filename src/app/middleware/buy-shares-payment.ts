import { useNuxtApp, defineNuxtRouteMiddleware, useRouter } from '#imports'

export default defineNuxtRouteMiddleware((to) => {
  const router = useRouter()
  const { $app } = useNuxtApp()
  if (to.name === 'personal-buy-shares-payment' && !$app.store.user.buyShares) {
    return router.push({ name: 'personal-buy-shares' })
  }
})
