import { inject, injectable } from 'inversify'
import { HTTPMethod } from '~/src/shared/constants/httpMethods'
import { ApiErrorFlow } from '~/src/shared/toolkit/apiErrorFlow'
import { INVERSIFY_TYPES } from '~/src/shared/types/inversifyTypes'

@injectable()
export default class FundApiModule {
  readonly name = 'fund'
  readonly adapter
  readonly store

  constructor(@inject(INVERSIFY_TYPES.InfoAdapter) adapter: any, @inject(INVERSIFY_TYPES.StorePack) store: any) {
    this.adapter = adapter
    this.store = store
  }

  async getAssets() {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'fund/asset',
        request: {
          method: HTTPMethod.GET,
        },
        operationDescription: 'Getting a list of assets',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async getAsset(payload: { uuid: string }) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: `fund/asset/${payload.uuid}`,
        request: {
          method: HTTPMethod.GET,
        },
        operationDescription: 'Receiving an asset',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

}
