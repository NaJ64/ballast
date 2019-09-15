import { EventBase } from "../../messaging/event-base";
import { IApplicationEvent } from "../application-event";
import { IVesselDto } from "../models/vessel";

export interface IVesselStateChangedEvent extends IApplicationEvent {
    readonly gameId: string;
    readonly vessel: IVesselDto;
}

export class VesselStateChangedEvent extends EventBase implements IVesselStateChangedEvent {

    public static readonly id: string = "VesselStateChangedEvent";
    public get id() {
        return VesselStateChangedEvent.id;
    }

    public readonly gameId: string; 
    public readonly vessel: IVesselDto;

    private constructor(eventDateIsoString: string, gameId: string, vessel: IVesselDto) {
        super(eventDateIsoString);
        this.gameId = gameId;
        this.vessel = vessel;
    }

    public static fromJSON(json: IVesselStateChangedEvent): VesselStateChangedEvent {
        if (!json) {
            throw new Error("No json object was provided");
        }
        if (!json.id) {
            throw new Error("Missing id");
        }
        if (json.id != VesselStateChangedEvent.id) {
            throw new Error("Id does not match event key");
        }
        if (!json.eventDateIsoString) {
            throw new Error("Missing eventDateIsoString");
        }
        if (!json.gameId) {
            throw new Error("Missing gameId");
        }
        if (!json.vessel) {
            throw new Error("Missing vessel");
        }
        return new VesselStateChangedEvent(json.eventDateIsoString, json.gameId, json.vessel);
    }

    public static fromVesselInGame(gameId: string, vessel: IVesselDto) {
        return new VesselStateChangedEvent(
            EventBase.getDateIsoString(),
            gameId,
            vessel
        );
    }

}