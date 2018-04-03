import { ComponentBase } from './component-base';
import { RenderingContext } from '../rendering/rendering-context';
export declare class GameComponent extends ComponentBase {
    protected getComponentId(): symbol;
    private geometry?;
    private material?;
    private cube?;
    protected render(parent: HTMLElement, renderingContext: RenderingContext): void;
    onAttach(parent: HTMLElement): void;
}
