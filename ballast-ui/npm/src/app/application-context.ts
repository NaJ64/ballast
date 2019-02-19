import { IBallastClientOptions, TYPES as BallastClient } from "ballast-client";
import { GameStateChangedEvent, Guid, IDisposable, IEventBus, IGameDto, IGameService, IGameStateChangedEvent, IPlayerAddedToVesselRoleEvent, IPlayerDto, IPlayerJoinedGameEvent, IPlayerLeftGameEvent, IPlayerRemovedFromVesselRoleEvent, IPlayerSignedInEvent, IPlayerSignedOutEvent, IVesselDto, IVesselStateChangedEvent, PlayerAddedToVesselRoleEvent, PlayerJoinedGameEvent, PlayerLeftGameEvent, PlayerRemovedFromVesselRoleEvent, PlayerSignedInEvent, PlayerSignedOutEvent, TYPES as BallastCore, VesselStateChangedEvent } from "ballast-core";
import { inject, injectable } from "inversify";

export interface IApplicationContext {
    readonly signedInPlayer: IPlayerDto | null;
    readonly signedInPlayerModified: boolean;
    readonly currentGame: IGameDto | null;
    readonly currentGameModified: boolean;
    readonly currentVessel: IVesselDto | null;
    readonly currentVesselModified: boolean;
    readonly currentVesselRoles: string[];
    readonly currentVesselRolesModified: boolean;
    resetModifiedFlags(): void;
}

const VESSEL_ROLE_CAPTAIN = "Captain";
const VESSEL_ROLE_RADIOMAN = "Radioman";

@injectable()
export class ApplicationContext implements IApplicationContext, IDisposable {

    protected readonly _clientOptions: IBallastClientOptions;
    protected readonly _eventBus: IEventBus;
    protected readonly _gameService: IGameService;
    
    protected _game: IGameDto | null;
    protected _gameModified: boolean;

    protected _player: IPlayerDto | null;
    protected _playerModified: boolean;

    protected _vessel: IVesselDto | null;
    protected _vesselModified: boolean;

    protected _vesselRoles: string[];
    protected _vesselRolesModified: boolean;

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
        this._gameModified = false;
        this._player = null;
        this._playerModified = false;
        this._vessel = null;
        this._vesselModified = false;
        this._vesselRoles = [];
        this._vesselRolesModified = false;
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

    public get currentGameModified(): boolean {
        return this._gameModified;
    }

    public get currentVesselModified(): boolean {
        return this._vesselModified;
    }

    public get currentVesselRolesModified(): boolean {
        return this._vesselRolesModified;
    }

    public get signedInPlayerModified(): boolean {
        return this._playerModified;
    }

    public resetModifiedFlags() {
        this._playerModified = false;
        this._gameModified = false;
        this._vesselModified = false;
        this._vesselRolesModified = false;
    }

    protected rebindAllHandlers() {
        this.onGameStateChangedEventAsync = this.onGameStateChangedEventAsync.bind(this);
        this.onPlayerAddedToVesselRoleEventAsync = this.onPlayerAddedToVesselRoleEventAsync.bind(this);
        this.onPlayerJoinedGameEventAsync = this.onPlayerJoinedGameEventAsync.bind(this);
        this.onPlayerLeftGameEventAsync = this.onPlayerLeftGameEventAsync.bind(this);
        this.onPlayerRemovedFromVesselRoleEventAsync = this.onPlayerRemovedFromVesselRoleEventAsync.bind(this);
        this.onPlayerSignedInEventAsync = this.onPlayerSignedInEventAsync.bind(this);
        this.onPlayerSignedOutEventAsync = this.onPlayerSignedOutEventAsync.bind(this);
        this.onVesselStateChangedEventAsync = this.onVesselStateChangedEventAsync.bind(this);
    }

    protected subscribeAllApplicationEvents() {
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

    protected unsubscribeAllApplicationEvents() {
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

    protected getClientId(): string {
        return this._clientOptions && this._clientOptions.clientId || Guid.empty;
    }

    protected refreshSignedInPlayer(player: IPlayerDto | null) {
        // Retain the old player for comparison
        let oldPlayer = this._player;
        this._playerModified = false;
        // Check if we signed in
        if (!oldPlayer && player) {
            this._playerModified = true;
        }
        // Check if we signed out
        if (oldPlayer && !player) {
            this._playerModified = true;
        }
        // Check if we changed id(s) ???
        if (oldPlayer && player && oldPlayer.id != player.id) {
            this._playerModified = true;
        }
        // Update the locally saved player
        this._player = player;
    }

    protected refreshGame(game: IGameDto | null) {
        // Retain the old game for comparison
        let oldGame = this._game;
        this._gameModified = false;
        // Check if we joined the game
        if (!oldGame && game) {
            this._gameModified = true;
        }
        // Check if we left the game
        if (oldGame && !game) {
            this._gameModified = true;
        }
        // Check if we have a new game
        if (oldGame && game && oldGame.id != game.id) {
            this._gameModified = true;
        }
        // Check if game got a new board
        if (oldGame && game && oldGame.board.id != game.board.id) {
            this._gameModified = true;
        }
        // Check if players changed
        if (oldGame && game && oldGame.players && game.players) {
            if (oldGame.players.length != game.players.length) {
                this._gameModified = true;
            }
            let i = oldGame.players.length;
            while (i--) {
                if (oldGame.players[i].id != game.players[i].id) {
                    this._gameModified = true;
                }
            }
        }
        // Check if vessels changed
        if (oldGame && game && oldGame.vessels && game.vessels) {
            if (oldGame.vessels.length != game.vessels.length) {
                this._gameModified = true;
            }
            let i = oldGame.vessels.length;
            while (i--) {
                if (oldGame.vessels[i].id != game.vessels[i].id) {
                    this._gameModified = true;
                }
                if (oldGame.vessels[i].captainId != game.vessels[i].captainId) {
                    this._gameModified = true;
                }
                if (oldGame.vessels[i].radiomanId != game.vessels[i].radiomanId) {
                    this._gameModified = true;
                }
            }
        }
        // Update the local game
        this._game = game;
        // Always refresh vessel roles when game changes
        this.refreshVesselAndVesselRoles();
    }

    protected refreshVesselAndVesselRoles() {
        // Retain the old vessel info for comparison
        let oldVessel = this._vessel;
        this._vesselModified = false;
        let oldVesselRoles = this._vesselRoles;
        this._vesselRolesModified = false;
        let playerId = this.getClientId();
        let vessel = null;
        let vesselRoles = [];
        if (this._game) {
            for(let vesselInGame of this._game.vessels) {
                if (vesselInGame.captainId == playerId) {
                    vessel = vesselInGame;
                    vesselRoles.push(VESSEL_ROLE_CAPTAIN);
                }
                if (vesselInGame.radiomanId == playerId) {
                    vessel = vesselInGame;
                    vesselRoles.push(VESSEL_ROLE_RADIOMAN);
                }
                if (vessel && vessel.id == vesselInGame.id) {
                    // If we found the player on one vessel, no need to continue looking
                    break;
                }
            }
        }
        // Check if we joined a vessel
        if (!oldVessel && vessel) {
            this._vesselModified = true;
        }
        // Check if we left a vessel
        if (oldVessel && !vessel) {
            this._vesselModified = true;
        }
        // Check if we have a new vessel
        if (oldVessel && vessel && oldVessel.id != vessel.id) {
            this._vesselModified = true;
        }
        // Check if the vessel moved
        if (oldVessel && vessel && oldVessel.orderedTriple.toString() != vessel.orderedTriple.toString()) {
            this._vesselModified = true;
        }
        // Check if vessel roles changed
        if (oldVesselRoles.length != vesselRoles.length) {
            this._vesselRolesModified = true;
        }
        let i = oldVesselRoles.length;
        while (i--) {
            if (oldVesselRoles[i] != vesselRoles[i]) {
                this._vesselRolesModified = true;
            }
        }
        // Update the local vessel & vessel roles
        this._vessel = vessel;
        this._vesselRoles = vesselRoles;
    }

    protected async onPlayerSignedInEventAsync(evt: IPlayerSignedInEvent) {
        if (evt.player.id != this.getClientId()) {
            return;
        }
        this.refreshSignedInPlayer(evt.player);
    }

    protected async onPlayerSignedOutEventAsync(evt: IPlayerSignedOutEvent) {
        if (!evt.player || evt.player.id != this.getClientId()) {
            return;
        }
        this.refreshSignedInPlayer(null);
        this.refreshGame(null);
    }

    protected async onGameStateChangedEventAsync(evt: IGameStateChangedEvent) {
        let playerId = this.getClientId();
        let newGame: IGameDto | null = null;
        if (!evt.game) {
            // For now we will treat this as a generic "refresh" command
            if (this._game) {
                newGame = await this._gameService.getGameAsync(this._game.id);
            }
        } else {
            // Check if player still shows up in the game
            let playerFoundInNewGame = evt.game.players.find(x => x.id == playerId);
            if (playerFoundInNewGame) {
                // Player found in the game
                newGame = evt.game;
                this._player = playerFoundInNewGame; // Just in case
            } else if (this._game && this._game.id == evt.game.id) {
                // We were tracking this game but the player no longer shows up
                // Player appears to have been removed from the game but we missed the "PlayerLeftGame" event?
                newGame = null;
            } else {
                // This appears to be an event for a game we don't belong to
                return; // Short circuit without clearing any game / vessel / role info
            }
        }
        this.refreshGame(newGame);
    }

    protected async onPlayerJoinedGameEventAsync(evt: IPlayerJoinedGameEvent) {
        if (evt.player.id != this.getClientId()) {
            return;
        }
        this.refreshSignedInPlayer(evt.player); // Just in case
        let game = await this._gameService.getGameAsync(evt.gameId);
        this.refreshGame(game);
    }

    protected async onPlayerLeftGameEventAsync(evt: IPlayerLeftGameEvent) {
        if (evt.player.id != this.getClientId()) {
            return;
        }
        this.refreshSignedInPlayer(evt.player); // Just in case
        // We assume the player can only belong to one game at a time, so event is treated as if we left the current game
        this.refreshGame(null);
    }

    protected async onPlayerAddedToVesselRoleEventAsync(evt: IPlayerAddedToVesselRoleEvent) {
        if (evt.player.id != this.getClientId()) {
            return;
        }
        this.refreshSignedInPlayer(evt.player); // Just in case
        let game = await this._gameService.getGameAsync(evt.gameId);
        this.refreshGame(game);
    }

    protected async onPlayerRemovedFromVesselRoleEventAsync(evt: IPlayerRemovedFromVesselRoleEvent) {
        if (evt.player.id != this.getClientId()) {
            return;
        }
        this.refreshSignedInPlayer(evt.player); // Just in case
        let game = await this._gameService.getGameAsync(evt.gameId);
        this.refreshGame(game);
    }

    protected async onVesselStateChangedEventAsync(evt: IVesselStateChangedEvent) {
        if (!this._game || this._game.id != evt.gameId) {
            return;
        }
        let game = await this._gameService.getGameAsync(evt.gameId);
        this.refreshGame(game);
    }

}