import { inject, injectable } from 'inversify'
import { INVERSIFY_TYPES } from '~/src/shared/types/inversifyTypes'

@injectable()
export default class InfoPack {
  private readonly name = 'info-pack'
  private readonly fund
  private readonly event
  private readonly statistic
  private readonly billing
  private readonly blockchainProxy

  constructor(
    @inject(INVERSIFY_TYPES.FundApiModule) fundApi: any,
    @inject(INVERSIFY_TYPES.EventApiModule) eventApi: any,
    @inject(INVERSIFY_TYPES.StatisticApiModule) statisticApi: any,
    @inject(INVERSIFY_TYPES.BillingApiModule) billingApi: any,
    @inject(INVERSIFY_TYPES.BlockchainProxyApiModule) blockchainProxyApi: any,
  ) {
    this.fund = fundApi
    this.event = eventApi
    this.statistic = statisticApi
    this.billing = billingApi
    this.blockchainProxy = blockchainProxyApi
  }
}
