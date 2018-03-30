import { injectable, inject } from 'inversify';
import { IDisposable } from '../interfaces';
import { IView } from './abstractions';
import { BallastClientContext } from '../app';
import { TYPES_BALLAST } from '..';

@injectable()
export abstract class ViewBase implements IView, IDisposable {

    protected readonly clientContext: BallastClientContext;
    protected host?: HTMLElement;

    public constructor(@inject(TYPES_BALLAST.BallastClientContext) clientContext: BallastClientContext) {
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