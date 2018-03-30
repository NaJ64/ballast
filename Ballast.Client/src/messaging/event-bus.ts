import { injectable } from 'inversify';
import { IEvent } from './ievent';
import { IEventBus } from './ievent-bus';

@injectable()
export class EventBus implements IEventBus {

    public dispose(): void {
        // TODO:  Implement this by disposing of all event subscriptions/handler(s)
    }

    public publish<TEvent extends IEvent>(eventSignature: Symbol, event: TEvent) {
        // TODO:  Implement this by calling all subscriber(s)/handler(s) (and then removing any if necessary)
    }
    
    public subscribe<TEvent extends IEvent>(eventSignature: Symbol, handler: (event: TEvent) => void) {
        // TODO:  Implement this with a local map of handler(s) to event signature(s)
    }
    
    public subscribeOnce<TEvent extends IEvent>(eventSignature: Symbol, handler: (event: TEvent) => void) {
        // TODO:  Implement this with a local map of handler(s) to event signature(s)
    }

}