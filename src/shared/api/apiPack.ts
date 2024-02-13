import {injectable, inject} from 'inversify'
import {INVERSIFY_TYPES} from '~/src/shared/types/inversifyTypes'

@injectable()
export default class ApiPack {
    private readonly name = 'api-pack'
    private readonly _ethPack
    private readonly _infoPack

    constructor(
        @inject(INVERSIFY_TYPES.EthPack) ethPack: any,
        @inject(INVERSIFY_TYPES.InfoPack) infoPack: any,
    ) {
        this._ethPack = ethPack
        this._infoPack = infoPack
    }

    get eth() {
        return this._ethPack
    }

    get info() {
        return this._infoPack
    }
}
