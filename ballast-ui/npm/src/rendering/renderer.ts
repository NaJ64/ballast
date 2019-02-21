import { IRenderingContext, RenderingContextFactory, RenderingStep } from "./rendering-context";
import { RenderingMiddleware } from "./rendering-middleware";
import { ThreeRenderingContext } from '../three/rendering/three-rendering-context';

export interface IRenderer {
    attach(): void;
    detach(): void;
    startRenderLoop(): void;
}

export class Renderer implements IRenderer {

    private readonly _host: HTMLElement;
    private readonly _clientId: string;
    private readonly _root: HTMLDivElement;
    private readonly _gameStyle: HTMLStyleElement;
    private readonly _canvas: HTMLCanvasElement;
    private readonly _renderingMiddleware: RenderingMiddleware;
    private readonly _renderingContext: IRenderingContext

    public constructor(host: HTMLElement, clientId: string, renderingContextFactory: RenderingContextFactory) {
        this._host = host;
        this._clientId = clientId;
        this._root = this.createRoot(this._host, this._clientId);
        this._gameStyle = this.createGameStyle(this._root);
        this._canvas = this.createCanvas(this._root);
        this._renderingMiddleware = new RenderingMiddleware();
        this._renderingContext = renderingContextFactory(this._canvas);
    }

    public attach() {
        this._host.appendChild(this._root);
    }

    public detach() {
        this._host.removeChild(this._root);
    }

    public startRenderLoop() {
        this.renderLoop();
    }

    public addRenderingStep(renderingStep: RenderingStep) {
        this._renderingMiddleware.use(renderingStep)
    }

    private createRoot(host: HTMLElement, id: string): HTMLDivElement {
        var root = host.ownerDocument!.createElement("div");
        root.id = id;
        root.style.fontSize = '10';
        root.style.border = '2px';
        root.style.borderStyle = 'solid';
        root.style.borderColor = 'white';
        root.style.backgroundColor = 'black';
        root.style.height = 'calc(100% - 4px)';
        root.style.width = 'calc(100% - 4px)';
        return root;
    }

    private createGameStyle(root: HTMLDivElement): HTMLStyleElement {
        let currentDocument = root.ownerDocument!;
        let head = currentDocument.head || currentDocument.getElementsByTagName('head')[0];
        let gameStyle = currentDocument.createElement('style');
        gameStyle.type = 'text/css';
        gameStyle.appendChild(document.createTextNode(''));
        head.appendChild(gameStyle);
        return gameStyle;
    }

    private createCanvas(root: HTMLDivElement): HTMLCanvasElement {
        var canvas = root.ownerDocument!.createElement('canvas');
        canvas.id = root.id + '_canvas';
        canvas.style.display = 'block';
        canvas.style.height = '100%';
        canvas.style.width = '100%';
        root.appendChild(canvas);
        return canvas;
    }

    private renderLoop() {
        requestAnimationFrame(() => this.renderLoop());
        this.render();
    }

    private render(): void {
        this._renderingContext.refreshFrameDelta();
        this.prerender(this._renderingContext as IRenderingContext);
        this._renderingMiddleware.renderAll(this._renderingContext, this.postrender.bind(this));
    }

    private prerender = (renderingContext: IRenderingContext) => {
        // Always try to resize the canvas (in case user has resized their window)
        this.resizeCanvas(renderingContext.canvas);
        // Type guard for ThreeRenderingContext
        if ((<ThreeRenderingContext>renderingContext).isThreeRenderingContext) {
            // Resize the renderer to match the new canvas size
            (<ThreeRenderingContext>renderingContext).threeRenderer.setSize(
                renderingContext.canvas.clientWidth, 
                renderingContext.canvas.clientHeight,
                false
            ); 
            // Check if we need to update the camera aspect ratio / projection matrix as well
            var originalAspect = (<ThreeRenderingContext>renderingContext).threeCamera.aspect;
            var newAspect = renderingContext.canvas.clientWidth / renderingContext.canvas.clientHeight;
            if (originalAspect != newAspect) {
                (<ThreeRenderingContext>renderingContext).threeCamera.aspect = newAspect;
                (<ThreeRenderingContext>renderingContext).threeCamera.updateProjectionMatrix();
            }
        }
    };

    private postrender = (renderingContext: IRenderingContext) => { 
        // Type guard for ThreeRenderingContext
        if ((<ThreeRenderingContext>renderingContext).isThreeRenderingContext) {
            // End the current render loop
            (<ThreeRenderingContext>renderingContext).threeRenderer.render(
                (<ThreeRenderingContext>renderingContext).threeScene, 
                (<ThreeRenderingContext>renderingContext).threeCamera
            );
        }
    };

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

}