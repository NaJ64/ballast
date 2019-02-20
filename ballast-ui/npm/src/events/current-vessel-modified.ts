import { EventBase, IEvent } from "ballast-core";

export interface ICurrentVesselModifiedEvent extends IEvent { }

export class CurrentVesselModifiedEvent extends EventBase implements ICurrentVesselModifiedEvent {

    public static readonly id: string = "CurrentVesselModifiedEvent";
    public get id() {
        return CurrentVesselModifiedEvent.id;
    }

    private constructor(eventDateIsoString: string) {
        super(eventDateIsoString);
    }

    public static create() {
        return new CurrentVesselModifiedEvent(
            EventBase.getDateIsoString(),
        );
    }

}