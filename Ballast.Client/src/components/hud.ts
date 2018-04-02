import { injectable } from 'inversify';
import { ComponentBase } from './component-base';

@injectable()
export class HudComponent extends ComponentBase {

    private static componentId: string = 'Hud';

    protected getComponentId() {
        return HudComponent.componentId;
    }

    protected render(parent: HTMLElement, renderingContext: CanvasRenderingContext2D) { }

}