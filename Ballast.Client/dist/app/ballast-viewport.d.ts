import { RenderingContext } from '../rendering/rendering-context';
import { KeyboardWatcher } from '../input/keyboard-watcher';
export declare type RenderingStep = (renderingContext: RenderingContext, next: () => void) => void;
export declare class BallastViewport {
    private readonly root;
    private readonly canvas;
    private readonly keyboardWatcher;
    private readonly renderingContext;
    private readonly renderingSteps;
    constructor(host: HTMLElement, clientId: string);
    getRoot(): HTMLDivElement;
    getCanvas(): HTMLCanvasElement;
    getKeyboardWatcher(): KeyboardWatcher;
    getRenderingContext(): RenderingContext;
    getRenderingSteps(): RenderingStep[];
    private createRoot(host, id);
    private createCanvas(root);
    private createKeyboardWatcher(root);
    private createRenderingContext(canvas, keyboardWatcher);
    private createRenderingSteps();
    private resizeCanvas(canvas);
    private renderLoop();
    private prerender;
    private postrender;
    private render();
    addRenderingStep(id: Symbol, renderingStep: RenderingStep): void;
    removeRenderingStep(id: Symbol): void;
    startRenderLoop(): void;
}
