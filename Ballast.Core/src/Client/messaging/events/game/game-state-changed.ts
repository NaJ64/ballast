import { Game } from '../../../models/game';
import { EventBase } from '../../event-base';

export class GameStateChangedEvent extends EventBase {

    public static readonly id: Symbol = Symbol.for('GameStateChangedEvent');

    public get id() {
        return GameStateChangedEvent.id;
    }

    public readonly game?: Game; 

    public constructor(game?: Game) {
        super();
        this.game = game;
    }

}