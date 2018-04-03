import { ComponentBase } from './component-base';
import { RenderingContext } from '../rendering/rendering-context';
export declare class MenuComponent extends ComponentBase {
    protected getComponentId(): symbol;
    protected render(parent: HTMLElement, renderingContext: RenderingContext): void;
}
