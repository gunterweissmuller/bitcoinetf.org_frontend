import { defineStore } from 'pinia'

export const statistic = defineStore('statistic', {
  state: () => ({
    btcUsdt: null,
    bottomInfo: null,
  }),
})
