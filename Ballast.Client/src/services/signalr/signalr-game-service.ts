import { injectable, inject } from 'inversify';
import * as signalR from '@aspnet/signalr';
import { IGame, Game, IGameService, GameStateChangedEvent, IVesselMoveRequest, IEventBus } from 'ballast-core';
import { TYPES_BALLAST } from '../../ioc/types';
import { ISignalRServiceOptions } from './signalr-service-options';
import { SignalRServiceBase } from './signalr-service-base';
import { IGameClientService } from '../game-client-service';

@injectable()
export class SignalRGameService extends SignalRServiceBase implements IGameClientService {

    private sender?: string;
    private gameStateChangedHandler: (update: IGame) => void;

    public constructor(
        @inject(TYPES_BALLAST.IEventBus) eventBus: IEventBus,
        @inject(TYPES_BALLAST.ISignalRServiceOptionsFactory) serviceOptionsFactory: () => ISignalRServiceOptions
    ) {
        super(eventBus, serviceOptionsFactory);
        this.gameStateChangedHandler = this.onGameStateChanged.bind(this);
    }

    protected getHubName() {
        return 'gamehub';
    }

    protected subscribeToHubEvents(hubConnection: signalR.HubConnection) {
        hubConnection.on('gameStateChanged', this.gameStateChangedHandler);
    }

    protected unsubscribeFromHubEvents(hubConnection: signalR.HubConnection) {
        hubConnection.off('gameStateChanged', this.gameStateChangedHandler);
    }

    private onGameStateChanged(update: IGame) {
        this.updateGameStateAsync(update); // Fire and forget
    }

    public async moveVesselAsync(request: IVesselMoveRequest): Promise<void> {
        if (!this.isConnected) {
            await this.connectAsync();
        }
        await this.invokeOnHubAsync('moveVessel', request);
    }

    public async updateGameStateAsync(update: IGame) {
        if (!this.isConnected) {
            await this.connectAsync();
        }
        let game = Game.fromObject(update);
        let gameStateChanged = new GameStateChangedEvent(game);
        await this.eventBus.publishAsync(gameStateChanged);
    }

}