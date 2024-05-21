import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import { SignupMethods } from '~/src/shared/constants/signupMethods';
import { Steps } from '~/src/features/f-registration/steps';

interface registrationState {
    currentStep: any,
    isOpenTermsModal: boolean,
    // firstName: string,
    // lastName: string,
    // email: string,
    // phone: string,
}

export const registration = defineStore('registration', {
  state: () => ({
    currentStep: Steps.Choice,
    isOpenTermsModal: false,
    // firstName: '',
    // lastName: '',
    // email: '',
    // phone: '',
  } as registrationState),

  actions: {
  },
  
})
