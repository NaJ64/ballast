import { compose } from "throwback";
import { IRenderingContext } from "./rendering-context";

export type RenderingStep = (renderingContext: IRenderingContext, next: () => void) => void;

export class RenderingMiddleware {

    private readonly renderingSteps: RenderingStep[];

    public constructor() {
        this.renderingSteps = [];
    }

    public use(renderingStep: RenderingStep) {
        this.renderingSteps.push(renderingStep);
    }

    public renderAll(renderingContext: IRenderingContext, postRender: (renderingContext: IRenderingContext) => void) {
        var renderAll = compose(this.renderingSteps);
        var doneMethod = ((renderingContext: IRenderingContext) => {
            postRender(renderingContext)
            return Promise.resolve();
        }).bind(this);
        renderAll(renderingContext, doneMethod);
    }

}