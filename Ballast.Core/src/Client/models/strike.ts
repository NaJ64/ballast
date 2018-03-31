import { ModelBase } from './model-base';

export interface IStrike { }

export class Strike extends ModelBase<Strike, IStrike> implements IStrike {

    public hydrate(data: IStrike) {
        return this;
    }

}