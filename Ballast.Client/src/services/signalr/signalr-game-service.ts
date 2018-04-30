import { injectable, inject } from 'inversify';
import * as signalR from '@aspnet/signalr';
import { IGame, Game, IGameService, GameStateChangedEvent, IVesselMoveRequest } from 'ballast-core';
import { TYPES_BALLAST } from '../../ioc/types';
import { IEventBus } from '../../messaging/event-bus';
import { ISignalRServiceOptions } from './signalr-service-options';
import { SignalRServiceBase } from './signalr-service-base';
import { IGameClientService } from '../game-client-service';

@injectable()
export class SignalRGameService extends SignalRServiceBase implements IGameClientService {

    private sender?: string;
    private receiveGameStateUpdateHandler: (update: IGame) => void;

    public constructor(
        @inject(TYPES_BALLAST.IEventBus) eventBus: IEventBus,
        @inject(TYPES_BALLAST.ISignalRServiceOptionsFactory) serviceOptionsFactory: () => ISignalRServiceOptions
    ) {
        super(eventBus, serviceOptionsFactory);
        this.receiveGameStateUpdateHandler = this.onReceiveGameStateUpdate.bind(this);
    }

    protected getHubName() {
        return 'gamehub';
    }

    protected subscribeToHubEvents(hubConnection: signalR.HubConnection) {
        hubConnection.on('receiveGameStateUpdate', this.receiveGameStateUpdateHandler);
    }

    protected unsubscribeFromHubEvents(hubConnection: signalR.HubConnection) {
        hubConnection.off('receiveGameStateUpdate', this.receiveGameStateUpdateHandler);
    }

    private onReceiveGameStateUpdate(update: IGame) {
        this.receiveGameStateUpdateAsync(update); // Fire and forget
    }

    public async requestVesselMoveAsync(request: IVesselMoveRequest): Promise<void> {
        if (!this.isConnected) {
            await this.connectAsync();
        }
        await this.invokeOnHubAsync('requestVesselMove', request);
    }

    public async receiveGameStateUpdateAsync(update: IGame) {
        if (!this.isConnected) {
            await this.connectAsync();
        }
        let game = Game.fromObject(update);
        let gameStateChanged = new GameStateChangedEvent(game);
        await this.eventBus.publishAsync(gameStateChanged);
    }

}