import { EventBase } from '../../event-base';
export declare const GameViewLoaded: unique symbol;
export declare class GameViewLoadedEvent extends EventBase {
    static readonly eventId: Symbol;
}
