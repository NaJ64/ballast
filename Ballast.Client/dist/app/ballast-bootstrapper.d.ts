import { BallastClient } from './ballast-client';
export declare class BallastBootstrapper {
    private readonly document;
    constructor(document: Document);
    private findBallastElement();
    bootstrapAsync(host?: HTMLElement): Promise<BallastClient>;
}
