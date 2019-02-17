import { IBallastClientOptions, TYPES as BallastClient } from "ballast-client";
import { GameStateChangedEvent, Guid, IDisposable, IEventBus, IGameDto, IGameService, IGameStateChangedEvent, IPlayerAddedToVesselRoleEvent, IPlayerDto, IPlayerJoinedGameEvent, IPlayerLeftGameEvent, IPlayerRemovedFromVesselRoleEvent, IPlayerSignedInEvent, IPlayerSignedOutEvent, IVesselDto, IVesselStateChangedEvent, PlayerAddedToVesselRoleEvent, PlayerJoinedGameEvent, PlayerLeftGameEvent, PlayerRemovedFromVesselRoleEvent, PlayerSignedInEvent, PlayerSignedOutEvent, TYPES as BallastCore, VesselStateChangedEvent } from "ballast-core";
import { inject, injectable } from "inversify";

export interface IApplicationContext {
    readonly currentGame: IGameDto | null;
    readonly signedInPlayer: IPlayerDto | null;
    readonly currentVessel: IVesselDto | null;
    readonly currentVesselRoles: string[];
}

const VESSEL_ROLE_CAPTAIN = "captain";
const VESSEL_ROLE_RADIOMAN = "radioman";

@injectable()
export class ApplicationContext implements IApplicationContext, IDisposable {

    private readonly _clientOptions: IBallastClientOptions;
    private readonly _eventBus: IEventBus;
    private readonly _gameService: IGameService;
    
    private _game: IGameDto | null;
    private _player: IPlayerDto | null;
    private _vessel: IVesselDto | null;
    private _vesselRoles: string[];

    public constructor(
        @inject(BallastClient.DependencyInjection.IBallastClientOptions) clientOptions: IBallastClientOptions,
        @inject(BallastCore.Messaging.IEventBus) eventBus: IEventBus,
        @inject(BallastCore.Application.Services.IGameService) gameService: IGameService
    ) {
        this.rebindAllHandlers();
        this._clientOptions = clientOptions;
        this._eventBus = eventBus;
        this._gameService = gameService;
        this._game = null;
        this._player = null;
        this._vessel = null;
        this._vesselRoles = [];
        this.subscribeAllApplicationEvents();
    }

    public dispose() {
        this.unsubscribeAllApplicationEvents();
    }

    public get currentGame(): IGameDto | null {
        return this._game || null;
    }

    public get currentVessel(): IVesselDto | null {
        return this._vessel || null;
    }

    public get currentVesselRoles(): string[] {
        return this._vesselRoles || [];
    }

    public get signedInPlayer(): IPlayerDto | null {
        return this._player || null;
    }

    private rebindAllHandlers() {
        this.onGameStateChangedEventAsync = this.onGameStateChangedEventAsync.bind(this);
        this.onPlayerAddedToVesselRoleEventAsync = this.onPlayerAddedToVesselRoleEventAsync.bind(this);
        this.onPlayerJoinedGameEventAsync = this.onPlayerJoinedGameEventAsync.bind(this);
        this.onPlayerLeftGameEventAsync = this.onPlayerLeftGameEventAsync.bind(this);
        this.onPlayerRemovedFromVesselRoleEventAsync = this.onPlayerRemovedFromVesselRoleEventAsync.bind(this);
        this.onPlayerSignedInEventAsync = this.onPlayerSignedInEventAsync.bind(this);
        this.onPlayerSignedOutEventAsync = this.onPlayerSignedOutEventAsync.bind(this);
        this.onVesselStateChangedEventAsync = this.onVesselStateChangedEventAsync.bind(this);
    }

    private subscribeAllApplicationEvents() {
        this._eventBus.subscribe(GameStateChangedEvent.id, 
            this.onGameStateChangedEventAsync);
        this._eventBus.subscribe(PlayerAddedToVesselRoleEvent.id, 
            this.onPlayerAddedToVesselRoleEventAsync);
        this._eventBus.subscribe(PlayerJoinedGameEvent.id, 
            this.onPlayerJoinedGameEventAsync);
        this._eventBus.subscribe(PlayerLeftGameEvent.id, 
            this.onPlayerLeftGameEventAsync);
        this._eventBus.subscribe(PlayerRemovedFromVesselRoleEvent.id, 
            this.onPlayerRemovedFromVesselRoleEventAsync);
        this._eventBus.subscribe(PlayerSignedInEvent.id, 
            this.onPlayerSignedInEventAsync);
        this._eventBus.subscribe(PlayerSignedOutEvent.id, 
            this.onPlayerSignedOutEventAsync);
        this._eventBus.subscribe(VesselStateChangedEvent.id, 
            this.onVesselStateChangedEventAsync);
    }

    private unsubscribeAllApplicationEvents() {
        this._eventBus.unsubscribe(GameStateChangedEvent.id, 
            this.onGameStateChangedEventAsync);
        this._eventBus.unsubscribe(PlayerAddedToVesselRoleEvent.id, 
            this.onPlayerAddedToVesselRoleEventAsync);
        this._eventBus.unsubscribe(PlayerJoinedGameEvent.id, 
            this.onPlayerJoinedGameEventAsync);
        this._eventBus.unsubscribe(PlayerLeftGameEvent.id, 
            this.onPlayerLeftGameEventAsync);
        this._eventBus.unsubscribe(PlayerRemovedFromVesselRoleEvent.id, 
            this.onPlayerRemovedFromVesselRoleEventAsync);
        this._eventBus.unsubscribe(PlayerSignedInEvent.id, 
            this.onPlayerSignedInEventAsync);
        this._eventBus.unsubscribe(PlayerSignedOutEvent.id, 
            this.onPlayerSignedOutEventAsync);
        this._eventBus.unsubscribe(VesselStateChangedEvent.id, 
            this.onVesselStateChangedEventAsync);
    }

    private getClientId(): string {
        return this._clientOptions && this._clientOptions.clientId || Guid.empty;
    }

    private refreshVesselAndVesselRoles() {
        let playerId = this.getClientId();
        this._vessel = null;
        this._vesselRoles = [];
        if (this._game) {
            for(let vessel of this._game.vessels) {
                if (vessel.captainId == playerId) {
                    this._vessel = vessel;
                    this._vesselRoles.push(VESSEL_ROLE_CAPTAIN);
                }
                if (vessel.radiomanId == playerId) {
                    this._vessel = vessel;
                    this._vesselRoles.push(VESSEL_ROLE_RADIOMAN);
                }
                if (this._vessel && this._vessel.id == vessel.id) {
                    // If we found the player on one vessel, no need to continue looking
                    break;
                }
            }
        }
    }

    private async onPlayerSignedInEventAsync(evt: IPlayerSignedInEvent) {
        if (evt.player.id != this.getClientId()) {
            return;
        }
        this._player = evt.player;
    }

    private async onPlayerSignedOutEventAsync(evt: IPlayerSignedOutEvent) {
        if (!evt.player || evt.player.id != this.getClientId()) {
            return;
        }
        this._player = null;
        this._game = null;
        this.refreshVesselAndVesselRoles();
    }

    private async onGameStateChangedEventAsync(evt: IGameStateChangedEvent) {
        let playerId = this.getClientId();
        if (!evt.game) {
            // For now we will treat this as a generic "refresh" command
            if (this._game) {
                this._game = await this._gameService.getGameAsync(this._game.id);
            }
        } else {
            // Check if player still shows up in the game
            let playerFoundInNewGame = evt.game.players.find(x => x.id == playerId);
            if (playerFoundInNewGame) {
                // Player found in the game
                this._game = evt.game;
                this._player = playerFoundInNewGame; // Just in case
            } else if (this._game && this._game.id == evt.game.id) {
                // We were tracking this game but the player no longer shows up
                // Player appears to have been removed from the game but we missed the "PlayerLeftGame" event?
                this._game = null;
            } else {
                // This appears to be an event for a game we don't belong to
                return; // Short circuit without clearing any game / vessel / role info
            }
        }
        this.refreshVesselAndVesselRoles();
    }

    private async onPlayerJoinedGameEventAsync(evt: IPlayerJoinedGameEvent) {
        if (evt.player.id != this.getClientId()) {
            return;
        }
        this._player = evt.player; // Just in case
        this._game = await this._gameService.getGameAsync(evt.gameId);
        this.refreshVesselAndVesselRoles();
    }

    private async onPlayerLeftGameEventAsync(evt: IPlayerLeftGameEvent) {
        if (evt.player.id != this.getClientId()) {
            return;
        }
        this._player = evt.player; // Just in case
        // We assume the player can only belong to one game at a time, so event is treated as if we left the current game
        this._game = null;
        this.refreshVesselAndVesselRoles();
    }

    private async onPlayerAddedToVesselRoleEventAsync(evt: IPlayerAddedToVesselRoleEvent) {
        if (evt.player.id != this.getClientId()) {
            return;
        }
        this._player = evt.player; // Just in case
        this._game = await this._gameService.getGameAsync(evt.gameId);
        this.refreshVesselAndVesselRoles();
        
    }

    private async onPlayerRemovedFromVesselRoleEventAsync(evt: IPlayerRemovedFromVesselRoleEvent) {
        if (evt.player.id != this.getClientId()) {
            return;
        }
        this._player = evt.player; // Just in case
        this._game = await this._gameService.getGameAsync(evt.gameId);
        this.refreshVesselAndVesselRoles();
    }

    private async onVesselStateChangedEventAsync(evt: IVesselStateChangedEvent) {
        if (!this._game || this._game.id != evt.gameId) {
            return;
        }
        this._game = await this._gameService.getGameAsync(evt.gameId);
        this.refreshVesselAndVesselRoles();
    }


}