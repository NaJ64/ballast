import { IDisposable } from '../interfaces';
import { IView } from './abstractions';
import { BallastClientContext } from '../app';
export declare abstract class ViewBase implements IView, IDisposable {
    protected readonly clientContext: BallastClientContext;
    protected host?: HTMLElement;
    constructor(clientContext: BallastClientContext);
    attach(host: HTMLElement): void;
    detach(): void;
    protected onAttach(host: HTMLElement): void;
    protected onDetach(host: HTMLElement): void;
    abstract show(): void;
    abstract hide(): void;
    dispose(): void;
    enableInteraction(): void;
    disableInteraction(): void;
}
