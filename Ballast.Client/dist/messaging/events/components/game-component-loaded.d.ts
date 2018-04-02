import { EventBase } from '../../event-base';
export declare const GameComponentLoaded: unique symbol;
export declare class GameComponentLoadedEvent extends EventBase {
    static readonly eventId: Symbol;
    eventId: Symbol;
}
