import { EventBase } from '../../event-base';

export const GameComponentLoaded = Symbol.for('GameComponentLoaded');
export class GameComponentLoadedEvent extends EventBase {
    public static readonly eventId: Symbol = GameComponentLoaded;
    public eventId: Symbol = GameComponentLoadedEvent.eventId;
}