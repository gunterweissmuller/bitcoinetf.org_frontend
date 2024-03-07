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

    isInvestModalShow: false,
    isInvestModalReinvest: false,
    investAmount: 2500,
  }),

  actions: {
    setIsInvestModalShow(payload: { show: boolean }) {
      this.isInvestModalShow = payload.show;
    },
    setInvestModalReinvest(payload: { reinvest: boolean }) {
      this.isInvestModalReinvest = payload.reinvest;
    },
    setTheme(payload: {theme: string}) {
      this.theme = payload.theme;
    },
    setInvestAmount(payload: {amount: any}) {
      this.investAmount = payload.amount;
    }
  },

  getters: {
    userInfo: (state) => state.info,
    fundTotalUsd() {
      return this.statistic?.aum_usd || 0
    }
  },

  persist: true,
})
