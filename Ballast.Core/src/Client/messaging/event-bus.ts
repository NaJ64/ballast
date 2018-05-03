import { IDisposable } from '../interfaces/disposable';
import { IEvent } from './event';

export type AsyncEventHandler<TEvent extends IEvent> = (event: TEvent) => Promise<void>

export interface IEventBus extends IDisposable {

    /**
     * Gets a list of all the current handlers/subscribers for the specified event type
     * @param type
     * A symbol uniquely identifying the event type
     */
    getHandlers<TEvent extends IEvent>(type: Symbol): AsyncEventHandler<TEvent>[];

    /**
     * Publishes an event to all subscribers for the specified event type
     * 
     * Event type is determined by the "id" property of the event being published
     * @param evt
     * The event to publish
     */
    publishAsync<TEvent extends IEvent>(evt: TEvent): Promise<void>;

    /**
     * Registers a new event subscription for the specified event type
     * @param type
     * A symbol uniquely identifying the event
     * @param handler
     * A new handler to be invoked when a new event is published
     */
    subscribe<TEvent extends IEvent>(type: Symbol, handler: AsyncEventHandler<TEvent>): void;

    /**
     * Removes the event subscription for the specified event type
     * @param type
     * A symbol uniquely identifying the event
     * @param handler
     * An existing handler for the current event
     */
    unsubscribe<TEvent extends IEvent>(type: Symbol, handler: AsyncEventHandler<TEvent>): void;

}