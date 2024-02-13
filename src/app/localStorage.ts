import { injectable } from 'inversify'

type LocalStorageKeys = Record<string, string | null>
type LocalStorageRemove = { remove: (key: string) => void }

export type LocalStorageType = Partial<LocalStorageKeys> & LocalStorageRemove

export interface ILocalStorage {
  name: string
  localStorage: LocalStorageType
}

const NotFreezedLocalStorage: LocalStorageType = {
  remove(key: string) {
    localStorage.removeItem(key)
  },
}

@injectable()
export default class LocalStorage implements ILocalStorage {
  readonly name = 'local-storage'
  readonly localStorage = Object.freeze(NotFreezedLocalStorage)
}
