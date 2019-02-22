import { EventBase, IEvent } from "ballast-core";

export interface ICurrentDirectionModifiedEvent extends IEvent { }

export class CurrentDirectionModifiedEvent extends EventBase implements ICurrentDirectionModifiedEvent {

    public static readonly id: string = "CurrentDirectionModifiedEvent";
    public get id() {
        return CurrentDirectionModifiedEvent.id;
    }

    private constructor(eventDateIsoString: string) {
        super(eventDateIsoString);
    }

    public static create() {
        return new CurrentDirectionModifiedEvent(
            EventBase.getDateIsoString(),
        );
    }

}