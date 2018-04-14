import { EventBase } from '../../event-base';
import { Game } from 'ballast-core';

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