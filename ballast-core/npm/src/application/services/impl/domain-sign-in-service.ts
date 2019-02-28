import { inject, injectable } from "inversify";
import { TYPES as BallastCore } from "../../../dependency-injection/types";
import { PlayerSignedInDomainEvent } from "../../../domain/events/player-signed-in";
import { PlayerSignedOutDomainEvent } from "../../../domain/events/player-signed-out";
import { Player } from "../../../domain/models/player";
import { IEventBus } from "../../../messaging/event-bus";
import { Guid } from "../../../utility/guid";
import { IPlayerDto } from "../../models/player-dto";
import { IPlayerSignInRequest } from "../../models/player-sign-in-request";
import { IPlayerSignOutRequest } from "../../models/player-sign-out-request";
import { ISignInService } from "../sign-in-service";

@injectable()
export class DomainSignInService implements ISignInService {

    private readonly _eventBus: IEventBus;
    private readonly _players: Map<string, Player>;

    public constructor(
        @inject(BallastCore.Messaging.IEventBus) eventBus: IEventBus
    ) {
        this._eventBus = eventBus;
        this._players = new Map<string, Player>();
    }

    public dispose() { 
        this._players.clear();
    }

    public static mapToPlayerDto(player: Player): IPlayerDto
    {
        return {
            id: player.id,
            name: player.name
        };
    }

    public async signInAsync(request: IPlayerSignInRequest): Promise<IPlayerDto> {
        let playerId = request && request.playerId || null;
        if (!playerId) {
            throw new Error("PlayerId must be provided");
        }
        let playerName = request && request.playerName || this.getTempPlayerName();
        if (!this._players.has(playerId)) {
            let player = new Player(
                playerId,
                playerName
            );
            this._players.set(playerId, player);
            await this._eventBus.publishAsync(PlayerSignedInDomainEvent.fromPlayer(player));
        }
        return DomainSignInService.mapToPlayerDto(this._players.get(playerId) as Player);
    }    

    public async signOutAsync(request: IPlayerSignOutRequest): Promise<void> {
        let playerId = request.playerId || null;
        if (!playerId) {
            throw new Error("PlayerId must be provided");
        }
        if (!this._players.has(playerId)) {
            throw new Error(`Player id not found (${playerId})`);
        }
        let player = this._players.get(playerId) as Player;
        this._players.delete(playerId);
        await this._eventBus.publishAsync(PlayerSignedOutDomainEvent.fromPlayer(player));
    }

    public getSignedInPlayerAsync(playerId: string): Promise<IPlayerDto | null> {
        if (!playerId || playerId == Guid.empty) {
            throw new Error("PlayerId must be provided");
        }
        if (!this._players.has(playerId)) {
            return Promise.resolve(null);
        }
        return Promise.resolve(DomainSignInService.mapToPlayerDto(this._players.get(playerId) as Player));
    }

    private getTempPlayerName(): string {
        let index = 1;
        let playerName = `Player${index}`;
        let players = Array.from(this._players.values());
        while (players.some(x => 
            !!x.name &&
            playerName.toLocaleLowerCase() == x.name.toLocaleLowerCase()
        )) {
            index++;
            playerName = `Player${index}`;
        }
        return playerName;
    }

}