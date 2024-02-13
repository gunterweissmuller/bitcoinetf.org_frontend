import { inject, injectable } from 'inversify'
import { INVERSIFY_TYPES } from '~/src/shared/types/inversifyTypes'

@injectable()
export default class EthPack {
  private readonly name = 'eth-pack'
  private readonly auth
  private readonly news
  private readonly kyc
  private readonly billingEth
  private readonly referral
  private readonly pages
  private readonly statisticEth

  constructor(
    @inject(INVERSIFY_TYPES.AuthApiModule) authApi: any,
    @inject(INVERSIFY_TYPES.NewsApiModule) newsApi: any,
    @inject(INVERSIFY_TYPES.KycApiModule) kycApi: any,
    @inject(INVERSIFY_TYPES.BillingEthApiModule) billingEthApi: any,
    @inject(INVERSIFY_TYPES.ReferralApiModule) referralApi: any,
    @inject(INVERSIFY_TYPES.PagesApiModule) pagesApi: any,
    @inject(INVERSIFY_TYPES.StatisticEthApiModule) statisticEthApi: any,
  ) {
    this.auth = authApi
    this.news = newsApi
    this.kyc = kycApi
    this.billingEth = billingEthApi
    this.referral = referralApi
    this.pages = pagesApi
    this.statisticEth = statisticEthApi
  }
}
