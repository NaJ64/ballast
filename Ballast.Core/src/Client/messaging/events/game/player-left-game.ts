import { IGame } from '../../../models/game';
import { IPlayer } from '../../../models/player';
import { IEvent } from '../../event';
import { EventBase } from '../../event-base';

export interface IPlayerLeftGameEvent extends IEvent {
    readonly game: IGame;
    readonly player: IPlayer;
}

export class PlayerLeftGameEvent extends EventBase implements IPlayerLeftGameEvent {

    public static readonly id: string = 'PlayerLeftGameEvent';

    public get id() {
        return PlayerLeftGameEvent.id;
    }

    public readonly game: IGame; 
    public readonly player: IPlayer; 

    public constructor(game: IGame, player: IPlayer)
    public constructor(game: IGame, player: IPlayer, isoDateTime?: string) {
        super(isoDateTime);
        this.game = game;
        this.player = player;
    }

}