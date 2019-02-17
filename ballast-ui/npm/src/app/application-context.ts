import { IBallastClientOptions, TYPES as BallastClient } from "ballast-client";
import { ChatMessageSentEvent, GameStateChangedEvent, IEventBus, IGameDto, IPlayerDto, IVesselDto, PlayerAddedToVesselRoleEvent, PlayerJoinedGameEvent, PlayerLeftGameEvent, PlayerRemovedFromVesselRoleEvent, PlayerSignedInEvent, PlayerSignedOutEvent, TYPES as BallastCore, VesselStateChangedEvent, IGameStateChangedEvent, IChatMessageSentEvent, IPlayerAddedToVesselRoleEvent, IPlayerJoinedGameEvent, IPlayerLeftGameEvent, IPlayerRemovedFromVesselRoleEvent, IPlayerSignedInEvent, IPlayerSignedOutEvent, IVesselStateChangedEvent, IDisposable, Guid, IGameService } from "ballast-core";
import { inject, injectable } from "inversify";

export interface IApplicationContext {
    readonly game: IGameDto | null;
    readonly player: IPlayerDto | null;
    readonly vessel: IVesselDto | null;
}

@injectable()
export class ApplicationContext implements IApplicationContext, IDisposable {

    private readonly _clientOptions: IBallastClientOptions;
    private readonly _eventBus: IEventBus;
    private readonly _gameService: IGameService;
    
    private _game: IGameDto | null;
    private _player: IPlayerDto | null;
    private _vessel: IVesselDto | null;

    public constructor(
        @inject(BallastClient.DependencyInjection.IBallastClientOptions) clientOptions: IBallastClientOptions,
        @inject(BallastCore.Messaging.IEventBus) eventBus: IEventBus,
        @inject(BallastCore.Application.Services.IGameService) gameService: IGameService
    ) {
        this._clientOptions = clientOptions;
        this._eventBus = eventBus;
        this._gameService = gameService;
        this._game = null;
        this._player = null;
        this._vessel = null;
        this.subscribeAll();
    }

    public dispose() {
        this.unsubscribeAll();
    }

    private getClientId(): string {
        return this._clientOptions && this._clientOptions.clientId || Guid.empty;
    }

    private subscribeAll() {
        this._eventBus.subscribe<IGameStateChangedEvent>(GameStateChangedEvent.id, 
            this.onGameStateChangedEventAsync);
        this._eventBus.subscribe<IPlayerAddedToVesselRoleEvent>(PlayerAddedToVesselRoleEvent.id, 
            this.onPlayerAddedToVesselRoleEventAsync);
        this._eventBus.subscribe<IPlayerJoinedGameEvent>(PlayerJoinedGameEvent.id, 
            this.onPlayerJoinedGameEventAsync);
        this._eventBus.subscribe<IPlayerLeftGameEvent>(PlayerLeftGameEvent.id, 
            this.onPlayerLeftGameEventAsync);
        this._eventBus.subscribe<IPlayerRemovedFromVesselRoleEvent>(PlayerRemovedFromVesselRoleEvent.id, 
            this.onPlayerRemovedFromVesselRoleEventAsync);
        this._eventBus.subscribe<IPlayerSignedInEvent>(PlayerSignedInEvent.id, 
            this.onPlayerSignedInEventAsync);
        this._eventBus.subscribe<IPlayerSignedOutEvent>(PlayerSignedOutEvent.id, 
            this.onPlayerSignedOutEventAsync);
        this._eventBus.subscribe<IVesselStateChangedEvent>(VesselStateChangedEvent.id, 
            this.onVesselStateChangedEventAsync);
    }

    private unsubscribeAll() {
        this._eventBus.unsubscribe<IGameStateChangedEvent>(GameStateChangedEvent.id, 
            this.onGameStateChangedEventAsync);
        this._eventBus.unsubscribe<IPlayerAddedToVesselRoleEvent>(PlayerAddedToVesselRoleEvent.id, 
            this.onPlayerAddedToVesselRoleEventAsync);
        this._eventBus.unsubscribe<IPlayerJoinedGameEvent>(PlayerJoinedGameEvent.id, 
            this.onPlayerJoinedGameEventAsync);
        this._eventBus.unsubscribe<IPlayerLeftGameEvent>(PlayerLeftGameEvent.id, 
            this.onPlayerLeftGameEventAsync);
        this._eventBus.unsubscribe<IPlayerRemovedFromVesselRoleEvent>(PlayerRemovedFromVesselRoleEvent.id, 
            this.onPlayerRemovedFromVesselRoleEventAsync);
        this._eventBus.unsubscribe<IPlayerSignedInEvent>(PlayerSignedInEvent.id, 
            this.onPlayerSignedInEventAsync);
        this._eventBus.unsubscribe<IPlayerSignedOutEvent>(PlayerSignedOutEvent.id, 
            this.onPlayerSignedOutEventAsync);
        this._eventBus.unsubscribe<IVesselStateChangedEvent>(VesselStateChangedEvent.id, 
            this.onVesselStateChangedEventAsync);
    }

    // TODO:  Correct these methods below to properly set the game/vessel/player state based on application events

    private async onGameStateChangedEventAsync(evt: IGameStateChangedEvent) {
        if (!this._game) {
            return; // Nothing to do if we aren't in a game yet (game should be set upon signing-in)
        }
        if (!evt.game) {
            this._game = await this._gameService.getGameAsync(this._game.id);
            return;
        }
        if (evt.game.id == this._game.id) {
            this._game = evt.game;
        }
    }

    private async onPlayerAddedToVesselRoleEventAsync(evt: IPlayerAddedToVesselRoleEvent) {
        if (evt.player.id == this.getClientId()) {
            this._vessel = evt.vessel;
        }
    }

    private async onPlayerJoinedGameEventAsync(evt: IPlayerJoinedGameEvent) {
        if (evt.player.id == this.getClientId()) {
            this._game = await this._gameService.getGameAsync(evt.gameId);
            this._player = evt.player;
        }
    }

    private async onPlayerLeftGameEventAsync(evt: IPlayerLeftGameEvent) {
        if (!this._player || !this._game) {
            return; // Nothing to do if we haven't signed in yet
        }
        if (
            this._player.id == evt.player.id &&
            this._game.id == evt.gameId
        ) {
            // Player has left the current game
            this._game == null;
        }
    }

    private async onPlayerRemovedFromVesselRoleEventAsync(evt: IPlayerRemovedFromVesselRoleEvent) {
        if (!this._player || !this._game || !this._vessel) {
            return; // Nothing to do if we haven't signed in yet or we aren't on any vessels
        }
        if (
            this._player.id == evt.player.id &&
            this._game.id == evt.gameId &&
            this._vessel.id == evt.vessel.id
        ) {
            this._game == await this._gameService.getGameAsync(evt.gameId);
        }
    }

    private async onPlayerSignedInEventAsync(evt: IPlayerSignedInEvent) {
        if (evt.player.id == this.getClientId()) {
            this._player = evt.player;
            this._game = null;
            this._vessel = null;
        }
    }

    private async onPlayerSignedOutEventAsync(evt: IPlayerSignedOutEvent) {
        if (evt.player && evt.player.id == this.getClientId()) {
            this._player = null;
            this._game = null;
            this._vessel = null;
        }
    }

    private async onVesselStateChangedEventAsync(evt: IVesselStateChangedEvent) {

    }

    public get game(): IGameDto | null {
        return this._game || null;
    }

    public get player(): IPlayerDto | null {
        return this._player || null;
    }

    public get vessel(): IVesselDto | null {
        return this._vessel || null;
    }

}