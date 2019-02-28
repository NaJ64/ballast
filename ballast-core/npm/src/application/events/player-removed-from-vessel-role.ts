import { EventBase } from "../../messaging/event-base";
import { IApplicationEvent } from "../application-event";
import { IPlayerDto } from "../models/player-dto";
import { IVesselDto } from "../models/vessel-dto";

export interface IPlayerRemovedFromVesselRoleEvent extends IApplicationEvent {
    readonly gameId: string;
    readonly vessel: IVesselDto;
    readonly vesselRole: string;
    readonly player: IPlayerDto;
}

export class PlayerRemovedFromVesselRoleEvent extends EventBase implements IPlayerRemovedFromVesselRoleEvent {

    public static readonly id: string = "PlayerRemovedFromVesselRoleEvent";
    public get id() {
        return PlayerRemovedFromVesselRoleEvent.id;
    }

    public readonly gameId: string; 
    public readonly vessel: IVesselDto; 
    public readonly vesselRole: string; 
    public readonly player: IPlayerDto; 

    private constructor(eventDateIsoString: string, gameId: string, vessel: IVesselDto, vesselRole: string, player: IPlayerDto) {
        super(eventDateIsoString);
        this.gameId = gameId;
        this.vessel = vessel;
        this.vesselRole = vesselRole;
        this.player = player;
    }

    public static fromJSON(json: IPlayerRemovedFromVesselRoleEvent): PlayerRemovedFromVesselRoleEvent {
        if (!json) {
            throw new Error("No json object was provided");
        }
        if (!json.id) {
            throw new Error("Missing id");
        }
        if (json.id != PlayerRemovedFromVesselRoleEvent.id) {
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
        if (!json.vesselRole) {
            throw new Error("Missing vesselRole");
        }
        if (!json.player) {
            throw new Error("Missing player");
        }
        return new PlayerRemovedFromVesselRoleEvent(json.eventDateIsoString, json.gameId, json.vessel, json.vesselRole, json.player);
    }

    public static fromPlayerInGameVesselRole(gameId: string, vessel: IVesselDto, vesselRole: string, player: IPlayerDto) {
        return new PlayerRemovedFromVesselRoleEvent(
            EventBase.getDateIsoString(),
            gameId,
            vessel,
            vesselRole,
            player
        );
    }

}