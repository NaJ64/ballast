import { EventBase } from '../../event-base';

export const GameViewLoaded = Symbol('GameViewLoaded');
export class GameViewLoadedEvent extends EventBase {
    public static readonly eventId: Symbol = GameViewLoaded;
    public eventId: Symbol = GameViewLoadedEvent.eventId;
}