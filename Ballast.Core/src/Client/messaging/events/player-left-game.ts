import { Game, IGame } from '../../models/game';
import { IPlayer, Player } from '../../models/player';
import { IEvent } from '../event';
import { EventBase } from '../event-base';

export interface IPlayerLeftGameEvent extends IEvent {
    readonly game: IGame;
    readonly player: IPlayer;
}

export class PlayerLeftGameEvent extends EventBase implements IPlayerLeftGameEvent {

    public static readonly id: string = 'PlayerLeftGameEvent';

    public get id() {
        return PlayerLeftGameEvent.id;
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

    private constructor(state: IPlayerLeftGameEvent) {
        super(state.isoDateTime);
        this.game = Game.fromObject(state.game);
        this._playerId = state.player.id;
    }

    public static fromObject(object: IPlayerLeftGameEvent) {
        return new PlayerLeftGameEvent(object);
    }

    public static fromPlayerInGame(game: IGame, player: IPlayer) {
        return new PlayerLeftGameEvent({
            id: PlayerLeftGameEvent.id,
            isoDateTime: EventBase.getIsoDateTime(),
            game: game,
            player: player
        });
    }

}