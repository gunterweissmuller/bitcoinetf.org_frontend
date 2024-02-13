import { defineStore } from 'pinia'

export const persiste = defineStore('persiste', {
  state: () => ({
    latestTronCheckDate:null
  }),

  persist: {
    storage: persistedState.cookiesWithOptions({
      maxAge: 31557600,
    }),
  },
})
