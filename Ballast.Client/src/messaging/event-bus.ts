import { injectable } from 'inversify';
import { IEvent } from './ievent';
import { IEventBus, EventHandler } from './ievent-bus';

interface EventSubscription<TEvent extends IEvent> {
    key: Symbol;
    handler: EventHandler<TEvent>;
}

@injectable()
export class EventBus implements IEventBus {

    private readonly subscriptions: Map<Symbol, EventSubscription<IEvent>[]>;

    public constructor() {
        this.subscriptions = new Map<Symbol, EventSubscription<IEvent>[]>();
    }

    public getHandlers<TEvent extends IEvent>(key: Symbol): EventHandler<TEvent>[] {
        // get subscription list
        let subscriptions = this.getSubscriptions<TEvent>(key);
        // return projection to list of handler functions
        return subscriptions.map(x => x.handler);

    }

    private getSubscriptions<TEvent extends IEvent>(key: Symbol): EventSubscription<TEvent>[] {
        // check if the current event signature/key already exists
        if (!this.subscriptions.has(key)) {
            // set to new collection
            this.subscriptions.set(key, []);
        }
        // return the subscription list
        return this.subscriptions.get(key) || [];
    }

    public dispose(): void {
        // loop through all events
        this.subscriptions.forEach((subscription, key, map) => {
            // empty the subscriber collection for the current event
            subscription.length = 0;
        });
        // clear all mapped event subscriptions
        this.subscriptions.clear();
    }

    public publish<TEvent extends IEvent>(key: Symbol, event: TEvent) {
        // Get all subscribers for the current event key
        let subscriptions = this.getSubscriptions<TEvent>(key);
        // Loop through the subscribers
        for(let subscription of subscriptions) {
            // invoke the handler(s)
            subscription.handler(event);
        }
    }
    
    public subscribe<TEvent extends IEvent>(key: Symbol, handler: (event: TEvent) => void) {
        // Get all subscribers for the current event key
        let subscriptions = this.getSubscriptions<TEvent>(key);
        // Add a new handler
        subscriptions.push({ key: key, handler: handler });
    }
    
    public unsubscribe<TEvent extends IEvent>(key: Symbol, handler: (event: TEvent) => void) {
        // Get all subscribers for the current event key
        let subscriptions = this.getSubscriptions<TEvent>(key);
        // Find an index to remove where subscription.handler has reference equality
        let removeIndex = -1;
        for (let i=0; i < subscriptions.length; i++) {
            if (subscriptions[i].handler == handler) {
                removeIndex = i;
                break;
            }
        }
        // If the handler index was obtained
        if (removeIndex >= 0) {
            // remove the subscription from the collection
            subscriptions.splice(removeIndex, 1);
        }
    }

}