import * as signalR from '@aspnet/signalr';
import { Game, GameStateChangedEvent, IEventBus, IGame, IGameService, ICreateGameOptions, IAddPlayerOptions, IRemovePlayerOptions, IVessel, IVesselMoveRequest } from 'ballast-core';
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
        hubConnection.on('gameStateChanged', this.onGameStateChanged.bind(this));
    }

    protected beforeUnsubscribe(hubConnection: signalR.HubConnection) {
        hubConnection.off('gameStateChanged');
    }

    private onGameStateChanged(update: IGame) {
        let game = Game.fromObject(update);
        let gameStateChanged = new GameStateChangedEvent(game);
        this.eventBus.publishAsync(gameStateChanged); // Fire and forget
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
        return await this.createInvocationAsync<void>('moveVesselAsync', request);
    }

}