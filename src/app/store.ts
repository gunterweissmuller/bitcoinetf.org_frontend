import { injectable } from 'inversify'
import { auth } from '~/src/app/store/auth'
import { asset } from '~/src/app/store/asset'
import { assets } from '~/src/app/store/assets'
import { user } from '~/src/app/store/user'
import { persiste } from '~/src/app/store/persiste'

export interface IStorePack {
  _name: string
  _auth: any
  _asset: any
  _assets: any
  _user: any
  _persiste: any
  readonly name: string
  readonly auth: any
  readonly asset: any
  readonly user: any
  readonly persiste: any
}

@injectable()
export default class StorePack implements IStorePack {
  readonly _name = 'store-pack'
  readonly _auth
  readonly _asset
  readonly _assets
  readonly _user
  readonly _persiste

  constructor() {
    this._auth = auth()
    this._asset = asset()
    this._user = user()
    this._assets = assets()
    this._persiste = persiste()
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
}
