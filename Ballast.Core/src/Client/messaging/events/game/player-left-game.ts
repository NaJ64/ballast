import { IGame } from '../../../models/game';
import { IPlayer } from '../../../models/player';
import { EventBase } from '../../event-base';

export interface IPlayerLeftGameEvent {
    readonly game: IGame;
    readonly player: IPlayer;
}

export class PlayerLeftGameEvent extends EventBase implements IPlayerLeftGameEvent {

    public static readonly id: Symbol = Symbol.for('PlayerLeftGameEvent');

    public get id() {
        return PlayerLeftGameEvent.id;
    }

    public readonly game: IGame; 
    public readonly player: IPlayer; 

    public constructor(game: IGame, player: IPlayer) {
        super();
        this.game = game;
        this.player = player;
    }

}