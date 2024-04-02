import { injectable } from 'inversify'
import { auth } from '~/src/app/store/auth'
import { asset } from '~/src/app/store/asset'
import { assets } from '~/src/app/store/assets'
import { user } from '~/src/app/store/user'
import { persiste } from '~/src/app/store/persiste'
import { authGoogle } from '~/src/app/store/authGoogle'
import { authTelegram } from '~/src/app/store/authTelegram'
import { authTemp } from '~/src/app/store/authTemp'
import { purchase } from '~/src/app/store/purchase'


export interface IStorePack {
  _name: string
  _auth: any
  _asset: any
  _assets: any
  _user: any
  _persiste: any
  _authGoogle: any
  _authTelegram: any
  _authTemp: any
  _purchase: any
  readonly name: string
  readonly auth: any
  readonly asset: any
  readonly user: any
  readonly persiste: any
  readonly authGoogle: any
  readonly authTelegram: any
  readonly authTemp: any
  readonly purchase: any
}

@injectable()
export default class StorePack implements IStorePack {
  readonly _name = 'store-pack'
  readonly _auth
  readonly _asset
  readonly _assets
  readonly _user
  readonly _persiste
  readonly _authGoogle
  readonly _authTelegram
  readonly _authTemp
  readonly _purchase

  constructor() {
    this._auth = auth()
    this._asset = asset()
    this._user = user()
    this._assets = assets()
    this._persiste = persiste()
    this._authGoogle = authGoogle()
    this._authTelegram = authTelegram()
    this._authTemp = authTemp()
    this._purchase = purchase()
  }

  get name() {
    return this._name
  }

  get auth() {
    return this._auth
  }

  get asset() {
    return this._auth
  }

  get user() {
    return this._user
  }

  get assets() {
    return this._assets
  }

  get persiste() {
    return this._persiste
  }

  get authGoogle() {
    return this._authGoogle
  }

  get authTelegram() {
    return this._authTelegram
  }
  
  get authTemp() {
    return this._authTemp
  }

  get purchase() {
    return this._purchase
  }
}
