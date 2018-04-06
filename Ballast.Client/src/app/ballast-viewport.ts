import * as THREE from 'three';
import { injectable } from 'inversify';
import { KeyboardWatcher } from '../input/keyboard-watcher';
import { RenderingContext } from '../rendering/rendering-context';

export type RenderingStep = (renderingContext: RenderingContext, next: () => void) => void;

@injectable()
export class BallastViewport {
    
    private readonly root: HTMLDivElement;
    private readonly canvas: HTMLCanvasElement;
    private readonly keyboardWatcher: KeyboardWatcher;
    private readonly renderingContext: RenderingContext;
    private readonly renderingSteps: Map<Symbol, RenderingStep>;
    private cachedSteps: RenderingStep[] | null;

    public constructor(host: HTMLElement, clientId: string) {
        this.root = this.createRoot(host, clientId);
        this.canvas = this.createCanvas(this.root);
        this.keyboardWatcher = this.createKeyboardWatcher(this.root);
        this.renderingContext = this.createRenderingContext(this.canvas, this.keyboardWatcher);
        this.renderingSteps = this.createRenderingSteps();
        this.cachedSteps = null;
    }

    public getRoot(): HTMLDivElement {
        return this.root;
    }

    public getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    public getKeyboardWatcher(): KeyboardWatcher {
        return this.keyboardWatcher;
    }

    public getRenderingContext(): RenderingContext {
        return this.renderingContext;
    }

    public getRenderingSteps(): RenderingStep[] {
        if (!this.cachedSteps) {
            this.cachedSteps = Array.from(this.renderingSteps.values());
        }
        return this.cachedSteps;
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

    private createKeyboardWatcher(root: HTMLDivElement) {
        return new KeyboardWatcher(root);
    }

    private createRenderingContext(canvas: HTMLCanvasElement, keyboardWatcher: KeyboardWatcher) {
        return new RenderingContext(canvas, keyboardWatcher);
    }

    private createRenderingSteps() {
        this.clearCachedRenderingSteps();
        return new Map<Symbol, RenderingStep>();
    }

    private clearCachedRenderingSteps() {
        this.cachedSteps = null;
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
        if (renderingContext.threeWebGLRenderer) {
            renderingContext.threeWebGLRenderer.setSize(
                renderingContext.canvas.clientWidth, 
                renderingContext.canvas.clientHeight,
                false
            );
        }
        if (renderingContext.threePerspectiveCamera) {
            var originalAspect = renderingContext.threePerspectiveCamera.aspect;
            var newAspect = renderingContext.canvas.clientWidth / renderingContext.canvas.clientHeight;
            if (originalAspect != newAspect) {
                renderingContext.threePerspectiveCamera.aspect = newAspect;
                renderingContext.threePerspectiveCamera.updateProjectionMatrix();
            }
        }
    };

    private postrender: RenderingStep = (renderingContext, next) => { 
        // final render step goes here
        if (renderingContext) {
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
        this.clearCachedRenderingSteps();
        this.renderingSteps.set(id, renderingStep);
    }

    public removeRenderingStep(id: Symbol) {
        this.clearCachedRenderingSteps();
        this.renderingSteps.delete(id);
    }

    public startRenderLoop() {
        this.renderLoop();
    }

}