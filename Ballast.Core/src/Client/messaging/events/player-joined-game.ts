import { Game, IGame } from '../../models/game';
import { IPlayer, Player } from '../../models/player';
import { IEvent } from '../event';
import { EventBase } from '../event-base';

export interface IPlayerJoinedGameEvent extends IEvent {
    readonly game: IGame;
    readonly player: IPlayer;
}

export class PlayerJoinedGameEvent extends EventBase implements IPlayerJoinedGameEvent {

    public static readonly id: string = 'PlayerJoinedGameEvent';

    public get id() {
        return PlayerJoinedGameEvent.id;
    }

    public readonly game: Game; 

    private readonly _playerId: string; 
    public get player(): Player {
        let player = this.game.players.find(x => x.id == this._playerId);
        if (!player) {
            throw new Error("Could not locate player using specified id");
        }
        return player;
    }

    private constructor(state: IPlayerJoinedGameEvent) {
        super(state.isoDateTime);
        this.game = Game.fromObject(state.game);
        this._playerId = state.player.id;
    }

    public static fromObject(object: IPlayerJoinedGameEvent) {
        return new PlayerJoinedGameEvent(object);
    }

    public static fromPlayerInGame(game: IGame, player: IPlayer) {
        return new PlayerJoinedGameEvent({
            id: PlayerJoinedGameEvent.id,
            isoDateTime: EventBase.getIsoDateTime(),
            game: game,
            player: player
        });
    }

}