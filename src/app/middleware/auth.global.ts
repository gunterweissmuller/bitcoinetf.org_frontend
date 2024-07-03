import { useNuxtApp, useRouter } from '#app'
import useMediaDevice from '~/composables/useMediaDevice'
import { useAbility } from '@casl/vue'

export default defineNuxtRouteMiddleware((to) => {
  const {$app} = useNuxtApp();
  const router = useRouter()
  const { isLaptop, isDesktop } = useMediaDevice();
  const excludedRouteNames = ['personal-login', 'personal-registration', 'personal-reset', 'personal-verify-email', 'personal-login-one-time']
  const excludedRoutesForDemoUser = [
    'personal-portfolio',
    'personal-protection',
    'personal-shareholders',
    'personal-fund',
    'personal-assets',
    'personal-assets-symbol',
    'personal-analytics-performance-latest-trades',
    'personal-analytics-shareholders-latest-purchases',
    ...excludedRouteNames
  ]

  const fundRouteNames = [ 'personal-portfolio', 'personal-protection', 'personal-shareholders' ]
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
      $app.store.user.setUserInfo(resp?.data)
    })
    $app.api.info.blockchainProxy.getUserBlockchainWallet().then((resp) => {
      $app.store.user.blockchainUserWallet = resp?.data.uid
    })

    const route = {
      path: to.path,
      query: {}
    }

    const action = urlParams.get('action')
    
    if (action) {
      route.query = {
        action
      }
    }
   
    
    return navigateTo(route, {replace: true})
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
    let query = {}
    if (to.query?.action){
      query = {action: to.query?.action}
    }
    return navigateTo({path: to.path, query}, {replace: true})
  }

  const { can } = useAbility()

  if (
    !$app.store.auth.isUserAuthenticated &&
    can('readonly', 'demo') &&
    !excludedRoutesForDemoUser.includes(to.name) &&
    (to.name as string).includes('personal')
  ) {
    return navigateTo({ name: 'personal-login', query: {action: 'open-purchase-modal'} })
  }


   if (!excludedRouteNames.includes(to.name) && includedRouteMask && !$app.store.auth.isUserAuthenticated && !can('readonly', 'demo')) {
    return navigateTo({ name: 'personal-login', query: {action: 'open-purchase-modal'} })
  }

  if (excludedRouteNames.includes(to.name) && $app.store.auth.isUserAuthenticated) {
    return navigateTo({name: 'personal-portfolio'})
  }


  if (includedRouteMask && $app.store.auth.isUserAuthenticated) {
    if (fundRouteNames.includes(to.name) && (isLaptop.value || isDesktop.value)) {
      return navigateTo({name: 'personal-fund'})
    }
    if (to.name === 'personal-fund' && !(isLaptop.value || isDesktop.value)) {
      return navigateTo({name: 'personal-portfolio'})
    }
    if (to.name === 'personal-wallet') {
      return navigateTo({name: 'personal-dividends'})
    }
  }
})
