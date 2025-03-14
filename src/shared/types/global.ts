export interface IAsset {
  id: string
  title: string
  shortTitle: string
  type: string
  earning: string
  apy: string
  symbol: string
  uuid: number
  name: string
  description: string
  full_balance: number
  incoming_amount_btc: number
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
  name: string
  value: any
  icon?: string
}

export type OrderType = 'init_btc' | 'usdt' | 'btc'

export type TPromoCardDetails = {
  name: 'brand' | 'tether' | 'bitcoin'
  title: string
  description: string
}
