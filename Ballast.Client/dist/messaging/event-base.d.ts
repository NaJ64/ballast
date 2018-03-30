import { IEvent } from './ievent';
export declare abstract class EventBase implements IEvent {
    static readonly eventId: Symbol;
}
