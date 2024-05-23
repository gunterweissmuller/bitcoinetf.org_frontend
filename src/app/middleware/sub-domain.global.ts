import { useNuxtApp, defineNuxtRouteMiddleware, useRouter } from '#imports'
import { useRuntimeConfig } from 'nuxt/app';

export default defineNuxtRouteMiddleware((to, from) => {
  const router = useRouter()
  const { $app } = useNuxtApp()
  const config = useRuntimeConfig()

  const excludedRouteNames = ['personal-login', 'personal-registration', 'personal-reset', 'personal-verify-email', 'personal-login-one-time']
  const includedRouteMask = to.path.includes('personal')
  const tokens = $app.store.auth.getTokens;
  //config.public.DOMAIN = 'localhost';
  //config.public.APP_DOMAIN = 'app.localhost'

  if(!process.dev) {
    /*if(window.location.hostname === config.public.APP_DOMAIN && to.path === '/') {
      const newUrl = `http://${config.public.DOMAIN}${to.path}`
      window.location.href = newUrl;
    } else*/

    // $app.store.purchase.type = selectedCurrency.value.value;
    // $app.store.purchase.amount = investmentAmount.value;
    // $app.store.purchase.amountUS = investmentAmount.value;

    if (window.location.hostname === config.public.DOMAIN && includedRouteMask && !excludedRouteNames.includes(to.name) && to.path !== '/redirect') {
      let newUrl = `https://${config.public.APP_DOMAIN}${to.path}?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}&websocketToken=${tokens.websocketToken}`

      if ($app.store.purchase.type) {
        newUrl += "&purchaseType=" + $app.store.purchase.type;
      }

      if ($app.store.purchase.amountUS) {
        newUrl += "&amount=" + $app.store.purchase.amountUS;
      }

      window.location.href = newUrl;
      return abortNavigation()
      //return navigateTo({path: '/redirect'})
    } else if (window.location.hostname === config.public.APP_DOMAIN && (!includedRouteMask || excludedRouteNames.includes(to.name)) && to.path !== '/redirect') {
      const newUrl = `https://${config.public.DOMAIN}${to.path || from}?theme=${localStorage.getItem('theme') || 'dark'}`
      window.location.href = newUrl;
      return abortNavigation()
      //return navigateTo({path: '/redirect'})
    }
  }
})
