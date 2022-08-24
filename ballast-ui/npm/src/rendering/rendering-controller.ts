import { IRootComponentFactory } from "./components/root";
import { IRenderingContext, IRenderingContextFactory } from "./rendering-context";
import { RenderingMiddleware, RenderingStep } from "./rendering-middleware";

export interface IRenderingController {
    renderingContext: IRenderingContext;
    attach(): void;
    startRenderLoop(): void;
}

export class RenderingController implements IRenderingController {

    private readonly _host: HTMLElement;
    private readonly _clientId: string;
    private readonly _root: HTMLDivElement;
    private readonly _gameStyle: HTMLStyleElement;
    private readonly _canvas: HTMLCanvasElement;
    private readonly _renderingMiddleware: RenderingMiddleware;
    private readonly _renderingContext: IRenderingContext
    private readonly _rootComponentFactory: IRootComponentFactory;
    private _lastRenderTimeStamp: number;
    private _currentTimeStamp: number;

    public constructor(
        host: HTMLElement, 
        clientId: string, 
        renderingContextFactory: IRenderingContextFactory,
        rootComponentFactory: IRootComponentFactory
    ) {
        this._host = host;
        this._clientId = clientId;
        this._root = this.createRoot(this._host, this._clientId);
        this._gameStyle = this.createGameStyle(this._root);
        this._canvas = this.createCanvas(this._root);
        this._renderingMiddleware = new RenderingMiddleware();
        this._renderingContext = renderingContextFactory.create(this._canvas, this._gameStyle);
        this._rootComponentFactory = rootComponentFactory;
        this._lastRenderTimeStamp = 0;
        this._currentTimeStamp = 0;
    }

    public attach() {
        let rootComponent = this._rootComponentFactory.create();
        rootComponent.attach(this._host.ownerDocument!, this._root, this._gameStyle, this._renderingMiddleware);
        this._host.appendChild(this._root);
    }

    public startRenderLoop() {
        this.renderLoop();
    }

    public get renderingContext(): IRenderingContext {
        return this._renderingContext;
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
        const frameRate = 1000 / 60; // 60 fps
        const elapsed = this._currentTimeStamp - this._lastRenderTimeStamp;
        if (this._lastRenderTimeStamp == 0 || elapsed >= frameRate) {
            this.render();
            this._lastRenderTimeStamp = this._currentTimeStamp;
        }
        requestAnimationFrame(timestamp => {
            this._currentTimeStamp = timestamp;
            this.renderLoop()  
        });          
    }

    private render(): void {
        this._renderingContext.refreshFrameDelta();
        this.prerender(this._renderingContext as IRenderingContext);
        this._renderingMiddleware.renderAll(this._renderingContext, this.postrender.bind(this));
    }

    private prerender = (renderingContext: IRenderingContext) => {
        // Always try to resize the canvas (in case user has resized their window)
        this.resizeCanvas(renderingContext.canvas);
        // Resize the renderer to match the new canvas size
        renderingContext.threeRenderer.setSize(
            renderingContext.canvas.clientWidth, 
            renderingContext.canvas.clientHeight,
            false
        ); 
        // Check if we need to update the camera aspect ratio / projection matrix as well
        var originalAspect = renderingContext.threeCamera.aspect;
        var newAspect = renderingContext.canvas.clientWidth / renderingContext.canvas.clientHeight;
        if (originalAspect != newAspect) {
            renderingContext.threeCamera.aspect = newAspect;
            renderingContext.threeCamera.updateProjectionMatrix();
        }
    };

    private postrender = (renderingContext: IRenderingContext) => { 
        // End the current render loop
        renderingContext.threeRenderer.render(
            renderingContext.threeScene, 
            renderingContext.threeCamera
        );
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