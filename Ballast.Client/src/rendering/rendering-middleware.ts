import { RenderingStep } from '../app/ballast-viewport';
import { RenderingContext } from './rendering-context';
import { compose } from 'throwback';

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
        renderAll(renderingContext, (renderingContext) => {
            postRender(renderingContext);
        });
    }

}