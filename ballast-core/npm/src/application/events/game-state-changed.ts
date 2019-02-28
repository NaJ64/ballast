import { EventBase } from "../../messaging/event-base";
import { IApplicationEvent } from "../application-event";
import { IGameDto } from "../models/game-dto";

export interface IGameStateChangedEvent extends IApplicationEvent {
    readonly game: IGameDto | null;
}

export class GameStateChangedEvent extends EventBase implements IGameStateChangedEvent {

    public static readonly id: string = "GameStateChangedEvent";
    public get id() {
        return GameStateChangedEvent.id;
    }

    public readonly game: IGameDto; 

    private constructor(createdIsoString: string, game: IGameDto) {
        super(createdIsoString);
        this.game = game;
    }

    public static fromJSON(json: IGameStateChangedEvent): GameStateChangedEvent {
        if (!json) {
            throw new Error("No json object was provided");
        }
        if (!json.id) {
            throw new Error("Missing id");
        }
        if (json.id != GameStateChangedEvent.id) {
            throw new Error("Id does not match event key");
        }
        if (!json.eventDateIsoString) {
            throw new Error("Missing eventDateIsoString");
        }
        if (!json.game) {
            throw new Error("Missing game");
        }
        return new GameStateChangedEvent(json.eventDateIsoString, json.game);
    }

    public static fromGame(game: IGameDto) {
        return new GameStateChangedEvent(
            EventBase.getDateIsoString(),
            game
        );
    }

}