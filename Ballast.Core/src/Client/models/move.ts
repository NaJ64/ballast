import { ModelBase } from './model-base';

export interface IMove { }

export class Move extends ModelBase<Move, IMove> implements IMove {

    public hydrate(data: IMove) {
        return this;
    }

}