import { IDisposable } from '../interfaces';
import { IEvent } from './ievent';
export interface IEventBus extends IDisposable {
    subscribe<TEvent extends IEvent>(type: Symbol, handler: (event: TEvent) => void): void;
    subscribeOnce<TEvent extends IEvent>(type: Symbol, handler: (event: TEvent) => void): void;
}
