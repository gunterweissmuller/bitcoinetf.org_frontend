import { inject, injectable } from 'inversify'
import { HTTPMethod } from '~/src/shared/constants/httpMethods'
import { ApiErrorFlow } from '~/src/shared/toolkit/apiErrorFlow'
import { INVERSIFY_TYPES } from '~/src/shared/types/inversifyTypes'
import axios from 'axios';

@injectable()
export default class BillingEthApiModule {
  readonly name = 'billingEth'
  readonly adapter
  readonly store

  constructor(@inject(INVERSIFY_TYPES.EthAdapter) adapter: any, @inject(INVERSIFY_TYPES.StorePack) store: any) {
    this.adapter = adapter
    this.store = store
  }

  async getLastPayment() {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'billing/payment/last',
        request: {
          method: HTTPMethod.GET,
        },
        operationDescription: 'Receiving the last payment',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async getPaymentStatistic() {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'billing/payment/statistic',
        request: {
          method: HTTPMethod.GET,
        },
        operationDescription: 'Obtaining personal information on payments',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async getWallets() {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: 'billing/wallets',
        request: {
          method: HTTPMethod.GET,
        },
        operationDescription: 'Getting a list of user wallets',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async getWallet(payload: { type: string }) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: `billing/wallets/${payload.type}`,
        request: {
          method: HTTPMethod.GET,
        },
        operationDescription: "Getting the user's wallet",
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async getPaymentWallets(replenishment_uuid?: any) {
    try {
      return await this.adapter.requestJsonAsync({
        apiVersion: 'v3',
        parameterValue: `billing/shares/payment/payment-methods${ replenishment_uuid ? '?replenishment_uuid=' + replenishment_uuid : '' }`,
        request: {
          method: HTTPMethod.GET,
        },
        operationDescription: 'Getting information about apollo and moonpay payment wallets',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async getTransactions(payload:any) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: `billing/transactions`,
        request: {
          method: HTTPMethod.GET,
          params: payload,
        },
        operationDescription: 'Getting a list of transactions',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async getSharesTransactions(payload:any) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: `billing/payment/shares/personal`,
        request: {
          method: HTTPMethod.GET,
          params: payload,
        },
        operationDescription: 'Getting a list of transactions',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
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

  async withdrawalDividends() {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: `billing/withdrawal/dividends`,
        request: {
          method: HTTPMethod.POST,
        },
        operationDescription: 'Withdrawal of dividends',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async withdrawalReferrals() {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: `billing/withdrawal/referrals`,
        request: {
          method: HTTPMethod.POST,
        },
        operationDescription: 'Withdrawal of referral funds',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async getBtcValue() {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: `billing/tokens`,
        request: {
          method: HTTPMethod.GET,
        },
        operationDescription: 'Getting btc value',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async getTransactionByUuid(payload) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: `billing/replenishment/${payload}`,
        request: {
          method: HTTPMethod.GET,
        },
        operationDescription: 'transaction by uuid',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async requestCreditCard() {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: `billing/credit-card/request`,
        request: {
          method: HTTPMethod.POST,
        },
        operationDescription: 'Method for creating a credit card request',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async getCreditCardRequestInfo() {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: `billing/credit-card/request/info`,
        request: {
          method: HTTPMethod.GET,
        },
        operationDescription: 'Method for obtaining information about your credit card request request',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async getMerchantMethods(payload) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: `billing/shares/buy/fiat/merchant001/methods?replenishment_uuid=${payload}`,
        request: {
          method: HTTPMethod.GET,
        },
        operationDescription: 'Getting a list of merchant methods',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async createPayment(payload) {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: `billing/shares/buy/fiat/merchant001/payment`,
        request: {
          method: HTTPMethod.POST,
        },
        data: payload,
        operationDescription: 'Create payment with merchant001',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async startCheckingTronPayment() {
    try {
      return await this.adapter.requestJsonAsync({
        parameterValue: `billing/shares/buy/blockchain/tron/check`,
        request: {
          method: HTTPMethod.POST,
        },
        operationDescription: 'Getting a list of merchant methods',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async buyShares(payload) {
    try {
      return await this.adapter.requestJsonAsync({
        apiVersion: 'v3',
        parameterValue: `billing/shares/buy/init`,
        request: {
          method: HTTPMethod.POST,
        },
        data: payload,
        operationDescription: 'Buying shares',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async initSellShares() {
    try {
      return await this.adapter.requestJsonAsync({
        apiVersion: 'v3',
        parameterValue: `billing/shares/sell/init`,
        request: {
          method: HTTPMethod.GET,
        },
        operationDescription: 'Getting a sell shares data',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async getValuate() {
    try {
      return await this.adapter.requestJsonAsync({
        apiVersion: 'v3',
        parameterValue: `billing/shares/sell/valuate`,
        request: {
          method: HTTPMethod.GET,
        },
        operationDescription: 'Getting a sell shares data',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }

  async confirmSellShares(payload) {
    try {
      return await this.adapter.requestJsonAsync({
        apiVersion: 'v3',
        parameterValue: `billing/shares/sell/confirm`,
        request: {
          method: HTTPMethod.POST,
        },
        data: payload,
        operationDescription: 'Confirm shares sell',
      })
    } catch (e) {
      if (e instanceof ApiErrorFlow) {
        throw new ApiErrorFlow(e.errors)
      }

      return Promise.reject(new Error('Something bad happened'))
    }
  }
}
