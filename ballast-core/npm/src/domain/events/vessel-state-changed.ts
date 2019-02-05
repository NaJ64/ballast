import { EventBase } from "../../messaging/event-base";
import { Game } from "../models/game";
import { Vessel } from "../models/vessel";

export class VesselStateChangedDomainEvent extends EventBase {

    public static readonly id: string = 'VesselStateChangedDomainEvent';
    public get id() {
        return VesselStateChangedDomainEvent.id;
    }

    public readonly vessel: Vessel;
    public readonly gameId: string; 

    private constructor(eventDateIsoString: string, gameId: string, vessel: Vessel) {
        super(eventDateIsoString);
        this.gameId = gameId;
        this.vessel = vessel;
    }

    public static fromVesselInGame(game: Game, vessel: Vessel) {
        return new VesselStateChangedDomainEvent(
            EventBase.getDateIsoString(),
            game.id,
            vessel
        );
    }

}