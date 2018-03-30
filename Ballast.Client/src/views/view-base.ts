import { injectable, inject } from 'inversify';
import { IDisposable } from '../interfaces/idisposable';
import { IView } from './abstractions/iview';
import { BallastClientContext } from '../app/ballast-client-context';
import { TYPES_BALLAST } from '../ioc/types';
import { IEventBus } from '../messaging/ievent-bus';

@injectable()
export abstract class ViewBase implements IView, IDisposable {

    protected readonly clientContext: BallastClientContext;
    protected readonly eventBus: IEventBus;
    protected host?: HTMLElement;

    public constructor(
        @inject(TYPES_BALLAST.BallastClientContext) clientContext: BallastClientContext,
        @inject(TYPES_BALLAST.IEventBus) eventBus: IEventBus
    ) {
        this.clientContext = clientContext;
        this.eventBus = eventBus;
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