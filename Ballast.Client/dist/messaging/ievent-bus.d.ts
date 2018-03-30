import { IDisposable } from '../interfaces/idisposable';
import { IEvent } from './ievent';
export interface IEventBus extends IDisposable {
    publish<TEvent extends IEvent>(type: Symbol, event: TEvent): void;
    subscribe<TEvent extends IEvent>(type: Symbol, handler: (event: TEvent) => void): void;
    subscribeOnce<TEvent extends IEvent>(type: Symbol, handler: (event: TEvent) => void): void;
}
