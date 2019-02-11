import { EventBase } from "../../messaging/event-base";
import { IDomainEvent } from "../domain-event";
import { Game } from "../models/game";

export class GameStateChangedDomainEvent extends EventBase implements IDomainEvent {

    public static readonly id: string = "GameStateChangedDomainEvent";
    public get id() {
        return GameStateChangedDomainEvent.id;
    }

    public readonly game: Game | null; 

    private constructor(eventDateIsoString: string, game: Game | null = null) {
        super(eventDateIsoString);
        this.game = game || null;
    }

    public static fromGame(game?: Game) {
        return new GameStateChangedDomainEvent(
            EventBase.getDateIsoString(),
            game || null
        );
    }

}