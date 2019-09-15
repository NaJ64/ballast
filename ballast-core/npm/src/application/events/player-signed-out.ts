import { EventBase } from "../../messaging/event-base";
import { IApplicationEvent } from "../application-event";
import { IPlayerDto } from "../models/player";

export interface IPlayerSignedOutEvent extends IApplicationEvent {
    readonly player: IPlayerDto | null;
}

export class PlayerSignedOutEvent extends EventBase implements IPlayerSignedOutEvent {

    public static readonly id: string = "PlayerSignedOutEvent";
    public get id() {
        return PlayerSignedOutEvent.id;
    }

    public readonly player: IPlayerDto | null; 

    private constructor(eventDateIsoString: string, player: IPlayerDto | null = null) {
        super(eventDateIsoString);
        this.player = player || null;
    }

    public static fromJSON(json: IPlayerSignedOutEvent): PlayerSignedOutEvent {
        if (!json) {
            throw new Error("No json object was provided");
        }
        if (!json.id) {
            throw new Error("Missing id");
        }
        if (json.id != PlayerSignedOutEvent.id) {
            throw new Error("Id does not match event key");
        }
        if (!json.eventDateIsoString) {
            throw new Error("Missing eventDateIsoString");
        }
        if (typeof json.player == "undefined") {
            throw new Error("Missing player");
        }
        return new PlayerSignedOutEvent(json.eventDateIsoString, json.player || null);
    }

    public static fromPlayer(player: IPlayerDto | null = null) {
        return new PlayerSignedOutEvent(
            EventBase.getDateIsoString(),
            player || null
        );
    }

}