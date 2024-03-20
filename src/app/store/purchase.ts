import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import { SignupMethods } from '~/src/shared/constants/signupMethods';

interface purchaseState {
    amount: number,
    amountUS: number,
    test: number,
    type: 'USDT' | 'BTC',
    totalPayout: number,
}

export const purchase = defineStore('purchase', {
  state: () => ({
    amount: 100,
    amountUS: 100,
    test: 100,
    type: 'USDT',
    totalPayout: 142,
  } as purchaseState),

  actions: {
  },

  getters: {
  },

  persist: {
    storage: persistedState.cookiesWithOptions({
      maxAge: 31557600,
    }),
  },
})
