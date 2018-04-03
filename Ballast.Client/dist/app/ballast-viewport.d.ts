import { RenderingContext } from '../rendering/rendering-context';
export declare type RenderingStep = (renderingContext: RenderingContext, next: () => void) => void;
export declare class BallastViewport {
    private readonly root;
    private readonly canvas;
    private readonly renderingContext;
    private readonly renderingSteps;
    constructor(host: HTMLElement, clientId: string);
    getRoot(): HTMLDivElement;
    getCanvas(): HTMLCanvasElement;
    getRenderingContext(): RenderingContext;
    getRenderingSteps(): RenderingStep[];
    private createRoot(host, id);
    private createCanvas(root);
    private createRenderingContext(canvas);
    private resizeCanvas(canvas);
    private renderLoop();
    private prerender;
    private postrender;
    private render();
    addRenderingStep(id: Symbol, renderingStep: RenderingStep): void;
    removeRenderingStep(id: Symbol): void;
    startRenderLoop(): void;
}
