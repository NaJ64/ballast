import { IEvent } from "../../messaging/event";
import { EventBase } from "../../messaging/event-base";
import { IPlayerDto } from "../models/player-dto";

export interface IPlayerLeftGameEvent extends IEvent {
    readonly gameId: string;
    readonly player: IPlayerDto;
}

export class PlayerLeftGameEvent extends EventBase implements IPlayerLeftGameEvent {

    public static readonly id: string = "PlayerLeftGameEvent";

    public get id() {
        return PlayerLeftGameEvent.id;
    }

    public readonly gameId: string; 
    public readonly player: IPlayerDto;

    private constructor(eventDateIsoString: string, gameId: string, player: IPlayerDto) {
        super(eventDateIsoString);
        this.gameId = gameId;
        this.player = player;
    }

    public static fromJSON(json: IPlayerLeftGameEvent): PlayerLeftGameEvent {
        if (!json) {
            throw new Error("No json object was provided");
        }
        if (!json.id) {
            throw new Error("Missing id");
        }
        if (json.id != PlayerLeftGameEvent.id) {
            throw new Error("Id does not match event key");
        }
        if (!json.eventDateIsoString) {
            throw new Error("Missing eventDateIsoString");
        }
        if (!json.gameId) {
            throw new Error("Missing gameId");
        }
        if (!json.player) {
            throw new Error("Missing player");
        }
        return new PlayerLeftGameEvent(json.eventDateIsoString, json.gameId, json.player);
    }

    public static fromPlayerInGame(gameId: string, player: IPlayerDto) {
        return new PlayerLeftGameEvent(
            EventBase.getDateIsoString(),
            gameId,
            player
        );
    }

}