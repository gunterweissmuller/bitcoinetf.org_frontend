import {useNuxtApp} from '#app'

export default defineNuxtRouteMiddleware((to) => {
  const {$app} = useNuxtApp();
  const assets = () => {
    return $app.store.assets.items.filter((item) => item?.symbol !== 'VAULT')
  };
  const excludedRouteNames = ['personal-login', 'personal-registration', 'personal-reset', 'personal-purchaseb']
  const includedRouteMask = to.path.includes('personal')



  if (to.name === 'personal-purchaseb') {
    return navigateTo({name: 'personal-purchaseb'})
  }

  if (!excludedRouteNames.includes(to.name) && includedRouteMask && !$app.store.auth.isUserAuthenticated) {
    return navigateTo({name: 'personal-login'})
  }

  if (excludedRouteNames.includes(to.name) && $app.store.auth.isUserAuthenticated) {
    return navigateTo({name: 'personal-fund'})
  }


  if (includedRouteMask && $app.store.auth.isUserAuthenticated) {
    if (to.name === 'personal-fund') {
      return navigateTo({name: 'personal-portfolio'})
    }
    if (to.name === 'personal-assets') {
      return navigateTo({name: 'personal-assets-symbol', params: { symbol: assets()[0]?.symbol.toLowerCase() }})
    }
    if (to.name === 'personal-wallet') {
      return navigateTo({name: 'personal-dividends'})
    }
  }
})
