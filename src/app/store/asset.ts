import { defineStore } from 'pinia'

export const asset = defineStore('asset', {
  state: () => ({
    name: '',
    loading: false,
  }),
})
