import { injectable } from 'inversify';
import { IDisposable } from '../interfaces';
import { IView } from './abstractions';
import { IBallastClientContext } from '../app';

@injectable()
export abstract class ViewBase implements IView, IDisposable {

    protected readonly clientContext: IBallastClientContext;
    protected host?: HTMLElement;

    public constructor(clientContext: IBallastClientContext) {
        this.clientContext = clientContext;
    }

    public attach(host: HTMLElement): void {
        this.host = host;
        this.onAttach(this.host);
    }

    public detach(): void {
        if (this.host) {
            this.onDetach(this.host);
        }
    }

    protected onAttach(host: HTMLElement): void { }
    protected onDetach(host: HTMLElement): void { }

    public abstract show(): void;
    public abstract hide(): void;
    public dispose(): void { }
    public enableInteraction(): void { }
    public disableInteraction(): void { }

}