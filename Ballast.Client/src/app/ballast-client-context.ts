import { BallastClient } from './ballast-client';

export class BallastClientContext {

    public readonly client: BallastClient;
    public readonly clientId: string;

    public constructor(client: BallastClient) {
        this.client = client;
        this.clientId = client.getId();
    }

}