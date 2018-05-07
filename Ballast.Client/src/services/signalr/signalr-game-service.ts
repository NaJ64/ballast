import * as signalR from '@aspnet/signalr';
import { Game, GameStateChangedEvent, IEventBus, IGame, IVesselMoveRequest, ICreateVesselOptions, ITileShape } from 'ballast-core';
import { inject, injectable } from 'inversify';
import { TYPES_BALLAST } from '../../ioc/types';
import { IGameClientService } from '../game-client-service';
import { SignalRServiceBase } from './signalr-service-base';
import { ISignalRServiceOptions } from './signalr-service-options';

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

    public async updateGameStateAsync(update: IGame) {
        if (!this.isConnected) {
            await this.connectAsync();
        }
        let game = Game.fromObject(update);
        let gameStateChanged = new GameStateChangedEvent(game);
        await this.eventBus.publishAsync(gameStateChanged);
    }

    public async moveVesselAsync(request: IVesselMoveRequest): Promise<void> {
        if (!this.isConnected) {
            await this.connectAsync();
        }
        await this.invokeOnHubAsync('moveVessel', request);
    }

    public createNewGameAsync(vesselOptions: ICreateVesselOptions, boardSize?: number, boardShape?: ITileShape): Promise<void>;
    public createNewGameAsync(vesselOptions: ICreateVesselOptions[], boardSize?: number, boardShape?: ITileShape): Promise<void>;
    public async createNewGameAsync(vesselOptions: ICreateVesselOptions | ICreateVesselOptions[], boardSize?: number, boardShape?: ITileShape): Promise<void> {
        let vesselOptionsArray: ICreateVesselOptions[];
        if (Array.isArray(vesselOptions)) {
            vesselOptionsArray = vesselOptions;
        } else {
            vesselOptionsArray = [vesselOptions];
        }
        let params = [
            vesselOptionsArray,
            boardSize || null,
            boardShape || null
        ];
        await this.invokeOnHubAsync('createNewGame', params);
    }



}