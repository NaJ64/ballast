import { ComponentBase } from './component-base';
export declare class RootComponent extends ComponentBase {
    protected getComponentId(): symbol;
    protected render(parent: HTMLElement, renderingContext: CanvasRenderingContext2D): void;
}
