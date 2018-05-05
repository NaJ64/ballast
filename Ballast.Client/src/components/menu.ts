import { injectable } from 'inversify';
import { RenderingContext } from '../rendering/rendering-context';
import { ComponentBase } from './component-base';

@injectable()
export class MenuComponent extends ComponentBase {

    protected render(parent: HTMLElement, renderingContext: RenderingContext) { }

}