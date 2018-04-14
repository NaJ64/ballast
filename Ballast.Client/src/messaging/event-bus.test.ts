import 'jest';
import 'reflect-metadata';
import { IEvent } from './ievent';
import { EventBus } from './event-bus';

let handled = 0;
let eventKey = Symbol.for('TestEvent');
let event: IEvent = { id: eventKey };
let handler1 = (event: IEvent) => {
    handled += 1;
};
let handler2 = (event: IEvent) => {
    handled += 2;
};
let eventBus = new EventBus();

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

test('publishes event to all subscribers', () => {
    expect(handled).toEqual(0);
    eventBus.publish(event);
    expect(handled).toEqual(3); // handled by both 1 + 2
    handled = 0;
}, 1000);

test('honors subscription removal', () => {
    let handlers = eventBus.getHandlers<IEvent>(eventKey);
    expect(handlers).toContain(handler1);
    expect(handlers).toContain(handler2);
    eventBus.unsubscribe(eventKey, handler1);
    handlers = eventBus.getHandlers<IEvent>(eventKey);
    expect(handlers).not.toContain(handler1);
    expect(handlers).toContain(handler2);
    expect(handled).toEqual(0);
    eventBus.publish(event);
    expect(handled).toEqual(2); // handled by 2 only
});