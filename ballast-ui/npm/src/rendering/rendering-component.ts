import { IDisposable } from "ballast-core";
import { injectable } from "inversify";
import { IRenderingContext } from "./rendering-context";
import { RenderingStep, RenderingMiddleware } from "./rendering-middleware";

export interface IRenderingComponent extends IDisposable {
    readonly isAttached: boolean;
    readonly isEnabled: boolean;
    readonly parent: HTMLElement | null;
    attach(parent: HTMLElement, middleware: RenderingMiddleware): void;
    detach(): void;
    disable(): void;
    enable(): void;
    render(renderingContext: IRenderingContext): void;
}

@injectable()
export abstract class RenderingComponentBase implements IRenderingComponent {
    
    protected _isEnabled: boolean;
    protected _isFirstRender: boolean;
    protected _parent: HTMLElement | null;
    protected onAttached(parent: HTMLElement, middleware: RenderingMiddleware): void { }
    protected onDetaching(parent: HTMLElement): void { }
    protected onEnabled(): void { }
    protected onDisabling(): void { }
    protected onDisposing(): void { }
    protected abstract onRender(renderingContext: IRenderingContext): void;
    protected onFirstRender(renderingContext: IRenderingContext): void { 
        this.onRender(renderingContext); 
    }

    public constructor() {
        this._isEnabled = false;
        this._isFirstRender = false;
        this._parent = null;
    }

    public dispose() {
        this.onDisposing();
        if (this._parent) {
            this.detach();
        }
    }

    public get isAttached(): boolean {
        return !!this._parent;
    }

    public get isEnabled(): boolean { 
        return this._isEnabled;
    }

    public get isFirstRender(): boolean {
        return this._isFirstRender;
    }

    public get parent(): HTMLElement | null {
        return this._parent || null;
    }

    protected createRenderingStep(): RenderingStep {
        return (renderingContext, next) => {
            this.render(renderingContext);
            return next();
        }
    }

    public attach(parent: HTMLElement, middleware: RenderingMiddleware) {
        if (this._parent) {
            throw new Error("Component is already attached to a parent element");
        }
        this._parent = parent;
        middleware.use(this.createRenderingStep());
        this.onAttached(this._parent, middleware);
    }

    public detach() {
        if (!this._parent) {
            throw new Error("Component is not attached to a parent element");
        }
        this.onDetaching(this._parent);
        this._parent = null;
        this._isFirstRender = true;
    }
    
    public disable(): void {
        if (!this._isEnabled) {
            throw new Error("Component is not enabled");
        }
        this.onDisabling();
        this._isEnabled = false;
    }

    public enable(): void {
        if (this._isEnabled) {
            throw new Error("Component is already enabled");
        }
        this._isEnabled = true;
        this.onEnabled();
    }

    public render(renderingContext: IRenderingContext) {
        if (!this._parent) {
            return; // Do nothing if not attached yet
        }
        if (this._isFirstRender) {
            this.onFirstRender(renderingContext);
        } else {
            this.onRender(renderingContext);
        }
        this._isFirstRender = false;
    }
}