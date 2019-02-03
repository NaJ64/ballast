import { EventBase } from "../../messaging/event-base";
import { Game } from "../models/game";
import { Player } from "../models/player";

export class PlayerJoinedGameDomainEvent extends EventBase {

    public static readonly id: string = "PlayerJoinedGameDomainEvent";

    public get id() {
        return PlayerJoinedGameDomainEvent.id;
    }

    public readonly gameId: string; 
    public readonly player: Player;

    private constructor(eventDateIsoString: string, gameId: string, player: Player) {
        super(eventDateIsoString);
        this.gameId = gameId;
        this.player = player;
    }

    public static fromPlayerInGame(game: Game, player: Player) {
        return new PlayerJoinedGameDomainEvent(
            EventBase.getDateIsoString(),
            game.id,
            player
        );
    }

}