import { compose } from 'throwback';
import { RenderingStep } from '../app/ballast-viewport';
import { RenderingContext } from './rendering-context';

export class RenderingMiddleware {

    private readonly renderingSteps: RenderingStep[];

    public constructor() {
        this.renderingSteps = [];
    }

    public use(renderingStep: RenderingStep) {
        this.renderingSteps.push(renderingStep);
    }

    public renderAll(renderingContext: RenderingContext, postRender: (renderingContext: RenderingContext) => void) {
        var renderAll = compose(this.renderingSteps);
        var doneMethod = ((renderingContext: RenderingContext) => {
            postRender(renderingContext)
            return Promise.resolve();
        }).bind(this);
        renderAll(renderingContext, doneMethod);
    }

}