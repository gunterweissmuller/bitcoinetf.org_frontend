import { defineStore } from 'pinia'

export const user = defineStore('user', {
  state: () => ({
    theme: '',
    info: '',
    blockchainUserWallet: '',
    buyShares: null,
    statistic: null,
    totalFund: {
      totalAmountBtc: 0,
      totalAmountUsd: 0,
    },
    menu: false,
    hasEarnings: false,
    dividends: 0,
    routeFrom: '',
    routeTo: '',

    //global data for loading improvement
    btcValue: 0,
    assets: [],
    lastTrades: [],
    newsData: null,
    lastSpillovers: [],
    firstShareholders: [],
    lastPurchases: [],
    lastPayment: null,
    paymentStatistic: null,
    personalDividends: [],
    news: [],
    latestTrade:'',
  }),

  getters: {
    userInfo: (state) => state.info,
    fundTotalUsd() {
      return this.statistic?.aum_usd || 0
    }
  },

  persist: true,
})
