import {injectable} from 'inversify'
import {HttpStatusCode} from '~/src/shared/constants/httpStatusCodes'
import {ApiErrorFlow} from '~/src/shared/toolkit/apiErrorFlow'
import Stopwatch from '~/src/shared/toolkit/stopwatch'
import {ApiAdapter, IRequestAsync} from '~/src/app/adapters/apiAdapter'
import {ADAPTERS_ERRORS_CODES} from '~/src/shared/constants/ethCodes'

const ETH_PREFIX = 'public'
const ETH_PREFIX_WITHOUT_PUBLIC = ''

export const hostname = ['bitcoinetf.org', 'app.bitcoinetf.org'].includes(window.location.host) ? 'api.bitcoinetf.org' : 'api.stage.techetf.org'

@injectable()
export class EthAdapter extends ApiAdapter {

  prefix = ETH_PREFIX
  defaultRequest: Pick<Request, 'cache' | 'headers'> = {
    cache: 'no-cache',
    headers: new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }),
  }

  async requestAsync<T>({
                          apiVersion,
                          host = '',
                          parameterValue,
                          request,
                          resolvePayloadAsync,
                          operationDescription,
                          headers,
                          withoutPublic = false,
                        }: Omit<IRequestAsync, 'data'> & { request: Pick<Request, 'cache' | 'headers'> }): Promise<T> {
    const sw = Stopwatch.start()
    const req = {...request}

    const {method, params} = request

    this.prefix = withoutPublic ? ETH_PREFIX_WITHOUT_PUBLIC : ETH_PREFIX

    let endpoint = 'https://' + (host || hostname) + `/${apiVersion}${this.prefix ? '/' + this.prefix : this.prefix}/${parameterValue}`

    const mergedParams = {
      ...params,
    }

    endpoint = endpoint + `${this.filters.isEmpty(mergedParams) ? '' : `?${new URLSearchParams(mergedParams)}`}`

    if (headers && Object.keys(headers).length) {
      Object.entries(headers).forEach(([headerKey, headerValue]) => {
        // @ts-ignore
        req.headers.set(headerKey, headerValue)
      })
    }

    // console.log(`\x1B[34m${operationDescription}\x1B[30m | ${method} | **${endpoint}** ...`)

    if (this.store.auth.accessToken) {
      req.headers.set('Authorization', `JWTBearer ${this.store.auth.accessToken}`)
    } else {
      req.headers.delete('Authorization')
    }

    let response: Response
    let responseData

    try {
      response = await fetch(endpoint, req)

      if (!response.ok) {
        // eslint-disable-next-line max-len
        const msg = `\x1B[103m ${method}\x1B[30m |${operationDescription}: failed, status ${response.status} / ${response.statusText}`
        console.error(msg)
        const errors = await response.json()

        if(response.status === HttpStatusCode.CONFLICT) {
          throw new ApiErrorFlow(response.status as any);
        }

        if (response.status === HttpStatusCode.BAD_REQUEST || response.status === HttpStatusCode.UNPROCESSABLE_ENTITY) {
          throw new ApiErrorFlow(errors)
        }

        if (response.status === HttpStatusCode.UNAUTHORIZED) {
          if (errors.error.code === ADAPTERS_ERRORS_CODES.ETF.JWT_EXPIRED) {
            await this.store.auth.refresh()
            req.headers.set('Authorization', `JWTBearer ${this.store.auth.accessToken}`)

            response = await fetch(endpoint, req)
          }
        }
      }

      responseData = await resolvePayloadAsync(response)

      // console.log(
      //   `\x1B[34m${operationDescription}\x1B[30m | ${method} | !!completed!! / \x1B[32m${sw.getDiff()}ms.\x1B[37m`,
      // )

      return responseData
    } catch (e: any) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      console.error(`${operationDescription}: failed, ${e} / ${sw.getDiff()} ms.`)

      return Promise.reject(e)
    }
  }
}
