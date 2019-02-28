import { inject, injectable } from "inversify";
import { TYPES as BallastCore } from "../../../dependency-injection/types";
import { GameStateChangedDomainEvent } from "../../../domain/events/game-state-changed";
import { PlayerAddedToVesselRoleDomainEvent } from "../../../domain/events/player-added-to-vessel-role";
import { PlayerJoinedGameDomainEvent } from "../../../domain/events/player-joined-game";
import { PlayerLeftGameDomainEvent } from "../../../domain/events/player-left-game";
import { PlayerRemovedFromVesselRoleDomainEvent } from "../../../domain/events/player-removed-from-vessel-role";
import { PlayerSignedInDomainEvent } from "../../../domain/events/player-signed-in";
import { PlayerSignedOutDomainEvent } from "../../../domain/events/player-signed-out";
import { VesselStateChangedDomainEvent } from "../../../domain/events/vessel-state-changed";
import { IEventBus } from "../../../messaging/event-bus";
import { IApplicationEvent } from "../../application-event";
import { GameStateChangedEvent } from "../../events/game-state-changed";
import { PlayerAddedToVesselRoleEvent } from "../../events/player-added-to-vessel-role";
import { PlayerJoinedGameEvent } from "../../events/player-joined-game";
import { PlayerLeftGameEvent } from "../../events/player-left-game";
import { PlayerRemovedFromVesselRoleEvent } from "../../events/player-removed-from-vessel-role";
import { PlayerSignedInEvent } from "../../events/player-signed-in";
import { PlayerSignedOutEvent } from "../../events/player-signed-out";
import { VesselStateChangedEvent } from "../../events/vessel-state-changed";
import { IApplicationEventEmitter } from "../application-event-emitter";
import { DomainGameService } from "./domain-game-service";

@injectable()
export class DomainApplicationEventEmitter implements IApplicationEventEmitter {

    private readonly _eventBus: IEventBus;
    private _isEnabled: boolean;

    public constructor(
        @inject(BallastCore.Messaging.IEventBus) eventBus: IEventBus
    ) {
        this._eventBus = eventBus;
        this._isEnabled = false;
        this.subscribeAll();
    }

    public dispose(): void {
        this._isEnabled = false;
        this.unsubscribeAll();
    }
    
    public get isEnabled(): boolean {
        return this._isEnabled;
    }

    public start() {
        this._isEnabled = true;
    }

    public stop() {
        this._isEnabled = false;
    }

    private subscribeAll() {
        this._eventBus.subscribe<GameStateChangedDomainEvent>(GameStateChangedDomainEvent.id, 
            this.onGameStateChangedDomainEventAsync);
        this._eventBus.subscribe<PlayerAddedToVesselRoleDomainEvent>(PlayerAddedToVesselRoleDomainEvent.id, 
            this.onPlayerAddedToVesselRoleDomainEventAsync);
        this._eventBus.subscribe<PlayerJoinedGameDomainEvent>(PlayerJoinedGameDomainEvent.id, 
            this.onPlayerJoinedGameDomainEventAsync);
        this._eventBus.subscribe<PlayerLeftGameDomainEvent>(PlayerLeftGameDomainEvent.id, 
            this.onPlayerLeftGameDomainEventAsync);
        this._eventBus.subscribe<PlayerRemovedFromVesselRoleDomainEvent>(PlayerRemovedFromVesselRoleDomainEvent.id, 
            this.onPlayerRemovedFromVesselRoleDomainEventAsync);
        this._eventBus.subscribe<PlayerSignedInDomainEvent>(PlayerSignedInDomainEvent.id, 
            this.onPlayerSignedInDomainEventAsync);
        this._eventBus.subscribe<PlayerSignedOutDomainEvent>(PlayerSignedOutDomainEvent.id, 
            this.onPlayerSignedOutDomainEventAsync);
        this._eventBus.subscribe<VesselStateChangedDomainEvent>(VesselStateChangedDomainEvent.id, 
            this.onVesselStateChangedDomainEventAsync);
    }

    private unsubscribeAll() {
        this._eventBus.unsubscribe<GameStateChangedDomainEvent>(GameStateChangedDomainEvent.id, 
            this.onGameStateChangedDomainEventAsync);
        this._eventBus.unsubscribe<PlayerAddedToVesselRoleDomainEvent>(PlayerAddedToVesselRoleDomainEvent.id, 
            this.onPlayerAddedToVesselRoleDomainEventAsync);
        this._eventBus.unsubscribe<PlayerJoinedGameDomainEvent>(PlayerJoinedGameDomainEvent.id, 
            this.onPlayerJoinedGameDomainEventAsync);
        this._eventBus.unsubscribe<PlayerLeftGameDomainEvent>(PlayerLeftGameDomainEvent.id, 
            this.onPlayerLeftGameDomainEventAsync);
        this._eventBus.unsubscribe<PlayerRemovedFromVesselRoleDomainEvent>(PlayerRemovedFromVesselRoleDomainEvent.id, 
            this.onPlayerRemovedFromVesselRoleDomainEventAsync);
        this._eventBus.unsubscribe<PlayerSignedInDomainEvent>(PlayerSignedInDomainEvent.id, 
            this.onPlayerSignedInDomainEventAsync);
        this._eventBus.unsubscribe<PlayerSignedOutDomainEvent>(PlayerSignedOutDomainEvent.id, 
            this.onPlayerSignedOutDomainEventAsync);
        this._eventBus.unsubscribe<VesselStateChangedDomainEvent>(VesselStateChangedDomainEvent.id, 
            this.onVesselStateChangedDomainEventAsync);
    }

        private publishIfEnabledAsync(evt: IApplicationEvent)
        {
            if (!this._isEnabled) // TODO: Make it so we don't even create application events if the flag is false
                return Promise.resolve(); 
            return this._eventBus.publishAsync(evt);
        }

        private onGameStateChangedDomainEventAsync(evt: GameStateChangedDomainEvent)
        {
            var gameDto = DomainGameService.mapToGameDto(evt.game);
            return this.publishIfEnabledAsync(GameStateChangedEvent.fromGame(gameDto));
        }

        private onPlayerAddedToVesselRoleDomainEventAsync(evt: PlayerAddedToVesselRoleDomainEvent)
        {
            var vesselDto = DomainGameService.mapToVesselDto(evt.vessel);
            var playerDto = DomainGameService.mapToPlayerDto(evt.player);
            return this.publishIfEnabledAsync(PlayerAddedToVesselRoleEvent.fromPlayerInGameVesselRole(
                evt.gameId,
                vesselDto,
                evt.vesselRole.name,
                playerDto
            ));
        }

        private onPlayerJoinedGameDomainEventAsync(evt: PlayerJoinedGameDomainEvent)
        {
            var playerDto = DomainGameService.mapToPlayerDto(evt.player);
            return this.publishIfEnabledAsync(PlayerJoinedGameEvent.fromPlayerInGame(
                evt.gameId,
                playerDto
            ));
        }

        private onPlayerLeftGameDomainEventAsync(evt: PlayerLeftGameDomainEvent)
        {
            var playerDto = DomainGameService.mapToPlayerDto(evt.player);
            return this.publishIfEnabledAsync(PlayerLeftGameEvent.fromPlayerInGame(
                evt.gameId,
                playerDto
            ));
        }

        private onPlayerRemovedFromVesselRoleDomainEventAsync(evt: PlayerRemovedFromVesselRoleDomainEvent)
        {
            var vesselDto = DomainGameService.mapToVesselDto(evt.vessel);
            var playerDto = DomainGameService.mapToPlayerDto(evt.player);
            return this.publishIfEnabledAsync(PlayerRemovedFromVesselRoleEvent.fromPlayerInGameVesselRole(
                evt.gameId,
                vesselDto,
                evt.vesselRole.name,
                playerDto
            ));
        }

        private onPlayerSignedInDomainEventAsync(evt: PlayerSignedInDomainEvent)
        {
            var playerDto = DomainGameService.mapToPlayerDto(evt.player);
            return this.publishIfEnabledAsync(PlayerSignedInEvent.fromPlayer(
                playerDto
            ));
        }

        private onPlayerSignedOutDomainEventAsync(evt: PlayerSignedOutDomainEvent)
        {
            var playerDto = evt.player != null ? DomainGameService.mapToPlayerDto(evt.player) : null;
            return this.publishIfEnabledAsync(PlayerSignedOutEvent.fromPlayer(
                playerDto
            ));
        }

        private onVesselStateChangedDomainEventAsync(evt: VesselStateChangedDomainEvent)
        {
            var vesselDto = DomainGameService.mapToVesselDto(evt.vessel);
            return this.publishIfEnabledAsync(VesselStateChangedEvent.fromVesselInGame(
                evt.gameId,
                vesselDto
            ));
        }

}