import {useNuxtApp, useRouter} from '#app'

export default defineNuxtRouteMiddleware((to) => {
  const {$app} = useNuxtApp()
  const router = useRouter()
  const excludedRouteNames = ['personal-login', 'personal-registration', 'personal-reset']
  const includedRouteMask = to.path.includes('personal')
  console.log(to);
  const urlParams = new URLSearchParams(window.location.search);
  if(to.query.accessToken) {
    $app.store.auth.setTokens({
      access_token: urlParams.get('accessToken'),
      refresh_token: urlParams.get('refreshToken'),
      websocket_token: urlParams.get('websocketToken')
    });
    //router.replace({ path: to.path, query: {} })
    $app.api.eth.auth.getUser().then((resp) => {
      $app.store.user.info = resp?.data
    })
    $app.api.info.blockchainProxy.getUserBlockchainWallet().then((resp) => {
      $app.store.user.blockchainUserWallet = resp?.data.uid
    })
    return navigateTo({path: to.path}, {replace: true})
    //router.replace({ query: {} })
    //window.location.search = '';
  }

  if(to.query.logout) {
    $app.store.auth.logout()
    return navigateTo({path: to.path}, {replace: true})
    //router.replace({ path: to.path, query: {} })
  }


  if (!excludedRouteNames.includes(to.name) && includedRouteMask && !$app.store.auth.isUserAuthenticated) {
    return navigateTo({name: 'personal-login'})
  }

  if (excludedRouteNames.includes(to.name) && $app.store.auth.isUserAuthenticated) {
    return navigateTo({name: 'personal-analytics'})
  }


  if (includedRouteMask && $app.store.auth.isUserAuthenticated) {
    if (to.name === 'personal-analytics') {
      return navigateTo({name: 'personal-performance'})
    }
    if (to.name === 'personal-wallet') {
      return navigateTo({name: 'personal-dividends'})
    }
  }
})
