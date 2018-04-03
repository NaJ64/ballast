import { Container, injectable } from 'inversify';
import * as uuid from 'uuid';
import { BallastViewport } from './ballast-viewport';
import { configureServices } from '../ioc/configure-services';
import { TYPES_BALLAST } from '../ioc/types';
import { RootComponent } from '../components/root';
import { IDisposable } from '../interfaces/idisposable';

@injectable()
export class BallastClient implements IDisposable {

    private readonly host: HTMLElement;
    private readonly id: string;
    private readonly viewport: BallastViewport;
    private readonly inversifyContainer: Container;

    public constructor(host: HTMLElement) {
        this.host = host;
        this.id = uuid.v4();
        this.viewport = new BallastViewport(host, this.id);
        this.inversifyContainer = configureServices(new Container(), this);
    }

    public getId(): string {
        return this.id;
    }

    public getViewport(): BallastViewport {
        return this.viewport;
    }

    public async loadAsync(): Promise<BallastClient> {
        var root = this.viewport.getRoot();
        var factory = this.inversifyContainer.get<() => RootComponent>(TYPES_BALLAST.GameComponentFactory);
        var component = factory();
        await component.attach(root);
        this.viewport.startRenderLoop();
        return this;
    }

    public dispose() {
        // TODO:  Dispose of resources & even handlers here
    }

}