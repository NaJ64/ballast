import { Game, GameStateChangedEvent, IDisposable, IEventBus, LocalEventBus, IAddPlayerOptions, getUtcNow, IPlayer } from 'ballast-core';
import { Container, injectable } from 'inversify';
import * as uuid from 'uuid';
import { RootComponent } from '../components/root';
import { configureServices } from '../ioc/configure-services';
import { TYPES_BALLAST } from '../ioc/types';
import { ISignalRServiceOptions } from '../services/signalr/signalr-service-options';
import { BallastViewport } from './ballast-viewport';
import { IGameClientService } from '../services/game-client-service';
import { ISignInClientService } from '../services/sign-in-client-service';

@injectable()
export class BallastClient implements IDisposable {

    private readonly host: HTMLElement;
    private readonly id: string;
    private readonly viewport: BallastViewport;
    private readonly inversifyContainer: Container;
    private readonly eventBus: IEventBus;
    private readonly signalRServiceOptions: ISignalRServiceOptions;
    private rootComponent?: RootComponent;

    public constructor(host: HTMLElement, serverUrl: string) {
        this.host = host;
        this.id = uuid.v4();
        this.eventBus = new LocalEventBus();
        this.viewport = new BallastViewport(host, this.id, this.eventBus);
        this.signalRServiceOptions = { serverUrl: serverUrl, clientId: this.id };
        this.inversifyContainer = configureServices(new Container(), this);
    }

    public getId(): string {
        return this.id;
    }

    public getViewport(): BallastViewport {
        return this.viewport;
    }

    public getEventBus(): IEventBus {
        return this.eventBus;
    }

    public getSignalRServiceOptions(): ISignalRServiceOptions {
        return this.signalRServiceOptions;
    }

    public async loadAsync(): Promise<BallastClient> {
        var root = this.viewport.getRoot();
        var rootComponentFactory = this.inversifyContainer.get<() => RootComponent>(TYPES_BALLAST.RootComponentFactory);
        this.rootComponent = rootComponentFactory();
        this.rootComponent.attach(root);
        this.viewport.startRenderLoop();
        return this;
    }

    public async startTestAsync() {
        let playerId = this.id;
        let signInService = this.inversifyContainer.get<ISignInClientService>(TYPES_BALLAST.ISignInClientService);
        let signedInPlayer: IPlayer | null = null;
        if (!signInService.isConnected) {
            await signInService.connectAsync();
            signedInPlayer = await signInService.signInAsync({
                playerId: playerId, 
                playerName: null, 
                timestampText: getUtcNow().toISOString()
            });
        }
        let gameService = this.inversifyContainer.get<IGameClientService>(TYPES_BALLAST.IGameClientService);
        if (!gameService.isConnected) {
            await gameService.connectAsync();
        }
        let testGameId = await gameService.getTestGameIdAsync();
        let addPlayerOptions: IAddPlayerOptions = {
            playerId: playerId,
            playerName: signedInPlayer ? signedInPlayer.name : null,
            gameId: testGameId,
            vesselId: null,
            vesselRoleValues: []
        };
        let testGame = Game.fromObject(await gameService.addPlayerToGameAsync(addPlayerOptions));
        let eventBus = this.inversifyContainer.get<IEventBus>(TYPES_BALLAST.IEventBus);
        await eventBus.publishAsync(GameStateChangedEvent.fromGame(testGame));
    }

    // public async startTestAsync(): Promise<void> {
    //     // Create a test game / board
    //     let gameId = uuid.v4();
    //     let boardGenerator = new BoardGenerator();
    //     let board = boardGenerator.createBoard(gameId, BoardType.RegularPolygon, TileShape.Hexagon, 3);
    //     let vessel1Id = uuid.v4();
    //     let vessel1Coords = (<Tile>board.getTile([0, 0, 0])).cubicCoordinates;
    //     let players: IPlayer[] = [];
    //     players.push({ id: uuid.v4(), name: 'player1' });
    //     players.push({ id: uuid.v4(), name: 'player2' });
    //     let vessel1 = Vessel.fromObject({ id: vessel1Id, cubicCoordinates: vessel1Coords, captain: players[0], radioman: players[0] });
    //     let vessel2Id = uuid.v4();
    //     let vessel2Coords = (<Tile>board.getTile([-2, 2, 0])).cubicCoordinates;
    //     let vessel2 = Vessel.fromObject({ id: vessel2Id, cubicCoordinates: vessel2Coords, captain: players[1], radioman: players[1] });
    //     let gameState: IGame = { 
    //         id: gameId, 
    //         board: board, 
    //         vessels: [vessel1, vessel2], 
    //         createdUtc: new Date(Date.now()),
    //         players: [] };
    //     let game = Game.fromObject(gameState);
    //     // Trigger new game state changed event
    //     let eventBus = this.inversifyContainer.get<IEventBus>(TYPES_BALLAST.IEventBus);
    //     await eventBus.publishAsync(new GameStateChangedEvent(game));
    //     // setTimeout(() => {
    //     //     let newCoords = CubicCoordinates.fromObject({ x: 1, y: -1, z: 0 }).toOrderedTriple();
    //     //     let newVessel1 = Vessel.fromObject({ id: vessel1.id, cubicOrderedTriple: newCoords });
    //     //     let updatedGame = Game.fromObject({ id: gameId, board: board, vessels: [newVessel1, vessel2] })
    //     //     eventBus.publishAsync(new GameStateChangedEvent(updatedGame)); // Fire and forget
    //     // }, 5000);
    // }

    public dispose() {
        if (this.rootComponent) {
            this.rootComponent.detach();
        }
    }

}