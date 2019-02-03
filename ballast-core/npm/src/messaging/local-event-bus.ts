import { injectable } from "inversify";
import { IEvent } from "./event";
import { AsyncEventHandler, IEventBus } from "./event-bus";

interface EventSubscription<TEvent extends IEvent> {
    key: string;
    asyncHandler: AsyncEventHandler<TEvent>;
}

@injectable()
export class LocalEventBus implements IEventBus {

    private readonly subscriptions: Map<string, EventSubscription<IEvent>[]>;

    public constructor() {
        this.subscriptions = new Map<string, EventSubscription<IEvent>[]>();
    }

    public getHandlers<TEvent extends IEvent>(key: string): AsyncEventHandler<TEvent>[] {
        // get subscription list
        let subscriptions = this.getSubscriptions<TEvent>(key);
        // return projection to list of handler functions
        return subscriptions.map(x => x.asyncHandler);

    }

    private getSubscriptions<TEvent extends IEvent>(key: string): EventSubscription<TEvent>[] {
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

    public async publishAsync<TEvent extends IEvent>(evt: TEvent): Promise<void> {
        // Get all subscribers for the current event key
        let subscriptions = this.getSubscriptions<TEvent>(evt.id);
        // Loop through the subscribers
        for(let subscription of subscriptions) {
            // invoke the handler(s)
            await subscription.asyncHandler(evt);
        }
    }
    
    public subscribe<TEvent extends IEvent>(key: string, asyncHandler: (evt: TEvent) => Promise<void>) {
        // Get all subscribers for the current event key
        let subscriptions = this.getSubscriptions<TEvent>(key);
        // Add a new handler
        subscriptions.push({ key: key, asyncHandler: asyncHandler });
    }
    
    public unsubscribe<TEvent extends IEvent>(key: string, asyncHandler: (evt: TEvent) => Promise<void>) {
        // Get all subscribers for the current event key
        let subscriptions = this.getSubscriptions<TEvent>(key);
        // Find an index to remove where subscription.handler has reference equality
        let removeIndex = -1;
        for (let i=0; i < subscriptions.length; i++) {
            if (subscriptions[i].asyncHandler == asyncHandler) {
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