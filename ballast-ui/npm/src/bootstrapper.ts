import { IBallastHtmlClient, BallastHtmlClient } from './html-client';

export interface IBallastBootstrapper {
    bootstrapAsync(serverUrl: string, host?: HTMLElement): Promise<IBallastHtmlClient>;
}

export class Bootstrapper {

    private readonly document: Document;

    public constructor(document: Document) {
        this.document = document;
    }

    private findBallastElement(): HTMLElement | undefined {
        return this.document.getElementById('ballast') || undefined;
    }

    public async bootstrapAsync(serverUrl: string, host?: HTMLElement): Promise<IBallastHtmlClient> {
        if (!host) {
            host = this.findBallastElement();
        }
        if (!host) {
            throw new Error('No ballast host element was found/specified');
        }
        return new BallastHtmlClient(host, serverUrl);;
    }

}