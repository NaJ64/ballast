import { Container, injectable } from 'inversify';
import { BallastClient } from './ballast-client';
import { BallastViewport } from './ballast-viewport';
import { configureServices } from '../ioc/configure-services';

@injectable()
export class BallastBootstrapper {

    private readonly document: Document;

    public constructor(document: Document) {
        this.document = document;
    }

    private findBallastElement(): HTMLElement | undefined {
        return this.document.getElementById('ballast') || undefined;
    }

    public async bootstrapAsync(host?: HTMLElement): Promise<BallastClient> {
        if (!host) {
            host = this.findBallastElement();
        }
        if (!host) {
            throw new Error('No ballast host element was found/specified');
        }
        let client = new BallastClient(host);
        return await client.loadAsync();
    }

}