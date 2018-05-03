import { IEvent } from './event';

export abstract class EventBase implements IEvent { 
    public abstract id: Symbol;
}