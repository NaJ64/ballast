import { IDisposable } from '../interfaces/idisposable';
import { IEvent } from './ievent';

export type AsyncEventHandler<TEvent extends IEvent> = (event: TEvent) => Promise<void>

export interface IEventBus extends IDisposable {
    getHandlers<TEvent extends IEvent>(type: Symbol): AsyncEventHandler<TEvent>[];
    publishAsync<TEvent extends IEvent>(event: TEvent): Promise<void>;
    subscribe<TEvent extends IEvent>(type: Symbol, handler: AsyncEventHandler<TEvent>): void;
    unsubscribe<TEvent extends IEvent>(type: Symbol, handler: AsyncEventHandler<TEvent>): void;
}