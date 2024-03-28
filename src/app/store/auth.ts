import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import { SignupMethods } from '~/src/shared/constants/signupMethods';
import { useRuntimeConfig } from 'nuxt/app';

interface authState {
  accessToken: string,
    refreshToken: string,
    userAgent: string,
    websocketToken: string,
    refCode: string,
}

export const auth = defineStore('auth', {
  state: () => ({
    accessToken: '',
    refreshToken: '',
    userAgent: '',
    websocketToken: '',
    refCode: '',
  } as authState),

  actions: {
    setTokens(payload: { access_token: string; refresh_token: string; websocket_token: string }) {
      this.accessToken = payload.access_token
      this.refreshToken = payload.refresh_token
      this.websocketToken = payload.websocket_token
    },

    logout() {
      const config = useRuntimeConfig()
      this.accessToken = ''
      this.refreshToken = ''
      this.websocketToken = ''
      useNuxtApp().$app.store.user.buyShares = null
      useNuxtApp().$app.store.user.dividends = 0
      useNuxtApp().$app.store.user.lastPayment = null
      useNuxtApp().$app.store.persiste.latestTronCheckDate = null

      if(window.location.hostname === config.public.APP_DOMAIN) {
        const newUrl = `https://${config.public.DOMAIN}/personal/login?logout=1`
        window.location.href = newUrl;
      }

      //navigateTo({ name: 'personal-login' })
    },

    async refresh() {
      /*if (this.refreshToken) {
        const PREFIX = '/v1/'
        const REFRESH_URL = 'auth/token/refresh'

        try {
          const headers = new Headers()
          headers.set('accept', 'application/json')
          headers.set('content-type', 'application/json')

          const hostname = window.location.host === 'bitcoinetf.org' ? 'api.bitcoinetf.org' : 'api.stage.techetf.org'

          const res = await fetch(`https://${hostname}${PREFIX}${REFRESH_URL}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              refresh_token: this.refreshToken,
            }),
          })

          const refreshResponse = await res.json()

          this.accessToken = refreshResponse.data.access_token
          this.refreshToken = refreshResponse.data.refresh_token
          this.websocketToken = refreshResponse.data.websocket_token
        } catch (e) {
          console.error(`Error with token: ${e}`)
          this.logout()
          navigateTo({ name: 'personal-login' })
          // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject()
        }
      }*/
    },

    async reInitData() {
      const { $app } = useNuxtApp()
      await Promise.allSettled([
        // $app.api.info.fund
        //   .getAssets()
        //   .then((assetsResponse: any) => {
        //     $app.store.user.assets = assetsResponse.data.sort(function(a, b) {
        //       if (a.symbol > b.symbol) {
        //         return 1
        //       }
        //       if (a.symbol < b.symbol) {
        //         return -1
        //       }
        //       return 0
        //     })
        //     $app.store.user.assetsStatistic = assetsResponse.statistic
        //   })
        //   .catch(() => {
        //     // Todo: notify something went wrond
        //   }),

        // $app.api.info.event
        //   .getDeals({
        //     per_page: 4,
        //     page: 1,
        //   })
        //   .then((dealsResponse) => {
        //     $app.store.user.lastTrades = dealsResponse.data.data
        //   })
        //   .catch(() => {
        //     // Todo: notify something went wrond
        //   }),

        $app.api.eth.news
          .getIntegration()
          .then((integrationResponse) => {
            $app.store.user.newsData = integrationResponse.data[0]
          })
          .catch(() => {
            // Todo: notify something went wrond
          }),

        $app.api.info.event
          .getPurchases({
            per_page: 4,
            page: 1,
          })
          .then((dealsResponse) => {
            $app.store.user.lastPurchases = dealsResponse.data.data
          })
          .catch(() => {
            // Todo: notify something went wrond
          }),

        $app.api.eth.billingEth
          .getLastPayment()
          .then((response: any) => {
            $app.store.user.lastPayment = response.data
          })
          .catch(() => {
            // Todo: notify something went wrond
          }),

        $app.api.eth.statisticEth
          .getGlobalStats()
          .then((resp) => {
            $app.store.user.statistic = resp?.data
            $app.store.user.btcValue = resp?.data?.btc_price
            $app.store.assets.btcValue = resp?.data?.btc_price
          })
          .catch(() => {
            // Todo: notify something went wrond
          }),

        // $app.api.eth.billingEth
        //   .getWallet({ type: 'dividends' })
        //   .then((response: any) => {
        //     $app.store.user.dividends = response.data
        //   })
        //   .catch(() => {
        //     // Todo: notify something went wrond
        //   }),
      ])
    },

    setRefCode(payload: {ref_code: string }) {
      this.refCode = payload.ref_code;
    }

  },

  getters: {
    isUserAuthenticated: (state) => !!state.accessToken,
    getTokens: (state) => ({
      accessToken: state.accessToken,
      refreshToken: state.refreshToken,
      websocketToken: state.websocketToken,
    }),
  },

  persist: {
    storage: persistedState.cookiesWithOptions({
      maxAge: 31557600,
    }),
  },
})
