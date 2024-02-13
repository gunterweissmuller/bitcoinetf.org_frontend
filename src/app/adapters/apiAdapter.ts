import { inject, injectable } from 'inversify'
import { useRequestHeaders } from '#app'
import { HttpStatusCode } from '~/src/shared/constants/httpStatusCodes'
import { HTTPMethod } from '~/src/shared/constants/httpMethods'
import { ApiErrorFlow } from '~/src/shared/toolkit/apiErrorFlow'
import { INVERSIFY_TYPES } from '~/src/shared/types/inversifyTypes'
import Stopwatch from '~/src/shared/toolkit/stopwatch'
import type { ILocalStorage } from '~/src/app/localStorage'
import type { IFiltersPack } from '~/src/shared/toolkit/filters'
import type { IStorePack } from '~/src/app/store'
import { ApiVersion } from '~/src/shared/constants/api'

interface IWrapperRequestAsync {
  apiVersion?:
    | ApiVersion.V1
    | ApiVersion.V2
  parameterValue?: string
  request: Omit<Partial<Request>, 'body'> & { body?: BodyInit } & {
    params?: URLSearchParams | Record<string, string>
  }
  operationDescription?: string
  headers?: Pick<Request, 'headers'>
  data?: unknown
  withoutPublic?: boolean
}

export interface IRequestAsync extends IWrapperRequestAsync {
  resolvePayloadAsync(_payload: Response): Promise<any>
}

export interface IApiHelper {
  getTextAsync(_payload: IWrapperRequestAsync): Promise<string>

  requestBlobAsync(_payload: IWrapperRequestAsync): Promise<ArrayBuffer>

  requestJsonAsync<T>(_payload: IWrapperRequestAsync): Promise<T>

  requestIgnoreResponseDataAsync(_payload: IWrapperRequestAsync): Promise<null>

  userAgent: string
}

@injectable()
export class ApiAdapter implements IApiHelper {
  prefix = ''
  defaultRequest: Pick<Request, 'cache' | 'headers'> = {
    cache: 'no-cache',
    headers: new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }),
  }

  readonly store
  readonly filters
  readonly localStorage
  readonly message
  readonly userAgent

  constructor(
    @inject(INVERSIFY_TYPES.StorePack) store: IStorePack,
    @inject(INVERSIFY_TYPES.LocalStorage) localStorage: ILocalStorage,
    @inject(INVERSIFY_TYPES.FiltersPack) filtersPack: IFiltersPack,
  ) {
    this.store = store
    this.localStorage = localStorage.localStorage
    this.filters = filtersPack

    const serverHeaders = useRequestHeaders()
    const serverUserAgent = serverHeaders['user-agent']
    this.userAgent = serverUserAgent || navigator.userAgent
    this.store.auth.userAgent = serverUserAgent || navigator.userAgent
  }

  getTextAsync({
                 apiVersion = ApiVersion.V1,
                 parameterValue = '',
                 operationDescription = '',
                 data,
                 withoutPublic = false
               }: IWrapperRequestAsync): Promise<string> {
    return this.requestAsync<string>({
      apiVersion,
      parameterValue,
      request: {
        ...this.defaultRequest,
        method: HTTPMethod.GET,
        body: JSON.stringify(data),
      },
      resolvePayloadAsync: (_response: Response) => _response.text(),
      operationDescription,
      withoutPublic
    })
  }

  requestBlobAsync({
                     apiVersion = ApiVersion.V1,
                     parameterValue = '',
                     request,
                     operationDescription,
                     data,
                     headers,
                     withoutPublic = false
                   }: IWrapperRequestAsync): Promise<ArrayBuffer> {
    return this.requestAsync<ArrayBuffer>({
      apiVersion,
      parameterValue,
      request: {
        ...this.defaultRequest,
        ...request,
        body: new Blob([JSON.stringify(data)]),
      },
      resolvePayloadAsync: (_response: Response) => _response.blob(),
      operationDescription,
      headers,
      withoutPublic
    })
  }

  requestJsonAsync<T>({
                        apiVersion = ApiVersion.V1,
                        parameterValue = '',
                        request,
                        operationDescription,
                        data,
                        headers,
                        withoutPublic = false
                      }: IWrapperRequestAsync): Promise<T> {
    return this.requestAsync<T>({
      apiVersion,
      parameterValue,
      request: {
        ...this.defaultRequest,
        ...request,
        body: JSON.stringify(data),
      },
      resolvePayloadAsync: (_response: Response) => {
        return _response.json().catch(() => null)
      },
      operationDescription,
      headers,
      withoutPublic
    })
  }

  requestIgnoreResponseDataAsync({
                                   apiVersion = ApiVersion.V1,
                                   parameterValue = '',
                                   request,
                                   operationDescription,
                                   data,
                                   headers,
                                   withoutPublic = false
                                 }: IWrapperRequestAsync): Promise<null> {
    return this.requestAsync<null>({
      apiVersion,
      parameterValue,
      request: {
        ...this.defaultRequest,
        ...request,
        body: JSON.stringify(data),
      },
      resolvePayloadAsync: (_response: Response) => Promise.resolve(null),
      operationDescription,
      headers,
      withoutPublic
    })
  }

  requestFileAsync<T>({
                        apiVersion = ApiVersion.V1,
                        parameterValue = '',
                        request,
                        operationDescription,
                        data,
                        headers,
                        withoutPublic = false
                      }: IWrapperRequestAsync): any {
    return this.requestAsync<T>({
      apiVersion,
      parameterValue,
      request: {
        ...this.defaultRequest,
        ...request,
        body: JSON.stringify(data),
      },
      resolvePayloadAsync: (_response: Response) => {
        return _response.blob().catch(() => null)
      },
      operationDescription,
      headers,
      withoutPublic,
    })
  }

  async requestFormDataAsync({
                               apiVersion = ApiVersion.V1,
                               parameterValue = '',
                               request,
                               operationDescription,
                               data,
                               headers,
                               withoutPublic = false,
                             }: IWrapperRequestAsync): Promise<ArrayBuffer> {
    return this.requestAsync<ArrayBuffer>({
      apiVersion,
      parameterValue,
      request: {
        ...{cache: 'no-cache', headers: new Headers({})},
        ...request,
        body: data,
      },
      resolvePayloadAsync: (_response: Response) => _response.json(),
      operationDescription,
      headers,
      withoutPublic,
    })
  }

  async requestAsync<T>({
                          parameterValue,
                          request,
                          resolvePayloadAsync,
                          operationDescription,
                          headers,
                          withoutPublic = false
                        }: Omit<IRequestAsync, 'data'> & { request: Pick<Request, 'cache' | 'headers'> }): Promise<T> {
    const sw = Stopwatch.start()
    const req = { ...request }

    const { method, params } = request
    const endpoint = `${this.prefix}${parameterValue}${params ? `?${new URLSearchParams(params)}` : ''}`
    if (headers && Object.keys(headers).length) {
      Object.entries(headers).forEach(([headerKey, headerValue]) => {
        // @ts-ignore Todo
        req.headers.set(headerKey, headerValue)
      })
    }

    this.message.i(`\x1B[34m${operationDescription}\x1B[30m | ${method} | **${endpoint}** ...`)

    let response: Response

    try {
      response = await fetch(endpoint, req)

      if (!response.ok) {
        // eslint-disable-next-line max-len
        const msg = `\x1B[103m ${method}\x1B[30m |${operationDescription}: failed, status ${response.status} / ${response.statusText}`
        this.message.e(msg)

        if (response.status === HttpStatusCode.BAD_REQUEST) {
          const errors = await response.json()
          throw new ApiErrorFlow(errors)
        }
      }

      this.message.i(
        `\x1B[34m${operationDescription}\x1B[30m | ${method} | !!completed!! / \x1B[32m${sw.getDiff()}ms.\x1B[37m`,
      )

      return await resolvePayloadAsync(response)
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      this.message.e(`${operationDescription}: failed, ${e} / ${sw.getDiff()} ms.`)

      return Promise.reject(e)
    }
  }
}
