import { IEvent } from "./event";
import { getUtcNow } from "../utility/date-helpers";

export abstract class EventBase implements IEvent { 
    public abstract id: string;
    public eventDateIsoString: string;
    public constructor(dateIsoString?: string) {
        this.eventDateIsoString = dateIsoString || EventBase.getDateIsoString();
    }
    public static getDateIsoString() {
        return getUtcNow().toISOString();
    }
}