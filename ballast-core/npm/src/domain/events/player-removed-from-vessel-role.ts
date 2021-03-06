import { EventBase } from "../../messaging/event-base";
import { IDomainEvent } from "../domain-event";
import { Game } from "../models/game";
import { Player } from "../models/player";
import { Vessel } from "../models/vessel";
import { VesselRole } from "../models/vessel-role";

export class PlayerRemovedFromVesselRoleDomainEvent extends EventBase implements IDomainEvent {

    public static readonly id: string = "PlayerRemovedFromVesselRoleDomainEvent";
    public get id() {
        return PlayerRemovedFromVesselRoleDomainEvent.id;
    }

    public readonly gameId: string; 
    public readonly vessel: Vessel; 
    public readonly vesselRole: VesselRole; 
    public readonly player: Player; 

    private constructor(evenDateIsoString: string, gameId: string, vessel: Vessel, vesselRole: VesselRole, player: Player) {
        super(evenDateIsoString);
        this.gameId = gameId;
        this.vessel = vessel;
        this.vesselRole = vesselRole;
        this.player = player;
    }

    public static fromPlayerInGameVesselRole(game: Game, vessel: Vessel, vesselRole: VesselRole, player: Player) {
        return new PlayerRemovedFromVesselRoleDomainEvent(
            EventBase.getDateIsoString(),
            game.id,
            vessel,
            vesselRole,
            player
        );
    }

}