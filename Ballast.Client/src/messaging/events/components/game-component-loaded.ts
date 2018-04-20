import { EventBase } from '../../event';

export class GameComponentLoadedEvent extends EventBase {

    public static readonly id: Symbol = Symbol.for('GameComponentLoadedEvent');

    public get id() {
        return GameComponentLoadedEvent.id;
    }
    
}