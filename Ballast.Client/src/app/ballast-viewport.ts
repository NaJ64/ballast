import * as THREE from 'three';
import { injectable } from 'inversify';
import { RenderingContext } from '../rendering/rendering-context';

export type RenderingStep = (renderingContext: RenderingContext, next: () => void) => void;

@injectable()
export class BallastViewport {
    
    private readonly root: HTMLDivElement;
    private readonly canvas: HTMLCanvasElement;
    private readonly renderingContext: RenderingContext;
    private readonly renderingSteps: Map<Symbol, RenderingStep>;

    public constructor(host: HTMLElement, clientId: string) {
        this.root = this.createRoot(host, clientId);
        this.canvas = this.createCanvas(this.root);
        this.renderingContext = this.createRenderingContext(this.canvas);
        this.renderingSteps = new Map<Symbol, RenderingStep>();
    }

    public getRoot(): HTMLDivElement {
        return this.root;
    }

    public getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    public getRenderingContext(): RenderingContext {
        return this.renderingContext;
    }

    public getRenderingSteps(): RenderingStep[] {
        return Array.from(this.renderingSteps.values());
    }

    private createRoot(host: HTMLElement, id: string): HTMLDivElement {
        var root = host.ownerDocument.createElement("div");
        root.id = id;
        root.style.height = '100%';
        root.style.width = '100%';
        host.appendChild(root);
        return root;
    }

    private createCanvas(root: HTMLDivElement) {
        var renderer = new THREE.WebGLRenderer()
        var canvas = root.ownerDocument.createElement('canvas');
        canvas.id = root.id + '_canvas';
        canvas.style.display = 'block';
        canvas.style.height = '100%';
        canvas.style.width = '100%';
        root.appendChild(canvas);
        return canvas;
    }

    private createRenderingContext(canvas: HTMLCanvasElement): RenderingContext {
        return new RenderingContext(canvas);
    }

    private resizeCanvas(canvas: HTMLCanvasElement) {
        // Lookup the size the browser is displaying the canvas.
        var displayWidth  = canvas.clientWidth;
        var displayHeight = canvas.clientHeight;
        // Check if the canvas is not the same size.
        if (canvas.width  != displayWidth ||
            canvas.height != displayHeight) {
            // Make the canvas the same size
            canvas.width  = displayWidth;
            canvas.height = displayHeight;
        }
    }

    private renderLoop() {
        requestAnimationFrame(() => this.renderLoop());
        this.render();
    }

    private prerender = (renderingContext: RenderingContext) => {
        // initial render step goes here
        this.resizeCanvas(renderingContext.canvas);
        if (renderingContext.canvas2dContext) {
            renderingContext.canvas2dContext.clearRect(0, 0, renderingContext.canvas.clientWidth, renderingContext.canvas.clientHeight);
        }
        if (renderingContext.threeWebGLRenderer) {
            renderingContext.threeWebGLRenderer.setSize(
                renderingContext.canvas.clientWidth, 
                renderingContext.canvas.clientHeight,
                false
            );
        }
        if (renderingContext.threePerspectiveCamera) {
            var aspect = renderingContext.canvas.clientWidth / renderingContext.canvas.clientHeight;
            renderingContext.threePerspectiveCamera.aspect = aspect;
            renderingContext.threePerspectiveCamera.updateProjectionMatrix();
        }
    };

    private postrender: RenderingStep = (renderingContext, next) => { 
        // final render step goes here
        if (renderingContext &&
            renderingContext.threeWebGLRenderer && 
            renderingContext.threeScene && 
            renderingContext.threePerspectiveCamera
        ) {

            renderingContext.threeWebGLRenderer.render(
                renderingContext.threeScene, 
                renderingContext.threePerspectiveCamera
            );

        }
    };

    private render(): void {
        var renderingSteps = this.getRenderingSteps();
        var i = renderingSteps.length;
        let next: RenderingStep = (renderingContext, next) => this.postrender.call(this, this.renderingContext, next);
        this.prerender(this.renderingContext);
        while (i--) {
            next = renderingSteps[i].call(this, this.renderingContext, next);
        }
    }

    public addRenderingStep(id: Symbol, renderingStep: RenderingStep) {
        this.renderingSteps.set(id, renderingStep);
    }

    public removeRenderingStep(id: Symbol) {
        this.renderingSteps.delete(id);
    }

    public startRenderLoop() {
        this.renderLoop();
    }

}