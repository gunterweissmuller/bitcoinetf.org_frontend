import { inject, injectable } from 'inversify'
import { HTTPMethod } from '~/src/shared/constants/httpMethods'
import { ApiErrorFlow } from '~/src/shared/toolkit/apiErrorFlow'
import { INVERSIFY_TYPES } from '~/src/shared/types/inversifyTypes'

@injectable()
export default class BillingEthApiModule {
  readonly name = 'billing'
  readonly adapter
  readonly store

  constructor(@inject(INVERSIFY_TYPES.InfoAdapter) adapter: any, @inject(INVERSIFY_TYPES.StorePack) store: any) {
    this.adapter = adapter
    this.store = store
  }

  async setWithdrawalMethod({ walletType, method, address = null }) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: `billing/withdrawal/method`,
        request: {
          method: HTTPMethod.POST,
        },
        data: {
          wallet_type: walletType,
          method: method,
          address: address,
        },
        operationDescription: 'Saving the output method',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }
}
