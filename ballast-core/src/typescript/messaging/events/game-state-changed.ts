import { Game, IGame } from '../../models/game';
import { IEvent } from '../event';
import { EventBase } from '../event-base';

export interface IGameStateChangedEvent extends IEvent {
    readonly game?: IGame;
}

export class GameStateChangedEvent extends EventBase implements IGameStateChangedEvent {

    public static readonly id: string = 'GameStateChangedEvent';

    public get id() {
        return GameStateChangedEvent.id;
    }

    public readonly game?: Game; 

    private constructor(state: IGameStateChangedEvent) {
        super(state.isoDateTime);
        this.game = state.game && Game.fromObject(state.game) || undefined;
    }

    public static fromObject(object: IGameStateChangedEvent) {
        return new GameStateChangedEvent(object);
    }

    public static fromGame(game?: Game) {
        return new GameStateChangedEvent({
            id: GameStateChangedEvent.id,
            isoDateTime: EventBase.getIsoDateTime(),
            game: game
        });
    }

}