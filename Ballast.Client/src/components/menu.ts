import { injectable } from 'inversify';
import { ComponentBase } from './component-base';

@injectable()
export class MenuComponent extends ComponentBase {

    private static componentId: string = 'Menu';

    protected getComponentId() {
        return MenuComponent.componentId;
    }

    protected render(parent: HTMLElement, renderingContext: CanvasRenderingContext2D) { }

}