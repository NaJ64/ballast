import { Container, injectable } from 'inversify';
import { Board, BoardGenerator, BoardType, TileShape, Game } from 'ballast-core';
import * as uuid from 'uuid';
import { BallastViewport } from './ballast-viewport';
import { configureServices } from '../ioc/configure-services';
import { TYPES_BALLAST } from '../ioc/types';
import { RootComponent } from '../components/root';
import { IDisposable } from '../interfaces/idisposable';
import { GameStateChangedEvent } from '../messaging/events/game/game-state-changed';
import { IEventBus } from '../messaging/ievent-bus';
import { EventBus } from '..';

@injectable()
export class BallastClient implements IDisposable {

    private readonly host: HTMLElement;
    private readonly id: string;
    private readonly viewport: BallastViewport;
    private readonly inversifyContainer: Container;
    private readonly eventBus: IEventBus;
    private rootComponent?: RootComponent;

    public constructor(host: HTMLElement) {
        this.host = host;
        this.id = uuid.v4();
        this.eventBus = new EventBus();
        this.viewport = new BallastViewport(host, this.id, this.eventBus);
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

    public async loadAsync(): Promise<BallastClient> {
        var root = this.viewport.getRoot();
        var rootComponentFactory = this.inversifyContainer.get<() => RootComponent>(TYPES_BALLAST.RootComponentFactory);
        this.rootComponent = rootComponentFactory();
        this.rootComponent.attach(root);
        this.viewport.startRenderLoop();        
        return this;
    }

    public async startTestAsync(): Promise<void> {
        // Create a test game / board
        let gameId = uuid.v4();
        let boardGenerator = new BoardGenerator();
        let board = boardGenerator.createBoard(gameId, BoardType.RegularPolygon, TileShape.Square, 5);
        let game = Game.fromObject({id: gameId, board: board });
        // Trigger new game state changed event
        let gameStateChanged = new GameStateChangedEvent(game);
        let eventBus = this.inversifyContainer.get<IEventBus>(TYPES_BALLAST.IEventBus);
        await eventBus.publishAsync(gameStateChanged);
    }

    public dispose() {
        if (this.rootComponent) {
            this.rootComponent.detach();
        }
    }

}