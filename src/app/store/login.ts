import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import { SignupMethods } from '~/src/shared/constants/signupMethods';
import { Steps } from '~/src/features/f-login/steps';

interface loginState {
    currentStep: any,
}

export const login = defineStore('login', {
  state: () => ({
    currentStep: Steps.Choice,
  } as loginState),

  actions: {
  },
  
})
