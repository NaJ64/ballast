import { ComponentBase } from './component-base';
import { RenderingContext } from '../rendering/rendering-context';
export declare class ChatComponent extends ComponentBase {
    protected getComponentId(): symbol;
    protected render(parent: HTMLElement, renderingContext: RenderingContext): void;
}
