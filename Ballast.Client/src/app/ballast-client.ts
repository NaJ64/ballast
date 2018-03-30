import { Container } from 'inversify';
import * as uuid from 'uuid';
import { BallastViewport } from './ballast-viewport';
import { configureServices, TYPES_BALLAST } from '../ioc';
import { RootController } from '../controllers';

export class BallastClient {

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

    public getViewport(): BallastViewport {
        return this.viewport;
    }

    public async loadAsync(): Promise<BallastClient> {
        var root = this.inversifyContainer.get<RootController>(TYPES_BALLAST.RootController);
        return this;
    }

}