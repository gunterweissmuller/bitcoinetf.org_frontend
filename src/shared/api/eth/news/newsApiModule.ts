import { inject, injectable } from 'inversify'
import { HTTPMethod } from '~/src/shared/constants/httpMethods'
import { ApiErrorFlow } from '~/src/shared/toolkit/apiErrorFlow'
import { INVERSIFY_TYPES } from '~/src/shared/types/inversifyTypes'

@injectable()
export default class NewsApiModule {
  readonly name = 'news'
  readonly adapter
  readonly store

  constructor(@inject(INVERSIFY_TYPES.EthAdapter) adapter: any, @inject(INVERSIFY_TYPES.StorePack) store: any) {
    this.adapter = adapter
    this.store = store
  }

  async getIntegration() {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'news/integration',
        request: {
          method: HTTPMethod.GET,
        },
        operationDescription: 'Getting a list of news integrations',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async getListNewsSections() {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: `news/sections`,
        request: {
          method: HTTPMethod.GET,
        },
        operationDescription: 'Method for getting a list of news integrations',
        privateBackend: true,
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async getNewsSections(payload: { uuid: string }) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: `news/sections/${payload.uuid}`,
        request: {
          method: HTTPMethod.GET,
        },
        operationDescription: 'Method for getting partition',
        privateBackend: true,
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async getListNewsTags() {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: `news/tags`,
        request: {
          method: HTTPMethod.GET,
        },
        operationDescription: 'Method for getting list of tags',
        privateBackend: true,
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async getNewsTag(payload: { uuid: string }) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: `news/tags/${payload.uuid}`,
        request: {
          method: HTTPMethod.GET,
        },
        operationDescription: 'Tag getting method',
        privateBackend: true,
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async getListNewsArticles(payload) {
    const options = {
      section_uuid:  payload.uuid,
      page: payload?.page || 1,
      per_page: payload?.per_page || 15
    }

    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: `news/articles`,
        request: {
          method: HTTPMethod.GET,
          params: options
        },
        operationDescription: 'Method for getting the Articles list',
        privateBackend: true,
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async getNewsArticles(payload: { section_slug: string; article_slug: string }) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: `news/article?section_slug=${payload.section_slug}&article_slug=${payload.article_slug}`,
        request: {
          method: HTTPMethod.GET,
        },
        operationDescription: 'Method for getting Articles',
        privateBackend: true,
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  // NOSTR NEWS
  async getNosrtNews() {
    try {
      const headers = new Headers()
      headers.set('accept', 'application/json')
      headers.set('content-type', 'application/json')

      const res = await fetch(`https://nostr.bitcoinetf.org/news`, {
        method: 'GET',
        headers,
      })

      return await res.json()
    } catch (e) {
      return Promise.reject()
    }
  }

  async mailchimpSub(payload: { email: string;}) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'newsletter/subscription/subscribe',
        request: {
          method: HTTPMethod.POST,
        },
        data: payload,
        operationDescription: 'User email subscription',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }
}
