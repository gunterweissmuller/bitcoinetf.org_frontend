import {useNuxtApp, useRouter} from '#app'

export default defineNuxtRouteMiddleware((to) => {
  const {$app} = useNuxtApp();
  const assets = () => {
    return $app.store.assets.items.filter((item) => item?.symbol !== 'VAULT')
  };
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
    return navigateTo({name: 'personal-fund'})
  }


  if (includedRouteMask && $app.store.auth.isUserAuthenticated) {
    if (to.name === 'personal-fund') {
      return navigateTo({name: 'personal-portfolio'})
    }
    // if (to.name === 'personal-assets') {
    //   return navigateTo({name: 'personal-assets-symbol', params: { symbol: assets()[0]?.symbol.toLowerCase() ?? 'baa' }})
    // }
    if (to.name === 'personal-wallet') {
      return navigateTo({name: 'personal-dividends'})
    }
  }
})
