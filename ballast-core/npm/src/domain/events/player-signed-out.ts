import { EventBase } from "../../messaging/event-base";
import { Player } from "../models/player";

export class PlayerSignedOutDomainEvent extends EventBase {

    public static readonly id: string = "PlayerSignedOutDomainEvent";

    public get id() {
        return PlayerSignedOutDomainEvent.id;
    }

    public readonly player: Player | null; 

    private constructor(eventDateIsoString: string, player: Player | null = null) {
        super(eventDateIsoString);
        this.player = player || null;
    }

    public static fromPlayer(player: Player | null = null) {
        return new PlayerSignedOutDomainEvent(
            EventBase.getDateIsoString(),
            player
        );
    }

}