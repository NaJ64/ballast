import { injectable } from 'inversify';
import { BallastClient } from './ballast-client';

@injectable()
export class BallastBootstrapper {

    private readonly document: Document;

    public constructor(document: Document) {
        this.document = document;
    }

    private findBallastElement(): HTMLElement | undefined {
        return this.document.getElementById('ballast') || undefined;
    }

    public async bootstrapAsync(serverUrl: string, host?: HTMLElement): Promise<BallastClient> {
        if (!host) {
            host = this.findBallastElement();
        }
        if (!host) {
            throw new Error('No ballast host element was found/specified');
        }
        let client = new BallastClient(host, serverUrl);
        await client.loadAsync();
        await client.startTestAsync();
        return client;
    }

}