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

  async init(payload: {
    username: string;
    email: string;
    refcode?: string,
    method?: SignupMethods,
    signature?: string,
    wallet_address?: string,
    message?: string,
  }) {

    if(payload?.method === SignupMethods.Google) {
      // не тут а после указания имя и фамилия const response = await axios.post("http://127.0.0.1/v1/auth/provider/google-auth/confirm", {payload});
    }

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

  async initMetamask(payload: {
    username: string;
    email: string;
    refcode?: string,
    method?: SignupMethods,
    signature?: string,
    wallet_address?: string,
    message?: string,
  }) {

    try {

      return await this.adapter.requestJsonAsync({
        parameterValue: 'auth/provider/metamask/init',
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

  async initTelegram(payload: any) {

    try {
        return await this.adapter.requestJsonAsync({
          parameterValue: "auth/provider/telegram/init",
          request: {
            method: HTTPMethod.POST,
          },
          data: payload,
          operationDescription: 'User email registration',
          withoutPublic: true,
        });
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

  async confirmMetamask(payload: { email: string; code: string; fast: boolean }) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'auth/provider/metamask/confirm',
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

  async confirmTelegram(payload: { telegram_data: string, email: string; code: string; fast: boolean }) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'auth/provider/telegram/confirm',
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

  async loginTelegram(payload: { telegram_data: string }) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'auth/provider/telegram/login',
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

  async loginMetamask(payload: { signature: string; message: string, wallet_address }) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'auth/provider/metamask/login',
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

  async getWallets() {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: '/v3/public/billing/shares/buy/apollopayment/payment-methods',
        request: {
          method: HTTPMethod.GET,
        },
        operationDescription: 'Getting information about wallets',
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

  async papSignUp({ payload }) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'pap/signup',
        request: {
          method: HTTPMethod.POST,
        },
        data: payload,
        operationDescription: 'Getting information about the user',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async telegramGetAuthType(payload: { telegram_data: string }) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'auth/provider/telegram/get-auth-type',
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

  async getAppleRedirect() {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: `auth/provider/apple/redirect-url`,
        request: {
          method: HTTPMethod.GET,
        },
        operationDescription: 'Receiving a purchase',
        withoutPublic: true,
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async getAppleAuthType(payload: { apple_token: string }) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: `auth/provider/apple/get-auth-type`,
        request: {
          method: HTTPMethod.POST,
        },
        data: payload,
        operationDescription: 'Receiving a purchase',
        withoutPublic: true,
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async initApple(payload: any) {

    try {
        return await this.adapter.requestJsonAsync({
          parameterValue: "auth/provider/apple/init",
          request: {
            method: HTTPMethod.POST,
          },
          data: payload,
          operationDescription: 'User email registration',
          withoutPublic: true,
        });
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async confirmApple(payload: { apple_token: string, email: string; code: string; }) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'auth/provider/apple/confirm',
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

  async loginApple(payload: { apple_token: string }) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'auth/provider/apple/login',
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

  async initOneTimeLink(payload: { email: string }) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'auth/one-time-password/init',
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

  async loginOneTimeLink(payload: { email: string, password: string }) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'auth/login/one-time-pass',
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

  async resendOneTimeLink(payload: { email: string }) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'auth/one-time-password/resend',
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
}
