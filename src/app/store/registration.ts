import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import { SignupMethods } from '~/src/shared/constants/signupMethods';
import { Steps } from '~/src/features/f-registration/steps';

interface registrationState {
    currentStep: any,
    isOpenTermsModal: boolean,
    currentSignup: SignupMethods,
    backendError: any,
    metamaskData: any,
    timerStarted: boolean,
    timeLeft: number,
    timer: any,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    walletConnectData: any,
}

export const registration = defineStore('registration', {
  state: () => ({
    currentStep: Steps.Choice,
    isOpenTermsModal: false,
    currentSignup: SignupMethods.Email,
    backendError: {value: '', field: 'default'},
    metamaskData: {},
    timerStarted: false,
    timeLeft: 0,
    timer: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    walletConnectData: {},
  } as registrationState),

  actions: {
  },
  
})
