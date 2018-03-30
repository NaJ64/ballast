import { IEvent } from './ievent';

export abstract class EventBase implements IEvent {

    public static get eventId(): Symbol 
    {
        throw new Error("Event signature is missing / not implemented!");
    }

}