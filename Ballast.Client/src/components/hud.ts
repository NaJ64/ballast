import { injectable } from 'inversify';
import { TYPES_BALLAST } from '../ioc/types';
import { ComponentBase } from './component-base';
import { RenderingContext } from '../rendering/rendering-context';

@injectable()
export class HudComponent extends ComponentBase {

    protected getComponentId() {
        return TYPES_BALLAST.HudComponent;
    }

    protected render(parent: HTMLElement, renderingContext: RenderingContext) { }

}