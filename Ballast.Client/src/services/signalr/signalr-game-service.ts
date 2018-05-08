import * as signalR from '@aspnet/signalr';
import { Game, GameStateChangedEvent, IEventBus, IGame, IVesselMoveRequest, ICreateVesselOptions, ITileShape } from 'ballast-core';
import { inject, injectable } from 'inversify';
import { TYPES_BALLAST } from '../../ioc/types';
import { IGameClientService } from '../game-client-service';
import { SignalRServiceBase } from './signalr-service-base';
import { ISignalRServiceOptions } from './signalr-service-options';

@injectable()
export class SignalRGameService extends SignalRServiceBase implements IGameClientService {

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
        this.changeGameStateAsync(update); // Fire and forget
    }

    public async changeGameStateAsync(update: IGame) {
        let game = Game.fromObject(update);
        let gameStateChanged = new GameStateChangedEvent(game);
        await this.eventBus.publishAsync(gameStateChanged);
    }

    public async moveVesselAsync(request: IVesselMoveRequest): Promise<void> {
        if (!this.isConnected) {
            await this.connectAsync();
        }
        await (<signalR.HubConnection>this.hubConnection).invoke('moveVessel', request);
    }

    public createNewGameAsync(vesselOptions: ICreateVesselOptions, boardSize?: number, boardShape?: ITileShape): Promise<IGame>;
    public createNewGameAsync(vesselOptions: ICreateVesselOptions[], boardSize?: number, boardShape?: ITileShape): Promise<IGame>;
    public async createNewGameAsync(vesselOptions: ICreateVesselOptions | ICreateVesselOptions[], boardSize?: number, boardShape?: ITileShape): Promise<IGame> {
        let vesselOptionsArray: ICreateVesselOptions[];
        if (Array.isArray(vesselOptions)) {
            vesselOptionsArray = vesselOptions;
        } else {
            vesselOptionsArray = [vesselOptions];
        }
        let args = [
            vesselOptionsArray,
            boardSize || null,
            boardShape && boardShape.value || null
        ];
        let newGame = await this.createInvocationAsync<IGame>('createNewGame', ...args);
        this.eventBus.publishAsync(new GameStateChangedEvent(Game.fromObject(newGame)));
        return newGame;
    }

}