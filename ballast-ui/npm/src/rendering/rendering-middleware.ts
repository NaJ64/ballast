import { compose, Composed } from "throwback";
import { IRenderingContext } from "./rendering-context";

export type RenderingStep = (renderingContext: IRenderingContext, next: () => void) => void;

export class RenderingMiddleware {

    private readonly _renderingSteps: RenderingStep[];
    private _composedRenderAll?: Composed<IRenderingContext, void>;

    public constructor() {
        this._renderingSteps = [];
    }

    public use(renderingStep: RenderingStep) {
        this._renderingSteps.push(renderingStep);
    }

    public renderAll(renderingContext: IRenderingContext, postRender: (renderingContext: IRenderingContext) => void) {
        if (!this._composedRenderAll) {
            this._composedRenderAll = compose(this._renderingSteps);
        }
        this._composedRenderAll(renderingContext, (() => {
            postRender(renderingContext)
            return Promise.resolve();
        }).bind(this));
    }

}