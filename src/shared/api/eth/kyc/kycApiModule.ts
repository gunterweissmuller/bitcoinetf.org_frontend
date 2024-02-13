import { inject, injectable } from 'inversify'
import { HTTPMethod } from '~/src/shared/constants/httpMethods'
import { ApiErrorFlow } from '~/src/shared/toolkit/apiErrorFlow'
import { INVERSIFY_TYPES } from '~/src/shared/types/inversifyTypes'

@injectable()
export default class KycApiModule {
  readonly name = 'news'
  readonly adapter
  readonly store

  constructor(@inject(INVERSIFY_TYPES.EthAdapter) adapter: any, @inject(INVERSIFY_TYPES.StorePack) store: any) {
    this.adapter = adapter
    this.store = store
  }

  async getForms() {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'kyc/forms',
        request: {
          method: HTTPMethod.GET,
        },
        operationDescription: 'Getting a list of available forms',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async getScreens(payload: { form_uuid: string }) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'kyc/screens',
        request: {
          method: HTTPMethod.GET,
          params: payload,
        },
        operationDescription: 'Getting screens of a specific shape',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async getScreen(payload: { uuid: string }) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'kyc/screen',
        request: {
          method: HTTPMethod.GET,
          params: payload,
        },
        operationDescription: 'Getting a screen of a specific form',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async saveScreen(payload: any) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'kyc/screen',
        request: {
          method: HTTPMethod.POST,
        },
        data: payload,
        operationDescription: 'Saving entered screen data',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async uploadFile(payload: { type: string; file: File }) {
    try {
      return await this.adapter.requestFormDataAsync({
        parameterValue: 'storage/file/upload',
        request: {
          method: HTTPMethod.POST,
        },
        data: payload,
        operationDescription: 'Uploading a file to the server',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async getStates(payload: { country: string }) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'kyc/screen/states',
        request: {
          method: HTTPMethod.GET,
          params: payload,
        },
        operationDescription: 'Get KYC States',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }
}
