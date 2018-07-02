import { IEvent } from './event';
import { getUtcNow } from '../utility/date-helpers';

export abstract class EventBase implements IEvent { 
    public abstract id: string;
    public isoDateTime: string;
    public constructor(isoDateTime?: string) {
        this.isoDateTime = isoDateTime || getUtcNow().toISOString();
    }
}