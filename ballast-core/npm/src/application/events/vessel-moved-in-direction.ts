import { EventBase } from "../../messaging/event-base";
import { IApplicationEvent } from "../application-event";
import { IVesselDto } from "../models/vessel";
import { IDirection } from "../models/direction";

export interface IVesselMovedInDirectionEvent extends IApplicationEvent {
    readonly gameId: string;
    readonly vessel: IVesselDto;
    readonly direction: IDirection;
}

export class VesselMovedInDirectionEvent extends EventBase implements IVesselMovedInDirectionEvent {

    public static readonly id: string = "VesselMovedInDirectionEvent";
    public get id() {
        return VesselMovedInDirectionEvent.id;
    }

    public readonly gameId: string; 
    public readonly vessel: IVesselDto;
    public readonly direction: IDirection;

    private constructor(eventDateIsoString: string, gameId: string, vessel: IVesselDto, direction: IDirection) {
        super(eventDateIsoString);
        this.gameId = gameId;
        this.vessel = vessel;
        this.direction = direction;
    }

    public static fromJSON(json: IVesselMovedInDirectionEvent): VesselMovedInDirectionEvent {
        if (!json) {
            throw new Error("No json object was provided");
        }
        if (!json.id) {
            throw new Error("Missing id");
        }
        if (json.id != VesselMovedInDirectionEvent.id) {
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
        if (!json.direction) {
            throw new Error("Missing vessel");
        }
        return new VesselMovedInDirectionEvent(json.eventDateIsoString, json.gameId, json.vessel, json.direction);
    }

    public static fromVesselDirectionInGame(gameId: string, vessel: IVesselDto, direction: IDirection) {
        return new VesselMovedInDirectionEvent(
            EventBase.getDateIsoString(),
            gameId,
            vessel,
            direction
        );
    }

}