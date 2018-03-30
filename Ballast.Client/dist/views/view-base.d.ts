import { IDisposable } from '../interfaces/idisposable';
import { IView } from './abstractions/iview';
import { BallastClientContext } from '../app/ballast-client-context';
import { IEventBus } from '../messaging/ievent-bus';
export declare abstract class ViewBase implements IView, IDisposable {
    protected readonly clientContext: BallastClientContext;
    protected readonly eventBus: IEventBus;
    protected host?: HTMLElement;
    constructor(clientContext: BallastClientContext, eventBus: IEventBus);
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
