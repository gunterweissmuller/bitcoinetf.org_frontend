import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import { SignupMethods } from '~/src/shared/constants/signupMethods';

interface authGoogleState {
    response: any,
    responseMethod: SignupMethods,
}

export const authGoogle = defineStore('authGoogle', {
  state: () => ({
    response: {},
    responseMethod: SignupMethods.Email,
  } as authGoogleState),

  actions: {
    setResponse(payload: { response: any; method: SignupMethods; }) {
      this.response = payload.response
      this.responseMethod = payload.method
    },
  },
  
})
