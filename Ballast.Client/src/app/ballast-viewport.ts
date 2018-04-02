export type RenderingStep = (renderingContext: CanvasRenderingContext2D, next: () => void) => void;

export class BallastViewport {
    
    private readonly root: HTMLDivElement;
    private readonly canvas: HTMLCanvasElement;
    private readonly renderingContext: CanvasRenderingContext2D;
    private readonly renderingSteps: Map<string, RenderingStep>;

    public constructor(host: HTMLElement, clientId: string) {
        this.root = this.createRoot(host, clientId);
        this.canvas = this.createCanvas(this.root);
        this.renderingContext = this.createRenderingContext(this.canvas);
        this.renderingSteps = new Map<string, RenderingStep>();
    }

    public getRoot(): HTMLDivElement {
        return this.root;
    }

    public getRenderingSteps(): RenderingStep[] {
        return Array.from(this.renderingSteps.values());
    }

    private createRoot(host: HTMLElement, id: string): HTMLDivElement {
        var root = host.ownerDocument.createElement("div");
        root.id = id;
        host.appendChild(root);
        return root;
    }

    private createCanvas(root: HTMLDivElement) {
        var canvas = root.ownerDocument.createElement('canvas');
        canvas.id = root.id + '_canvas';
        root.appendChild(canvas);
        return canvas;
    }

    private createRenderingContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
        var renderingContext =  this.canvas.getContext('2d');
        if (!renderingContext) {
            throw new Error('Could not create rendering context from canvas');
        }
        return renderingContext;
    }

    private renderLoop() {
        requestAnimationFrame(() => this.renderLoop());
        this.render();
    }

    private render(): void {
        var renderingSteps = this.getRenderingSteps();
        var i = renderingSteps.length;
        let final: RenderingStep = (renderingContext, next) => { 
            // Final render step goes here
        };
        let next = final;
        while (i--) {
            next = renderingSteps[i].call(this, this.canvas, next);
        }
    }

    public addRenderingStep(id: string, renderingStep: RenderingStep) {
        this.renderingSteps.set(id, renderingStep);
    }

    public removeRenderingStep(id: string) {
        this.renderingSteps.delete(id);
    }

    public startRenderLoop() {
        this.renderLoop();
    }

}