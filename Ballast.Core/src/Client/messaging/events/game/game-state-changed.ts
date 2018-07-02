import { Game, IGame } from '../../../models/game';
import { IEvent } from '../../event';
import { EventBase } from '../../event-base';

export interface IGameStateChangedEvent extends IEvent {
    readonly game?: IGame;
}

export class GameStateChangedEvent extends EventBase implements IGameStateChangedEvent {

    public static readonly id: string = 'GameStateChangedEvent';

    public get id() {
        return GameStateChangedEvent.id;
    }

    public readonly game?: IGame; 

    public constructor(game?: Game)
    public constructor(game?: Game, isoDateTime?: string) {
        super(isoDateTime);
        this.game = game;
    }

}