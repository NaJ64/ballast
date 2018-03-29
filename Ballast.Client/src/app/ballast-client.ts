import { Container } from 'inversify';
import * as uuid from 'uuid';
import { BallastViewport } from './ballast-viewport';
import { configureServices } from '../ioc/configure-services';

export class BallastClient {

    private readonly host: HTMLElement;
    private readonly clientId: string;
    private readonly viewport: BallastViewport;
    private readonly container: Container;

    public constructor(host: HTMLElement) {
        this.host = host;
        this.clientId = uuid.v4();
        this.viewport = new BallastViewport(host, this.clientId);
        this.container = configureServices(new Container(), this);
    }

    public getViewport(): BallastViewport {
        return this.viewport;
    }

    public async loadAsync(): Promise<BallastClient> {
        return this;
    }

}