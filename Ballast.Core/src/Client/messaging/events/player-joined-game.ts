import { IGame } from '../../models/game';
import { IPlayer, Player } from '../../models/player';
import { IEvent } from '../event';
import { EventBase } from '../event-base';

export interface IPlayerJoinedGameEvent extends IEvent {
    readonly gameId: string;
    readonly player: IPlayer;
}

export class PlayerJoinedGameEvent extends EventBase implements IPlayerJoinedGameEvent {

    public static readonly id: string = 'PlayerJoinedGameEvent';

    public get id() {
        return PlayerJoinedGameEvent.id;
    }

    public readonly gameId: string; 
    public readonly player: Player;

    private constructor(state: IPlayerJoinedGameEvent) {
        super(state.isoDateTime);
        this.gameId = state.gameId;
        this.player = Player.fromObject(state.player);
    }

    public static fromObject(object: IPlayerJoinedGameEvent) {
        return new PlayerJoinedGameEvent(object);
    }

    public static fromPlayerInGame(game: IGame, player: IPlayer) {
        return new PlayerJoinedGameEvent({
            id: PlayerJoinedGameEvent.id,
            isoDateTime: EventBase.getIsoDateTime(),
            gameId: game.id,
            player: player
        });
    }

}