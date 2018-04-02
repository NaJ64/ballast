import { ComponentBase } from './component-base';
export declare class GameComponent extends ComponentBase {
    private static componentId;
    protected getComponentId(): string;
    protected render(parent: HTMLElement, renderingContext: CanvasRenderingContext2D): void;
    onAttach(parent: HTMLElement): void;
}
