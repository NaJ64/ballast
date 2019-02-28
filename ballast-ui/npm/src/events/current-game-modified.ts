import { EventBase, IEvent } from "ballast-core";

export interface ICurrentGameModifiedEvent extends IEvent { }

export class CurrentGameModifiedEvent extends EventBase implements ICurrentGameModifiedEvent {

    public static readonly id: string = "CurrentGameModifiedEvent";
    public get id() {
        return CurrentGameModifiedEvent.id;
    }

    private constructor(eventDateIsoString: string) {
        super(eventDateIsoString);
    }

    public static create() {
        return new CurrentGameModifiedEvent(
            EventBase.getDateIsoString(),
        );
    }

}