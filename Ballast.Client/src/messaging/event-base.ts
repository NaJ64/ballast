import { IEvent } from './ievent';

export abstract class EventBase implements IEvent {
    public abstract eventId: Symbol;
}