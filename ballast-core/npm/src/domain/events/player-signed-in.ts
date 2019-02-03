import { EventBase } from "../../messaging/event-base";
import { Player } from "../models/player";

export class PlayerSignedInDomainEvent extends EventBase {

    public static readonly id: string = "PlayerSignedInDomainEvent";

    public get id() {
        return PlayerSignedInDomainEvent.id;
    }

    public readonly player: Player; 

    private constructor(eventDateIsoString: string, player: Player) {
        super(eventDateIsoString);
        this.player = player;
    }

    public static fromPlayer(player: Player) {
        return new PlayerSignedInDomainEvent(
            EventBase.getDateIsoString(),
            player
        );
    }

}