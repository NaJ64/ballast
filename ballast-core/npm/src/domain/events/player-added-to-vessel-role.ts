import { EventBase } from "../../messaging/event-base";
import { Game } from "../models/game";
import { Player } from "../models/player";
import { Vessel } from "../models/vessel";
import { VesselRole } from "../models/vessel-role";

export class PlayerAddedToVesselRoleDomainEvent extends EventBase {

    public static readonly id: string = "PlayerAddedToVesselRoleDomainEvent";

    public get id() {
        return PlayerAddedToVesselRoleDomainEvent.id;
    }

    public readonly gameId: string; 
    public readonly vessel: Vessel; 
    public readonly vesselRole: VesselRole; 
    public readonly player: Player; 

    private constructor(eventDateIsoString: string, gameId: string, vessel: Vessel, vesselRole: VesselRole, player: Player) {
        super(eventDateIsoString);
        this.gameId = gameId;
        this.vessel = vessel;
        this.vesselRole = vesselRole;
        this.player = player;
    }

    public static fromPlayerInGameVesselRole(game: Game, vessel: Vessel, vesselRole: VesselRole, player: Player) {
        return new PlayerAddedToVesselRoleDomainEvent(
            EventBase.getDateIsoString(),
            game.id,
            vessel,
            vesselRole,
            player
        );
    }

}