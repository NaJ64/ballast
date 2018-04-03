import { BallastViewport } from './ballast-viewport';
import { IDisposable } from '../interfaces/idisposable';
export declare class BallastClient implements IDisposable {
    private readonly host;
    private readonly id;
    private readonly viewport;
    private readonly inversifyContainer;
    constructor(host: HTMLElement);
    getId(): string;
    getViewport(): BallastViewport;
    loadAsync(): Promise<BallastClient>;
    dispose(): void;
}
