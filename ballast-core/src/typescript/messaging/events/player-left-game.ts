import { IGame } from '../../models/game';
import { IPlayer, Player } from '../../models/player';
import { IEvent } from '../event';
import { EventBase } from '../event-base';

export interface IPlayerLeftGameEvent extends IEvent {
    readonly gameId: string;
    readonly player: IPlayer;
}

export class PlayerLeftGameEvent extends EventBase implements IPlayerLeftGameEvent {

    public static readonly id: string = 'PlayerLeftGameEvent';

    public get id() {
        return PlayerLeftGameEvent.id;
    }

    public readonly gameId: string; 
    public readonly player: Player;

    private constructor(state: IPlayerLeftGameEvent) {
        super(state.isoDateTime);
        this.gameId = state.gameId;
        this.player = Player.fromObject(state.player);
    }

    public static fromObject(object: IPlayerLeftGameEvent) {
        return new PlayerLeftGameEvent(object);
    }

    public static fromPlayerInGame(game: IGame, player: IPlayer) {
        return new PlayerLeftGameEvent({
            id: PlayerLeftGameEvent.id,
            isoDateTime: EventBase.getIsoDateTime(),
            gameId: game.id,
            player: player
        });
    }

}