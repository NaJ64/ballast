import * as signalR from '@aspnet/signalr';
import { Game, GameStateChangedEvent, IAddPlayerOptions, ICreateGameOptions, IEventBus, IGame, IGameService, IPlayerJoinedGameEvent, IPlayerLeftGameEvent, IRemovePlayerOptions, IVessel, IVesselMoveRequest, PlayerJoinedGameEvent, PlayerLeftGameEvent, IVesselStateChangedEvent, VesselStateChangedEvent } from 'ballast-core';
import { inject, injectable } from 'inversify';
import { TYPES_BALLAST } from '../../ioc/types';
import { IGameClientService } from '../game-client-service';
import { SignalRServiceBase } from './signalr-service-base';
import { ISignalRServiceOptions } from './signalr-service-options';

@injectable()
export class SignalRGameService extends SignalRServiceBase implements IGameService, IGameClientService {

    public constructor(
        @inject(TYPES_BALLAST.IEventBus) eventBus: IEventBus,
        @inject(TYPES_BALLAST.ISignalRServiceOptionsFactory) serviceOptionsFactory: () => ISignalRServiceOptions
    ) {
        super(eventBus, serviceOptionsFactory);
    }

    protected get hubName() {
        return 'gamehub';
    }

    protected afterSubscribe(hubConnection: signalR.HubConnection) {
        hubConnection.on('GameStateChanged', this.onGameStateChanged.bind(this));
        hubConnection.on('PlayerJoinedGame', this.onPlayerJoinedGame.bind(this));
        hubConnection.on('PlayerLeftGame', this.onPlayerLeftGame.bind(this));
        hubConnection.on('VesselStateChanged', this.onVesselStateChanged.bind(this));
    }

    protected beforeUnsubscribe(hubConnection: signalR.HubConnection) {
        hubConnection.off('GameStateChanged');
        hubConnection.off('PlayerJoinedGame');
        hubConnection.off('PlayerLeftGame');
        hubConnection.off('VesselStateChanged');
    }

    private onGameStateChanged(update: IGame) {
        let game = Game.fromObject(update);
        let gameStateChanged = GameStateChangedEvent.fromGame(game);
        this.eventBus.publishAsync(gameStateChanged); // Fire and forget
    }

    private onPlayerJoinedGame(evt: IPlayerJoinedGameEvent) {
        let playerJoinedGame = PlayerJoinedGameEvent.fromObject(evt);
        this.eventBus.publishAsync(playerJoinedGame); // Fire and forget
    }

    private onPlayerLeftGame(evt: IPlayerLeftGameEvent) {
        let playerLeftGame = PlayerLeftGameEvent.fromObject(evt);
        this.eventBus.publishAsync(playerLeftGame); // Fire and forget
    }

    public onVesselStateChanged(evt: IVesselStateChangedEvent) {
        let vesselStateChanged = VesselStateChangedEvent.fromObject(evt);
        this.eventBus.publishAsync(vesselStateChanged); // Fire and forget
    }

    public async getTestGameIdAsync() {
        return await this.createInvocationAsync<string>("getTestGameIdAsync");
    }

    public async getAllGamesAsync() {
        return await this.createInvocationAsync<IGame[]>('getAllGamesAsync');
    }

    public async getGameAsync(gameId: string) {
        return await this.createInvocationAsync<IGame>('getGameAsync', gameId);
    }

    public async createGameAsync(options: ICreateGameOptions) {
        return await this.createInvocationAsync<IGame>('createGameAsync', options);
    }

    public async startGameAsync(gameId: string) {
        return await this.createInvocationAsync<IGame>('startGameAsync', gameId);
    }

    public async endGameAsync(gameId: string) {
        return await this.createInvocationAsync<IGame>('endGameAsync', gameId);
    }

    public async deleteGameAsync(gameId: string) {
        return await this.createInvocationAsync<void>('deleteGameAsync', gameId);
    }

    public async addPlayerToGameAsync(options: IAddPlayerOptions) {
        return await this.createInvocationAsync<IGame>('addPlayerToGameAsync', options);
    }
    
    public async removePlayerFromGameAsync(options: IRemovePlayerOptions) {
        return await this.createInvocationAsync<IGame>('removePlayerFromGameAsync', options);
    }

    public async addPlayerToVesselAsync(options: IAddPlayerOptions) {
        return await this.createInvocationAsync<IVessel>('addPlayerToVesselAsync', options);
    }
    
    public async removePlayerFromVesselAsync(options: IRemovePlayerOptions) {
        return await this.createInvocationAsync<IVessel>('removePlayerFromVesselAsync', options);
    }

    public async addPlayerToVesselRoleAsync(options: IAddPlayerOptions) {
        return await this.createInvocationAsync<IVessel>('addPlayerToVesselRoleAsync', options);
    }

    public async removePlayerFromVesselRoleAsync(options: IRemovePlayerOptions) {
        return await this.createInvocationAsync<IVessel>('removePlayerFromVesselRoleAsync', options);
    }

    public async moveVesselAsync(request: IVesselMoveRequest) {
        return await this.createInvocationAsync<IVessel>('moveVesselAsync', request);
    }

}