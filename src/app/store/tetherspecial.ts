import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import { Steps } from '~/src/features/f-registration/steps';
import { SignupSteps } from '~/src/shared/ui/promolandings/landing-registration/SignupSteps';
import { PurchaseSteps } from '~/src/shared/ui/promolandings/landing-registration/PurchaseSteps';
import { SignupMethods } from '~/src/shared/constants/signupMethods';

interface tetherspecialState {
    signupStep: SignupSteps,
    purchaseStep: PurchaseSteps,
    signupMethod: SignupMethods,
    firstName: string,
    lastName: string,
    email: string,
    dataDisabled: boolean,
    isMainInputDisabled: boolean,
    isEmailDisabled: boolean,
    backendError: any,
    countryCode: any,
    phone: any,
    isOpenTermsModal: boolean,
    confirmResponse: any,
    isOpenSuccessModal: any,
}

export const tetherspecial = defineStore('tetherspecial', {
  state: () => ({
    signupStep: SignupSteps.Default,
    purchaseStep: PurchaseSteps.Default,
    signupMethod: SignupMethods.None,
    firstName: '',
    lastName: '',
    email: '',
    dataDisabled: false,
    isMainInputDisabled: false,
    isEmailDisabled: false,
    backendError: {value: '', field: 'default'},
    countryCode: '',
    phone: '',
    isOpenTermsModal: false,
    confirmResponse: null,
    isOpenSuccessModal: false,
  } as tetherspecialState),

  actions: {
  },
  
})
