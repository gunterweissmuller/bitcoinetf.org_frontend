import { inject, injectable } from 'inversify'
import { HTTPMethod } from '~/src/shared/constants/httpMethods'
import { ApiErrorFlow } from '~/src/shared/toolkit/apiErrorFlow'
import { INVERSIFY_TYPES } from '~/src/shared/types/inversifyTypes'
import {ApiVersion} from "~/src/shared/constants/api";

@injectable()
export default class StatisticApiModule {
  readonly name = 'statistic'
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

  async getAssetsStat(payload: any, type = 'monthly') {
    try {
      let filtersQuery = ''

      if (payload?.filters) {
        Object.entries(payload.filters).forEach(([key, value]) => {
          if (value) {
            filtersQuery += `filters[${key}]=${value}&`
          }
        })
      }

      Object.entries(this.filters.omit(payload, ['filters'])).forEach(([key, value]) => {
        if (value) {
          filtersQuery += `${key}=${value}&`
        }
      })

      return await this.adapter.requestJsonAsync({
        parameterValue: `statistic/assets/${type}?${filtersQuery}`,
        request: {
          method: HTTPMethod.GET,
        },
        operationDescription: 'Getting a list of asset statistics records by day',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async getBinanceTicker24hr(tokens) {
    if (Array.isArray(tokens)) {
      return await useFetch(`https://api3.binance.com/api/v3/ticker/24hr?symbols=${tokens}`)
    }

    return await useFetch(`https://api3.binance.com/api/v3/ticker/24hr?symbol=${tokens}`)
  }

}
