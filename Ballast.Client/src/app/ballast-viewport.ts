import * as THREE from 'three';
import { injectable } from 'inversify';
import { KeyboardWatcher } from '../input/keyboard-watcher';
import { RenderingContext } from '../rendering/rendering-context';
import { RenderingMiddleware } from '../rendering/rendering-middleware';
import { IEventBus } from '../messaging/event-bus';
import { GameStateChangedEvent } from '../messaging/events/game/game-state-changed';

export type RenderingStep = (renderingContext: RenderingContext, next: () => void) => void;

@injectable()
export class BallastViewport {
    
    private readonly root: HTMLDivElement;
    private readonly gameStyle: HTMLStyleElement;
    private readonly canvas: HTMLCanvasElement;
    private readonly keyboardWatcher: KeyboardWatcher;
    private readonly renderingContext: RenderingContext;
    private readonly renderingMiddleware: RenderingMiddleware;
    private readonly eventBus: IEventBus;

    public constructor(host: HTMLElement, clientId: string, eventBus: IEventBus) {
        this.root = this.createRoot(host, clientId);
        this.gameStyle = this.createGameStyle(this.root);
        this.canvas = this.createCanvas(this.root);
        this.keyboardWatcher = this.createKeyboardWatcher(this.root);
        this.renderingContext = this.createRenderingContext(this.canvas, this.keyboardWatcher);
        this.renderingMiddleware = new RenderingMiddleware();
        this.eventBus = eventBus;
        this.subscribeToEvents();
    }

    public getRoot(): HTMLDivElement {
        return this.root;
    }

    public getGameStyle(): HTMLStyleElement {
        return this.gameStyle;
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

    private createRoot(host: HTMLElement, id: string): HTMLDivElement {
        var root = host.ownerDocument.createElement("div");
        root.id = id;
        root.style.fontSize = '10';
        root.style.border = '2px';
        root.style.borderStyle = 'solid';
        root.style.borderColor = 'white';
        root.style.backgroundColor = 'black';
        root.style.height = 'calc(100% - 4px)';
        root.style.width = 'calc(100% - 4px)';
        host.appendChild(root);
        return root;
    }

    private createGameStyle(root: HTMLDivElement) {
        let currentDocument = root.ownerDocument;
        let head = currentDocument.head || currentDocument.getElementsByTagName('head')[0];
        let gameStyle = currentDocument.createElement('style');
        gameStyle.type = 'text/css';
        gameStyle.appendChild(document.createTextNode(''));
        head.appendChild(gameStyle);
        return gameStyle;
    }

    private createCanvas(root: HTMLDivElement) {
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

    private subscribeToEvents() {
        this.eventBus.subscribe<GameStateChangedEvent>(GameStateChangedEvent.id, this.onGameStateChangedAsync.bind(this));
    }

    private async onGameStateChangedAsync(event: GameStateChangedEvent): Promise<void> {
        this.renderingContext.setCurrentGame(event.game);
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
        // Always try to resize the canvas (in case user has resized their window)
        this.resizeCanvas(renderingContext.canvas);
        // Resize the renderer to match the new canvas size
        renderingContext.renderer.setSize(
            renderingContext.canvas.clientWidth, 
            renderingContext.canvas.clientHeight,
            false
        ); 
        // Check if we need to update the camera aspect ratio / projection matrix as well
        var originalAspect = renderingContext.camera.aspect;
        var newAspect = renderingContext.canvas.clientWidth / renderingContext.canvas.clientHeight;
        if (originalAspect != newAspect) {
            renderingContext.camera.aspect = newAspect;
            renderingContext.camera.updateProjectionMatrix();
        }
    };

    private postrender = (renderingContext: RenderingContext) => { 
        // End the current render loop
        renderingContext.renderer.render(renderingContext.scene, renderingContext.camera);
    };

    private render(): void {
        this.renderingContext.refreshFrameDelta();
        this.prerender(this.renderingContext);
        this.renderingMiddleware.renderAll(this.renderingContext, this.postrender.bind(this));
    }

    public addRenderingStep(renderingStep: RenderingStep) {
        this.renderingMiddleware.use(renderingStep)
    }

    public startRenderLoop() {
        this.renderLoop();
    }

}