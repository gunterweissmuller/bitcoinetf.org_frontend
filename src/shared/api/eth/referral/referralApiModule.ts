import {inject, injectable} from 'inversify'
import {HTTPMethod} from '~/src/shared/constants/httpMethods'
import {ApiErrorFlow} from '~/src/shared/toolkit/apiErrorFlow'
import {INVERSIFY_TYPES} from '~/src/shared/types/inversifyTypes'

@injectable()
export default class ReferralApiModule {
  readonly name = 'referral'
  readonly adapter
  readonly store

  constructor(@inject(INVERSIFY_TYPES.EthAdapter) adapter: any, @inject(INVERSIFY_TYPES.StorePack) store: any) {
    this.adapter = adapter
    this.store = store
  }

  async checkReferralCode(code: string) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'referral/invite/apply',
        request: {
          method: HTTPMethod.POST,
        },
        data: {
          code,
        },
        operationDescription: 'Checking referral code',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(e)
    }
  }

  async checkValidationCode(code: string) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'referral/code/check',
        request: {
          method: HTTPMethod.POST,
        },
        data: {
          code,
        },
        operationDescription: 'Checking referral code',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(e)
    }
  }
}
