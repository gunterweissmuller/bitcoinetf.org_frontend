import { defineStore } from 'pinia'

export const assets = defineStore('assets', {
  state: () => ({
    items: [],
    btcValue: 0,
  }),

  getters: {

    fullBalanceFund() {
      if (!this.items?.length) return 0

      let sum = this.items.filter((el) => el.symbol !== 'BRF' && el.symbol !== 'VAULT').reduce((sum, item) => {
        sum += +item.full_balance

        return sum
      }, 0)

      const assetBrf = this.items.find((el) => el.symbol === 'BRF')

      sum += assetBrf?.incoming_amount_btc * this.btcValue


      return sum
    },
    fundTotalBtc() {
      return this.items.find((el => el.symbol === 'BRF'))?.incoming_amount_btc || 0
    },
  },

  persist: true,
})
