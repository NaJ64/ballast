import "reflect-metadatat";

import "jest";
import { IEvent } from "../event";
import { IEventBus } from "../event-bus";
import { LocalEventBus } from "./local-event-bus";
import { getUtcNow } from "../../utility/date-helpers";

let handled = 0;
let eventKey = 'TestEvent';
let event: IEvent = { id: eventKey, eventDateIsoString: getUtcNow().toISOString() };
let handler1 = (event: IEvent) => {
    return new Promise<void>((resolve, reject) => {
        handled += 1;
        resolve();
    });
};
let handler2 = (event: IEvent) => {
    return new Promise<void>((resolve, reject) => {
        handled += 2;
        resolve();
    });
};
let eventBus: IEventBus = new LocalEventBus();

test('returns empty list for unsubscribed', () => {
    let handlers = eventBus.getHandlers(eventKey);
    expect(handlers.length).toBeLessThanOrEqual(0);
    expect(handlers).not.toContain(handler1);
    expect(handlers).not.toContain(handler2);
});

test('accepts new subscription(s)', () => {
    let handlers = eventBus.getHandlers(eventKey);
    expect(handlers).not.toContain(handler1);
    eventBus.subscribe<IEvent>(eventKey, handler1);
    handlers = eventBus.getHandlers<IEvent>(eventKey);
    expect(handlers).toContain(handler1);
    expect(handlers).not.toContain(handler2);
    eventBus.subscribe<IEvent>(eventKey, handler2);
    handlers = eventBus.getHandlers<IEvent>(eventKey);
    expect(handlers).toContain(handler2);
});

test('publishes event to all subscribers', async () => {
    expect(handled).toEqual(0);
    await eventBus.publishAsync(event);
    expect(handled).toEqual(3); // handled by both 1 + 2
    handled = 0;
}, 1000);

test('honors subscription removal', async () => {
    let handlers = eventBus.getHandlers<IEvent>(eventKey);
    expect(handlers).toContain(handler1);
    expect(handlers).toContain(handler2);
    eventBus.unsubscribe(eventKey, handler1);
    handlers = eventBus.getHandlers<IEvent>(eventKey);
    expect(handlers).not.toContain(handler1);
    expect(handlers).toContain(handler2);
    expect(handled).toEqual(0);
    await eventBus.publishAsync(event);
    expect(handled).toEqual(2); // handled by 2 only
});