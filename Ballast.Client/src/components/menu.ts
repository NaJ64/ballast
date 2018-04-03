import { injectable } from 'inversify';
import { TYPES_BALLAST } from '../ioc/types';
import { ComponentBase } from './component-base';
import { RenderingContext } from '../rendering/rendering-context';

@injectable()
export class MenuComponent extends ComponentBase {

    protected getComponentId() {
        return TYPES_BALLAST.MenuComponent;
    }

    protected render(parent: HTMLElement, renderingContext: RenderingContext) { }

}