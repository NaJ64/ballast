import { injectable, inject } from "inversify";
import { RenderingComponentBase } from "../rendering-component";
import { TYPES as BallastCore, IEventBus } from "ballast-core";
import { IRenderingContext } from "../rendering-context";
import { CurrentDirectionModifiedEvent } from "../../events/current-direction-modified";
import { CurrentGameModifiedEvent } from "../../events/current-game-modified";
import { CurrentPlayerModifiedEvent } from "../../events/current-player-modified";
import { CurrentVesselModifiedEvent } from "../../events/current-vessel-modified";
import { CurrentVesselRolesModifiedEvent } from "../../events/current-vessel-roles-modified";
import { Canvas2dRenderer } from "../canvas-2d-renderer";

// Render an overhead view (camera) of the board with toggle-able full-screen

@injectable()
export class MiniMapComponent extends RenderingComponentBase {

    private readonly _eventBus: IEventBus;
    private _cameraNeedsReset: boolean;
    private _miniMapWindow?: HTMLDivElement;
    private _miniMapCanvas?: HTMLCanvasElement;
    private _canvas2dRenderer?: Canvas2dRenderer;

    public constructor(@inject(BallastCore.Messaging.IEventBus) eventBus: IEventBus) {
        super();
        this.rebindHandlers();
        this._eventBus = eventBus;
        this._cameraNeedsReset = false;
    }

    protected onDisposing() {
        this.unsubscribeAll();
        this.destroyDomElements();
        if (this._canvas2dRenderer) {
            this._canvas2dRenderer.dispose();
            this._canvas2dRenderer = undefined;
        }
    }

    private rebindHandlers() {
        this.onCurrentDirectionModifiedAsync = this.onCurrentDirectionModifiedAsync.bind(this);
        this.onCurrentGameModifiedAsync = this.onCurrentGameModifiedAsync.bind(this);
        this.onCurrentPlayerModifiedAsync = this.onCurrentPlayerModifiedAsync.bind(this);
        this.onCurrentVesselModifiedAsync = this.onCurrentVesselModifiedAsync.bind(this);
        this.onCurrentVesselRolesModifiedAsync = this.onCurrentVesselRolesModifiedAsync.bind(this);
    }

    private subscribeAll() {
        this._eventBus.subscribe(CurrentDirectionModifiedEvent.id, this.onCurrentDirectionModifiedAsync);
        this._eventBus.subscribe(CurrentGameModifiedEvent.id, this.onCurrentGameModifiedAsync);
        this._eventBus.subscribe(CurrentPlayerModifiedEvent.id, this.onCurrentPlayerModifiedAsync);
        this._eventBus.subscribe(CurrentVesselModifiedEvent.id, this.onCurrentVesselModifiedAsync);
        this._eventBus.subscribe(CurrentVesselRolesModifiedEvent.id, this.onCurrentVesselRolesModifiedAsync);
    }

    private unsubscribeAll() {
        this._eventBus.unsubscribe(CurrentDirectionModifiedEvent.id, this.onCurrentDirectionModifiedAsync);
        this._eventBus.unsubscribe(CurrentGameModifiedEvent.id, this.onCurrentGameModifiedAsync);
        this._eventBus.unsubscribe(CurrentPlayerModifiedEvent.id, this.onCurrentPlayerModifiedAsync);
        this._eventBus.unsubscribe(CurrentVesselModifiedEvent.id, this.onCurrentVesselModifiedAsync);
        this._eventBus.unsubscribe(CurrentVesselRolesModifiedEvent.id, this.onCurrentVesselRolesModifiedAsync);
    }

    private createDomElements(ownerDocument: Document) {
        let navElements = this.createMiniMapElements(ownerDocument);
        this._miniMapWindow = navElements["0"];
        this._miniMapCanvas = navElements["1"];
    }

    private destroyDomElements() {
        this._miniMapWindow = undefined;
        this._miniMapCanvas = undefined;
    }

    private createMiniMapElements(ownerDocument: Document): [
        HTMLDivElement,
        HTMLCanvasElement,
    ] {
        let miniMapWindow = ownerDocument.createElement("div");
        miniMapWindow.style.cssFloat = 'left';
        miniMapWindow.style.position = 'absolute';
        miniMapWindow.style.zIndex = '1000';
        miniMapWindow.style.left = '12px';
        //miniMapWindow.style.left = 'calc(15% + 22px)';
        miniMapWindow.style.bottom = '12px';
        miniMapWindow.style.height = '0';
        miniMapWindow.style.paddingTop = 'calc(20% - 2px)'
        miniMapWindow.style.width = 'calc(20% - 2px)';
        miniMapWindow.style.borderWidth = '1px';
        miniMapWindow.style.borderStyle = 'solid';
        miniMapWindow.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        miniMapWindow.style.backgroundColor = "rgba(0, 0, 0, 0.1)";

        let miniMapCanvas = ownerDocument.createElement("canvas");
        miniMapCanvas.style.position = 'absolute';
        miniMapCanvas.style.top = '0';
        miniMapCanvas.style.height = '100%';
        miniMapCanvas.style.width = '100%';
        miniMapWindow.appendChild(miniMapCanvas);

        return [miniMapWindow, miniMapCanvas];
    }

    protected onAttached(ownerDocument: Document, parent: HTMLDivElement) {
        // Check if we need to create the navigation window (and other elements)
        if (!this._miniMapWindow) {
            this.createDomElements(ownerDocument);
            this._canvas2dRenderer = new Canvas2dRenderer(this._miniMapCanvas as HTMLCanvasElement);
        }
        // Attach to parent DOM element
        if (this._miniMapWindow) {
            parent.appendChild(this._miniMapWindow);
        }
        // Subscribe to all application events
        this.subscribeAll();
    }
    
    protected onDetaching() {
        // Unsubscribe from all application events
        this.unsubscribeAll();
        // Remove from parent DOM element
        if (this._parent && this._miniMapWindow) {
            this._parent.removeChild(this._miniMapWindow);
        }
    }

    private onCurrentDirectionModifiedAsync() {
        this._cameraNeedsReset = true;
        return Promise.resolve();
    }

    private onCurrentGameModifiedAsync() {
        this._cameraNeedsReset = true;
        return Promise.resolve();
    }

    private onCurrentPlayerModifiedAsync() {
        // Do something here
        return Promise.resolve();
    }

    private onCurrentVesselModifiedAsync() {
        // Do something here
        return Promise.resolve();
    }

    private onCurrentVesselRolesModifiedAsync() {
        // Do something here
        return Promise.resolve();
    }
    
    protected onFirstRender(renderingContext: IRenderingContext) {
        this._cameraNeedsReset = true;
        this.onRender(renderingContext);
    }

    protected onRender(renderingContext: IRenderingContext) {
        if (this._cameraNeedsReset) {
            this.resetCamera(renderingContext);
        }
    }

    private resetCamera(renderingContext: IRenderingContext) {
        // Remove flag
        this._cameraNeedsReset = false;
        // Actually reset the camera
        this._canvas2dRenderer && this._canvas2dRenderer.render(renderingContext);
        //console.log("Minimap camera was reset")
    }

}