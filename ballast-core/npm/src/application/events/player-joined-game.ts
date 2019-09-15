import { EventBase } from "../../messaging/event-base";
import { IApplicationEvent } from "../application-event";
import { IPlayerDto } from "../models/player";

export interface IPlayerJoinedGameEvent extends IApplicationEvent {
    readonly gameId: string;
    readonly player: IPlayerDto;
}

export class PlayerJoinedGameEvent extends EventBase implements IPlayerJoinedGameEvent {

    public static readonly id: string = "PlayerJoinedGameEvent";
    public get id() {
        return PlayerJoinedGameEvent.id;
    }

    public readonly gameId: string; 
    public readonly player: IPlayerDto;

    private constructor(eventDateIsoString: string, gameId: string, player: IPlayerDto) {
        super(eventDateIsoString);
        this.gameId = gameId;
        this.player = player;
    }

    public static fromJSON(json: IPlayerJoinedGameEvent): PlayerJoinedGameEvent {
        if (!json) {
            throw new Error("No json object was provided");
        }
        if (!json.id) {
            throw new Error("Missing id");
        }
        if (json.id != PlayerJoinedGameEvent.id) {
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
        return new PlayerJoinedGameEvent(json.eventDateIsoString, json.gameId, json.player);
    }

    public static fromPlayerInGame(gameId: string, player: IPlayerDto) {
        return new PlayerJoinedGameEvent(
            EventBase.getDateIsoString(),
            gameId,
            player
        );
    }

}