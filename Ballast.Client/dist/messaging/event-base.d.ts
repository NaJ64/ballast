import { IEvent } from './ievent';
export declare abstract class EventBase implements IEvent {
    abstract eventId: Symbol;
}
