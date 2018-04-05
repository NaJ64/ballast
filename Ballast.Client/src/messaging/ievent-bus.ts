import { IDisposable } from '../interfaces/idisposable';
import { IEvent } from './ievent';

export type EventHandler<TEvent extends IEvent> = (event: TEvent) => void

export interface IEventBus extends IDisposable {
    getHandlers<TEvent extends IEvent>(type: Symbol): EventHandler<TEvent>[];
    publish<TEvent extends IEvent>(type: Symbol, event: TEvent): void;
    subscribe<TEvent extends IEvent>(type: Symbol, handler: EventHandler<TEvent>): void;
    unsubscribe<TEvent extends IEvent>(type: Symbol, handler: EventHandler<TEvent>): void;
}