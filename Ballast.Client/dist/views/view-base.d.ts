import { IDisposable } from '../interfaces';
import { IView } from './abstractions';
import { IBallastClientContext } from '../app';
export declare abstract class ViewBase implements IView, IDisposable {
    protected readonly clientContext: IBallastClientContext;
    protected host?: HTMLElement;
    constructor(clientContext: IBallastClientContext);
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
