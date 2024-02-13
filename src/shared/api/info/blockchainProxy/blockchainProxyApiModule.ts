import { inject, injectable } from 'inversify'
import { HTTPMethod } from '~/src/shared/constants/httpMethods'
import { ApiErrorFlow } from '~/src/shared/toolkit/apiErrorFlow'
import { INVERSIFY_TYPES } from '~/src/shared/types/inversifyTypes'

@injectable()
export default class blockchainProxyApiModule {
  readonly name = 'blockchainProxy'
  readonly adapter
  readonly filters
  readonly store

  constructor(
    @inject(INVERSIFY_TYPES.InfoAdapter) adapter: any,
    @inject(INVERSIFY_TYPES.StorePack) store: any,
    @inject(INVERSIFY_TYPES.FiltersPack) filters: any,
  ) {
    this.adapter = adapter
    this.store = store
    this.filters = filters
  }

  async getUserBlockchainWallet() {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'blockchain/wallet/',
        request: {
          method: HTTPMethod.GET,
        },
        operationDescription: 'Get user blockchain wallet',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }
}
