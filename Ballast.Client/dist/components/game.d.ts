import { ComponentBase } from './component-base';
export declare class GameComponent extends ComponentBase {
    protected getComponentId(): symbol;
    protected render(parent: HTMLElement, renderingContext: CanvasRenderingContext2D): void;
    onAttach(parent: HTMLElement): void;
}
