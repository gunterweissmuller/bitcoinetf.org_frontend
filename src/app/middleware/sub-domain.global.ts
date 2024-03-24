import { useNuxtApp, defineNuxtRouteMiddleware, useRouter } from '#imports'
import { useRuntimeConfig } from 'nuxt/app';

export default defineNuxtRouteMiddleware((to) => {
  const router = useRouter()
  const { $app } = useNuxtApp()
  const config = useRuntimeConfig()

  const excludedRouteNames = ['personal-login', 'personal-registration', 'personal-reset', 'personal-purchaseb']
  const includedRouteMask = to.path.includes('personal')
  const tokens = $app.store.auth.getTokens;
  //config.public.DOMAIN = 'localhost';
  //config.public.APP_DOMAIN = 'app.localhost'

  if(!process.dev && false) {
    /*if(window.location.hostname === config.public.APP_DOMAIN && to.path === '/') {
      const newUrl = `http://${config.public.DOMAIN}${to.path}`
      window.location.href = newUrl;
    } else*/
    console.log('DOMAIN', config.public.DOMAIN)
    console.log('APP_DOMAIN', config.public.APP_DOMAIN)
    if (window.location.hostname === config.public.DOMAIN && includedRouteMask && !excludedRouteNames.includes(to.name)) {
      const newUrl = `http://${config.public.APP_DOMAIN}${to.path}?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}&websocketToken=${tokens.websocketToken}`
      console.log(newUrl)
      window.location.href = newUrl;
    } else if (window.location.hostname === config.public.APP_DOMAIN && (!includedRouteMask || excludedRouteNames.includes(to.name))) {
      const newUrl = `http://${config.public.DOMAIN}${to.path}`
      console.log(newUrl)
      window.location.href = newUrl;
    }
  }
})
