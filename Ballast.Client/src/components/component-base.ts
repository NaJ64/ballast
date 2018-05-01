import * as THREE from 'three';
import { injectable, inject } from 'inversify';
import { IDisposable } from 'ballast-core';
import { TYPES_BALLAST } from '../ioc/types';
import { IEventBus } from '../messaging/event-bus';
import { BallastViewport } from '../app/ballast-viewport';
import { RenderingContext } from '../rendering/rendering-context';
import { PerspectiveTracker } from '../input/perspective-tracker';

@injectable()
export abstract class ComponentBase implements IDisposable {

    protected readonly viewport: BallastViewport;
    protected readonly eventBus: IEventBus;
    protected readonly perspectiveTracker: PerspectiveTracker;
    protected isAttached: boolean;
    protected parent?: HTMLElement;
    private firstRender: boolean;

    public constructor(
        @inject(TYPES_BALLAST.BallastViewport) viewport: BallastViewport,
        @inject(TYPES_BALLAST.IEventBus) eventBus: IEventBus,
        @inject(TYPES_BALLAST.PerspectiveTracker) perspectiveTracker: PerspectiveTracker
    ) {
        this.viewport = viewport;
        this.eventBus = eventBus;
        this.perspectiveTracker = perspectiveTracker;
        this.isAttached = false;
        this.firstRender = true;
    }

    public attach(parent: HTMLElement): void {
        this.parent = parent;
        this.isAttached = true;
        this.onAttach(this.parent, this.viewport.getRenderingContext());
        this.addRenderingStep(this.parent);
    }

    public detach(): void {
        if (this.parent) {
            this.onDetach(this.parent, this.viewport.getRenderingContext());
        }
        this.isAttached = false;
        this.firstRender = true;
    }

    private addRenderingStep(parent: HTMLElement) {
        this.viewport.addRenderingStep((renderingContext, next) => {
            if (this.isAttached) {
                this.render(parent, renderingContext);
            }
            this.firstRender = false;
            next();
        });
    }

    protected isFirstRender() {
        return this.firstRender;
    }

    protected abstract render(parent: HTMLElement, renderingContext: RenderingContext): void;
    protected onAttach(parent: HTMLElement, renderingContext: RenderingContext): void { }
    protected onDetach(parent: HTMLElement, renderingContext: RenderingContext): void { }
    public dispose(): void { }
    public enableInteraction(): void { }
    public disableInteraction(): void { }

}