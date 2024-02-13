import { inject, injectable } from 'inversify'
import { INVERSIFY_TYPES } from '~/src/shared/types/inversifyTypes'
import { LocalStorageType } from '~/src/app/localStorage'

// TODO: implements types
@injectable()
export default class App {
  private readonly name = 'app'
  private readonly _api
  private readonly _filters
  private readonly _store
  private readonly _localStorage: LocalStorageType

  constructor(
    @inject(INVERSIFY_TYPES.ApiPack) apiPack: any,
    @inject(INVERSIFY_TYPES.FiltersPack) filtersPack: any,
    @inject(INVERSIFY_TYPES.StorePack) storePack: any,
    @inject(INVERSIFY_TYPES.LocalStorage) localStorage: any,
  ) {
    this._api = apiPack
    this._filters = filtersPack
    this._store = storePack
    this._localStorage = localStorage.localStorage
  }

  get api() {
    return this._api
  }

  get store() {
    return this._store
  }

  get filters() {
    return this._filters
  }

  get localStorage() {
    return this._localStorage
  }
}
