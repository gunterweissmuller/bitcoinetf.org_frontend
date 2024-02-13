import { inject, injectable } from 'inversify'
import { HTTPMethod } from '~/src/shared/constants/httpMethods'
import { ApiErrorFlow } from '~/src/shared/toolkit/apiErrorFlow'
import { INVERSIFY_TYPES } from '~/src/shared/types/inversifyTypes'

@injectable()
export default class EventApiModule {
  readonly name = 'event'
  readonly adapter
  readonly store
  readonly filters

  constructor(
    @inject(INVERSIFY_TYPES.InfoAdapter) adapter: any,
    @inject(INVERSIFY_TYPES.StorePack) store: any,
    @inject(INVERSIFY_TYPES.FiltersPack) filters: any,
  ) {
    this.adapter = adapter
    this.store = store
    this.filters = filters
  }

  async getDeals(payload: any) {
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
        parameterValue: `event/deal?${filtersQuery}`,
        request: {
          method: HTTPMethod.GET,
        },
        operationDescription: 'Getting a list of deal events',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async getSpillovers(payload: any) {
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

    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: `event/spillover?${filtersQuery}`,
        request: {
          method: HTTPMethod.GET,
        },
        operationDescription: 'Getting a list of overflow events',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async getPurchases(payload: any) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'event/purchase',
        request: {
          method: HTTPMethod.GET,
          params: payload,
        },
        operationDescription: 'Getting a shopping list',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async getPurchase(payload: { uuid: string }) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: `event/purchase/${payload.uuid}`,
        request: {
          method: HTTPMethod.GET,
        },
        operationDescription: 'Receiving a purchase',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }
}
