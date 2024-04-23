import {useNuxtApp, useRouter} from '#app'

export default defineNuxtRouteMiddleware((to) => {
  const {$app} = useNuxtApp()
  const router = useRouter()
  const excludedRouteNames = ['personal-login', 'personal-registration', 'personal-reset']
  const includedRouteMask = to.path.includes('personal')
  const urlParams = new URLSearchParams(window.location.search);
  if(to.query.accessToken) {
    $app.store.auth.setTokens({
      access_token: urlParams.get('accessToken'),
      refresh_token: urlParams.get('refreshToken'),
      websocket_token: urlParams.get('websocketToken')
    });

    if(to.query.purchaseType) {
      $app.store.purchase.type = urlParams.get('purchaseType');
    }

    if(to.query.amount) {
      $app.store.purchase.amount = urlParams.get('amount');
      $app.store.purchase.amountUS = urlParams.get('amount');
    }

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

  if(to.query.logout || to.query.theme) {
    if(to.query.logout) {
      $app.store.auth.logout()
    }

    if(to.query.theme) {
      localStorage.setItem('theme', to.query.theme)
      document.body.dataset.theme = to.query.theme
      $app.store.user.theme = to.query.theme
    }
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
