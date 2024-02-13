import 'reflect-metadata'
import { Container, ContainerModule, interfaces } from 'inversify'
import { INVERSIFY_TYPES } from '~/src/shared/types/inversifyTypes'
import App from '~/src/app/app'
import FiltersPack from '~/src/shared/toolkit/filters'
import StorePack from '~/src/app/store'
import LocalStorage from '~/src/app/localStorage'
import ApiPack from '~/src/shared/api/apiPack'
import { EthAdapter } from '~/src/app/adapters/ethAdapter'
import { InfoAdapter } from '~/src/app/adapters/infoAdapter'


// Import Modules for Fund Info Backend
import InfoPack from '~/src/shared/api/infoPack'
import FundApiModule from '~/src/shared/api/info/fund/fundApiModule'
import EventApiModule from '~/src/shared/api/info/event/eventApiModule'
import StatisticApiModule from '~/src/shared/api/info/statistic/statisticApiModule'
import BillingApiModule from '~/src/shared/api/info/billing/billingApiModule'
import BlockchainProxyApiModule from '~/src/shared/api/info/blockchainProxy/blockchainProxyApiModule'


// Import Modules for ETH Backend
import EthPack from '~/src/shared/api/ethPack'
import StatisticEthApiModule from '~/src/shared/api/eth/statisticEth/statisticEthApiModule'
import AuthApiModule from '~/src/shared/api/eth/auth/authApiModule'
import NewsApiModule from '~/src/shared/api/eth/news/newsApiModule'
import KycApiModule from '~/src/shared/api/eth/kyc/kycApiModule'
import ReferralApiModule from '~/src/shared/api/eth/referral/referralApiModule'
import PagesApiModule from '~/src/shared/api/eth/pages/pagesApiModule'
import BillingEthApiModule from '~/src/shared/api/eth/billingEth/billingEthApiModule'

declare module '#app' {
  interface NuxtApp {
    $app: App
  }
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind(INVERSIFY_TYPES.Application).to(App).inSingletonScope() // The main plugins entry point
  bind(INVERSIFY_TYPES.FiltersPack).to(FiltersPack).inSingletonScope() // Filters Pack with helpers methods
  bind(INVERSIFY_TYPES.StorePack).to(StorePack).inSingletonScope() // Store Pack with store modules
  bind(INVERSIFY_TYPES.LocalStorage).to(LocalStorage).inSingletonScope() // Store Pack with store modules
  bind(INVERSIFY_TYPES.ApiPack).to(ApiPack).inSingletonScope() // The main api pack with several backends
  bind(INVERSIFY_TYPES.EthAdapter).to(EthAdapter).inTransientScope() // Modal Popup with store modules
  bind(INVERSIFY_TYPES.InfoAdapter).to(InfoAdapter).inTransientScope() // Modal Popup with store modules

  // Bindings Module Classes for Eth Backend
  bind(INVERSIFY_TYPES.EthPack).to(EthPack).inSingletonScope()
  bind(INVERSIFY_TYPES.InfoPack).to(InfoPack).inSingletonScope()
  bind(INVERSIFY_TYPES.AuthApiModule).to(AuthApiModule).inSingletonScope()
  bind(INVERSIFY_TYPES.FundApiModule).to(FundApiModule).inSingletonScope()
  bind(INVERSIFY_TYPES.EventApiModule).to(EventApiModule).inSingletonScope()
  bind(INVERSIFY_TYPES.NewsApiModule).to(NewsApiModule).inSingletonScope()
  bind(INVERSIFY_TYPES.StatisticApiModule).to(StatisticApiModule).inSingletonScope()
  bind(INVERSIFY_TYPES.StatisticEthApiModule).to(StatisticEthApiModule).inSingletonScope()
  bind(INVERSIFY_TYPES.KycApiModule).to(KycApiModule).inSingletonScope()
  bind(INVERSIFY_TYPES.BillingEthApiModule).to(BillingEthApiModule).inSingletonScope()
  bind(INVERSIFY_TYPES.BillingApiModule).to(BillingApiModule).inSingletonScope()
  bind(INVERSIFY_TYPES.ReferralApiModule).to(ReferralApiModule).inSingletonScope()
  bind(INVERSIFY_TYPES.PagesApiModule).to(PagesApiModule).inSingletonScope()
  bind(INVERSIFY_TYPES.BlockchainProxyApiModule).to(BlockchainProxyApiModule).inSingletonScope()
})

export default defineNuxtPlugin(() => {
  const DIContainer = new Container()

  DIContainer.load(appBindings)

  const app = DIContainer.get<App>(INVERSIFY_TYPES.Application)

  return {
    provide: {
      app,
    },
  }
})
