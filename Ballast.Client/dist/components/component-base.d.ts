import { IDisposable } from '../interfaces/idisposable';
import { IEventBus } from '../messaging/ievent-bus';
import { BallastViewport } from '../app/ballast-viewport';
import { RenderingContext } from '../rendering/rendering-context';
export declare abstract class ComponentBase implements IDisposable {
    protected readonly viewport: BallastViewport;
    protected readonly eventBus: IEventBus;
    protected isAttached: boolean;
    protected parent?: HTMLElement;
    constructor(viewport: BallastViewport, eventBus: IEventBus);
    attach(parent: HTMLElement): void;
    detach(): void;
    private addRenderingStep(parent);
    private removeRenderingStep();
    protected abstract getComponentId(): Symbol;
    protected abstract render(parent: HTMLElement, renderingContext: RenderingContext): void;
    protected onAttach(parent: HTMLElement): void;
    protected onDetach(parent: HTMLElement): void;
    dispose(): void;
    enableInteraction(): void;
    disableInteraction(): void;
}
