import { injectable } from "inversify";
import { RenderingComponentBase } from "../../rendering/rendering-component";
import { IRenderingContext } from "../../rendering/rendering-context";
import { ThreeRenderingContext } from "./three-rendering-context";

@injectable()
export abstract class ThreeRenderingComponentBase extends RenderingComponentBase {

    protected abstract onRender(renderingContext: ThreeRenderingContext): void;
    protected onFirstRender(renderingContext: ThreeRenderingContext): void { 
        this.onRender(renderingContext); 
    }

    public constructor() {
        super();
    }

    public render(renderingContext: IRenderingContext) {
        if (!this._parent) {
            return; // Do nothing if not attached yet
        }
        if (!(<ThreeRenderingContext>renderingContext).isThreeRenderingContext) {
            return; // ThreeRenderingComponents only work with a ThreeRenderingContext
        }
        if (this._isFirstRender) {
            this.onFirstRender((<ThreeRenderingContext>renderingContext));
        } else {
            this.onRender((<ThreeRenderingContext>renderingContext));
        }
        this._isFirstRender = false;
    }
    
}