import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import { SignupMethods } from '~/src/shared/constants/signupMethods';

interface purchaseState {
    amount: number,
    amountUS: number,
    test: number,
    type: 'USDT' | 'BTC',
    totalPayout: number,
    apy: number,
    currentStep: string,
    initialDiscount: boolean
}

export const purchase = defineStore('purchase', {
  state: () => ({
    amount: 2500,
    amountUS: 2500,
    type: 'USDT',
    totalPayout: 142,
    apy: 14,
    currentStep: 'Confirm',
    initialDiscount: false
  } as purchaseState),

  actions: {
    setInitialDiscount(payload: boolean){
      this.initialDiscount = payload
    }
  },

  getters: {
  },

  persist: {
    storage: persistedState.cookiesWithOptions({
      maxAge: 31557600,
    }),
  },
})
