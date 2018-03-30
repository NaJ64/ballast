import { BallastClient } from './ballast-client';

export interface IBallastClientContext {
    clientId: string;
    getClient(): BallastClient;
}