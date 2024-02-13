export interface IAsset {
  id: string
  title: string
  shortTitle: string
  type: string
  earning: string
  apy: string
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
