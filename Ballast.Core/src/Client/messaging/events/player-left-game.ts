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
    public readonly player: Player;

    private constructor(state: IPlayerLeftGameEvent) {
        super(state.isoDateTime);
        this.game = Game.fromObject(state.game);
        this.player = Player.fromObject(state.player);
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