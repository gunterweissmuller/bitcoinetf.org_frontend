import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import { SignupMethods } from '~/src/shared/constants/signupMethods';
import { Steps } from '~/src/features/f-login/steps';

interface loginState {
    currentStep: any,
    timerStarted: boolean,
    timeLeft: number,
    timer: any,
    email: string,
    password: string,
}

export const login = defineStore('login', {
  state: () => ({
    currentStep: Steps.Choice,
    timerStarted: false,
    timeLeft: 0,
    timer: null,
    email: '',
    password: '',
  } as loginState),

  actions: {
  },
  
})
