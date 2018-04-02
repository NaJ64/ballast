import { injectable } from 'inversify';
import { ComponentBase } from './component-base';

@injectable()
export class RootComponent extends ComponentBase {

    private static componentId: string = 'Root';

    protected getComponentId() {
        return RootComponent.componentId;
    }

    protected render(parent: HTMLElement, renderingContext: CanvasRenderingContext2D) { }

}