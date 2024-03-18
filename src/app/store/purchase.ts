import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import { SignupMethods } from '~/src/shared/constants/signupMethods';

interface purchaseState {
    amount: number,
    type: 'USDT' | 'BTC',
}

export const purchase = defineStore('purchase', {
  state: () => ({
    amount: 100,
    type: 'USDT',

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
