import { inject, injectable } from 'inversify'
import { HTTPMethod } from '~/src/shared/constants/httpMethods'
import { ApiErrorFlow } from '~/src/shared/toolkit/apiErrorFlow'
import { INVERSIFY_TYPES } from '~/src/shared/types/inversifyTypes'
import {ApiVersion} from "~/src/shared/constants/api";

@injectable()
export default class StatisticEthApiModule {
  readonly name = 'statisticEth'
  readonly adapter
  readonly filters
  readonly store

  constructor(
    @inject(INVERSIFY_TYPES.EthAdapter) adapter: any,
    @inject(INVERSIFY_TYPES.StorePack) store: any,
    @inject(INVERSIFY_TYPES.FiltersPack) filters: any,
  ) {
    this.adapter = adapter
    this.store = store
    this.filters = filters
  }

  async getReports(payload: any) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'statistic/report',
        request: {
          method: HTTPMethod.GET,
          params: payload,
        },
        operationDescription: 'Receiving a user payment report',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async getReport(payload: { uuid: string }) {
    try {
      return await this.adapter.requestFileAsync({
        parameterValue: `statistic/report/${payload.uuid}`,
        request: {
          method: HTTPMethod.GET,
          params: payload,
        },
        operationDescription: 'View a pdf file of a report on user payments (or download)',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async getDividendsByYear(payload) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'statistic/dividends',
        request: {
          method: HTTPMethod.GET,
          params: payload,
        },
        operationDescription: 'Receiving dividends by year',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async getAssetsFund(payload: any) {
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
        parameterValue: `statistic/funds?${filtersQuery}`,
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

  async getGlobalStats() {
    try {
      return await this.adapter.requestJsonAsync({
        apiVersion: ApiVersion.V2,
        parameterValue: 'statistic',
        request: {
          method: HTTPMethod.GET,
        },
        operationDescription: 'Method for obtaining statistics',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async getShareholders(payload: any) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'statistic/shareholders/top',
        request: {
          method: HTTPMethod.GET,
          params: payload,
        },
        operationDescription: 'Obtaining a list of top 100 shareholders',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }
}
