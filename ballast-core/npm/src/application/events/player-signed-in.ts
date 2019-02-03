import { IEvent } from "../../messaging/event";
import { EventBase } from "../../messaging/event-base";
import { IPlayerDto } from "../models/player-dto";

export interface IPlayerSignedInEvent extends IEvent {
    readonly player: IPlayerDto;
}

export class PlayerSignedInEvent extends EventBase implements IPlayerSignedInEvent {

    public static readonly id: string = "PlayerSignedInEvent";

    public get id() {
        return PlayerSignedInEvent.id;
    }

    public readonly player: IPlayerDto; 

    private constructor(eventDateIsoString: string, player: IPlayerDto) {
        super(eventDateIsoString);
        this.player = player;
    }

    public static fromJSON(json: IPlayerSignedInEvent): PlayerSignedInEvent {
        if (!json) {
            throw new Error("No json object was provided");
        }
        if (!json.id) {
            throw new Error("Missing id");
        }
        if (json.id != PlayerSignedInEvent.id) {
            throw new Error("Id does not match event key");
        }
        if (!json.eventDateIsoString) {
            throw new Error("Missing eventDateIsoString");
        }
        if (!json.player) {
            throw new Error("Missing player");
        }
        return new PlayerSignedInEvent(json.eventDateIsoString, json.player);
    }

    public static fromPlayer(player: IPlayerDto) {
        return new PlayerSignedInEvent(
            EventBase.getDateIsoString(),
            player
        );
    }

}