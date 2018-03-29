import { Container } from 'inversify';
import { BallastClient } from './ballast-client';
import { BallastViewport } from './ballast-viewport';
import { configureServices } from '../ioc/configure-services';

export class BallastBootstrapper {

    public async bootstrapAsync(host: HTMLElement): Promise<BallastClient> {
        let client = new BallastClient(host);
        return await client.loadAsync();
    }

}