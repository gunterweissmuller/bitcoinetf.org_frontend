import { inject, injectable } from 'inversify'
import { HTTPMethod } from '~/src/shared/constants/httpMethods'
import { ApiErrorFlow } from '~/src/shared/toolkit/apiErrorFlow'
import { INVERSIFY_TYPES } from '~/src/shared/types/inversifyTypes'
import { SignupMethods } from '~/src/shared/constants/signupMethods'

@injectable()
export default class AuthApiModule {
  readonly name = 'auth'
  readonly adapter
  readonly store

  constructor(@inject(INVERSIFY_TYPES.EthAdapter) adapter: any, @inject(INVERSIFY_TYPES.StorePack) store: any) {
    this.adapter = adapter
    this.store = store
  }

  async init(payload: { username: string; email: string; refcode?: string }) {

    try {
      
      return await this.adapter.requestJsonAsync({
        parameterValue: 'auth/register/init',
        request: {
          method: HTTPMethod.POST,
        },
        data: payload,
        operationDescription: 'User email registration',
        withoutPublic: true,
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async initGoogle(payload: { username: string; email: string; refcode?: string, method?: SignupMethods }) {

    try {

      if(payload?.method === SignupMethods.Google) {
        return await this.adapter.requestJsonAsync({
          parameterValue: "auth/provider/google-auth/confirm", 
          request: {
            method: HTTPMethod.POST,
          },
          data: payload,
          operationDescription: 'User email registration',
          withoutPublic: true,
        });
      }
      
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async check(payload: { email: string; code: string }) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'auth/code/check',
        request: {
          method: HTTPMethod.POST,
        },
        data: payload,
        operationDescription: 'Checking the correctness of the verification code',
        withoutPublic: true,
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async confirm(payload: { email: string; code: string; password: string }) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'auth/register/confirm',
        request: {
          method: HTTPMethod.POST,
        },
        data: payload,
        operationDescription: 'Setting a password',
        withoutPublic: true,
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async confirmFast(payload: { email: string; code: string; }) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'auth/register/confirm?fast',
        request: {
          method: HTTPMethod.POST,
        },
        data: payload,
        operationDescription: 'Setting a password',
        withoutPublic: true,
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async resend(payload: { email: string }) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'auth/code/resend',
        request: {
          method: HTTPMethod.POST,
        },
        data: payload,
        operationDescription: 'Sending a new verification code',
        withoutPublic: true,
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async login(payload: { email: string; password: string }) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'auth/login',
        request: {
          method: HTTPMethod.POST,
        },
        data: payload,
        operationDescription: 'Authorization. Retrieving a JWT pair',
        withoutPublic: true,
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async refresh(payload: { refresh_token: string }) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'auth/token/refresh',
        request: {
          method: HTTPMethod.POST,
        },
        data: payload,
        operationDescription: 'Token refresh',
        withoutPublic: true,
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async recoveryInit(payload: { email: string }) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'auth/recovery/init',
        request: {
          method: HTTPMethod.POST,
        },
        data: payload,
        operationDescription: 'Password reset process',
        withoutPublic: true,
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async recoveryCheck(payload: { code: string }) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'auth/recovery/check',
        request: {
          method: HTTPMethod.POST,
        },
        data: payload,
        operationDescription: 'Checking the code after following the link',
        withoutPublic: true,
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async recoveryConfirm(payload: { code: string; password: string }) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'auth/recovery/confirm',
        request: {
          method: HTTPMethod.POST,
        },
        data: payload,
        operationDescription: 'Password recovery confirmation',
        withoutPublic: true,
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async getUser() {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'users/account/me',
        request: {
          method: HTTPMethod.GET,
        },
        operationDescription: 'Getting information about the user',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async getProfileInfo() {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'users/profile/me',
        request: {
          method: HTTPMethod.GET,
        },
        operationDescription: 'Getting information about the user',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }
}
