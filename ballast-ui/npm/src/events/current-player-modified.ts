import { EventBase, IEvent } from "ballast-core";

export interface ICurrentPlayerModifiedEvent extends IEvent { }

export class CurrentPlayerModifiedEvent extends EventBase implements ICurrentPlayerModifiedEvent {

    public static readonly id: string = "CurrentPlayerModifiedEvent";
    public get id() {
        return CurrentPlayerModifiedEvent.id;
    }

    private constructor(eventDateIsoString: string) {
        super(eventDateIsoString);
    }

    public static create() {
        return new CurrentPlayerModifiedEvent(
            EventBase.getDateIsoString(),
        );
    }

}