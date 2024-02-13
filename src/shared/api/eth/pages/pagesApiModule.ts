import { inject, injectable } from 'inversify'
import { HTTPMethod } from '~/src/shared/constants/httpMethods'
import { ApiErrorFlow } from '~/src/shared/toolkit/apiErrorFlow'
import { INVERSIFY_TYPES } from '~/src/shared/types/inversifyTypes'

@injectable()
export default class PagesApiModule {
  readonly name = 'pages'
  readonly adapter
  readonly store

  constructor(@inject(INVERSIFY_TYPES.EthAdapter) adapter: any, @inject(INVERSIFY_TYPES.StorePack) store: any) {
    this.adapter = adapter
    this.store = store
  }

  async getPageInfo(page: string) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: `pages/page/${page}/eng`,
        request: {
          method: HTTPMethod.GET,
        },
        operationDescription: 'Getting information about page sections',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }
}
