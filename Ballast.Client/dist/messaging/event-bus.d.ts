import { IEvent } from './ievent';
import { IEventBus } from './ievent-bus';
export declare class EventBus implements IEventBus {
    dispose(): void;
    subscribe<TEvent extends IEvent>(eventSignature: Symbol, handler: (event: TEvent) => void): void;
    subscribeOnce<TEvent extends IEvent>(eventSignature: Symbol, handler: (event: TEvent) => void): void;
    publish<TEvent extends IEvent>(eventSignature: Symbol, event: TEvent): void;
}
