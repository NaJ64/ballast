import { EventBase, IEvent } from "ballast-core";

export interface ICurrentVesselRolesModifiedEvent extends IEvent { }

export class CurrentVesselRolesModifiedEvent extends EventBase implements ICurrentVesselRolesModifiedEvent {

    public static readonly id: string = "CurrentVesselRolesModifiedEvent";
    public get id() {
        return CurrentVesselRolesModifiedEvent.id;
    }

    private constructor(eventDateIsoString: string) {
        super(eventDateIsoString);
    }

    public static create() {
        return new CurrentVesselRolesModifiedEvent(
            EventBase.getDateIsoString(),
        );
    }

}