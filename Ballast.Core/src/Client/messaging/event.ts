export interface IEvent {
    id: Symbol;
}

export abstract class EventBase implements IEvent { 
    public abstract id: Symbol;
}