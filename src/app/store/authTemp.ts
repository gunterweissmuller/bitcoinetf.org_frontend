import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import { SignupMethods } from '~/src/shared/constants/signupMethods';

interface authTempState {
    response: any,
    responseMethod: SignupMethods,
}

export const authTemp = defineStore('authTemp', {
  state: () => ({
    response: {},
    responseMethod: SignupMethods.Email,
  } as authTempState),

  persist: {
    storage: persistedState.cookiesWithOptions({
      maxAge: 31557600,
    }),
  },
})
