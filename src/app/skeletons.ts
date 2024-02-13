import { injectable, inject } from 'inversify'
import { SkeletonId, SkeletonObject } from '~/src/shared/types'
import { INVERSIFY_TYPES } from '~/src/shared/types/inversifyTypes'

@injectable()
export default class Skeletons {
  private readonly name = 'skeleton'
  private readonly _store
  private readonly _params

  constructor(@inject(INVERSIFY_TYPES.StorePack) storePack: any) {
    this._store = storePack
    this._params = {
      status: 'pending',
      delay: 0,
    }
  }

  show(id: SkeletonId, params: SkeletonObject = {}): SkeletonId {
    const paramsObj = {
      id: id as SkeletonId,
      params: { ...this._params, ...params },
    }

    this._store.skeletons.setSkeleton(paramsObj)
    return id
  }

  hide(id: SkeletonId): SkeletonId | false {
    if (this.isPending(id)) {
      const skeleton = this._store.skeletons.list[id]

      setTimeout(() => {
        this._store.skeletons.dropSkeleton(id)
      }, skeleton.delay)

      return id
    }

    return false
  }

  get isPending() {
    return (id: SkeletonId): boolean => {
      const skeleton = this._store.skeletons.list[id]
      return !!(skeleton && skeleton.status === 'pending')
    }
  }
}
