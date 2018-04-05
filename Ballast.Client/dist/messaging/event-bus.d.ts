import { IEvent } from './ievent';
import { IEventBus, EventHandler } from './ievent-bus';
export declare class EventBus implements IEventBus {
    private readonly subscriptions;
    constructor();
    getHandlers<TEvent extends IEvent>(key: Symbol): EventHandler<TEvent>[];
    private getSubscriptions<TEvent>(key);
    dispose(): void;
    publish<TEvent extends IEvent>(key: Symbol, event: TEvent): void;
    subscribe<TEvent extends IEvent>(key: Symbol, handler: (event: TEvent) => void): void;
    unsubscribe<TEvent extends IEvent>(key: Symbol, handler: (event: TEvent) => void): void;
}
