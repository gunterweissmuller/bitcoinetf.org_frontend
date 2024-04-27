export interface IAsset {
  id: string
  title: string
  shortTitle: string
  type: string
  earning: string
  apy: string,
  symbol: string
}

interface IDealActivityType {
  type: string
  text: string
}

interface IDealToFrom {
  type: string
  text: string
}

export interface IDeal {
  title: string
  date: string
  type: string
  result: string
  purchase: string
  to: IDealToFrom
  from: IDealToFrom
  deal: string
  activityType?: IDealActivityType
}

export type IWalletType = 'dividends' | 'referral'
export type IMethod = 'none' | 'manual' | 'automatic_daily'

export interface ADropdownOption {
  name: string; // отображаемое значение
  value: any; // значение для логики
}

export type OrderType = 'init_btc' | 'usdt' | 'btc'
