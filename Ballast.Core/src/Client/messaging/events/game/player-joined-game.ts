import { IGame } from '../../../models/game';
import { IPlayer } from '../../../models/player';
import { IEvent } from '../../event';
import { EventBase } from '../../event-base';

export interface IPlayerJoinedGameEvent extends IEvent {
    readonly game: IGame;
    readonly player: IPlayer;
}

export class PlayerJoinedGameEvent extends EventBase implements IPlayerJoinedGameEvent {

    public static readonly id: Symbol = Symbol.for('PlayerJoinedGameEvent');

    public get id() {
        return PlayerJoinedGameEvent.id;
    }

    public readonly game: IGame; 
    public readonly player: IPlayer; 

    public constructor(game: IGame, player: IPlayer) {
        super();
        this.game = game;
        this.player = player;
    }

}