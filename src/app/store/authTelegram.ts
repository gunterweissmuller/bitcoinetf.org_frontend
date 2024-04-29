import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import { SignupMethods } from '~/src/shared/constants/signupMethods';

interface authTelegramState {
  response: any,
  responseMethod: SignupMethods,
}

export const authTelegram = defineStore('authTelegram', {
  state: () => ({
    response: {},
    responseMethod: SignupMethods.Email,
  } as authTelegramState),

  actions: {
    setResponse(payload: { response: any; method: SignupMethods; }) {
      this.response = payload.response
      this.responseMethod = payload.method
    },
  },

})
