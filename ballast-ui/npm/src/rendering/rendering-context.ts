import { IBallastAppContext } from "../app-context";
import { KeyboardWatcher } from "../input/keyboard-watcher";

export interface IRenderingContext {
    readonly app: IBallastAppContext;
    readonly canvas: HTMLCanvasElement;
    readonly frameDelta: number;
    readonly keyboard: KeyboardWatcher;
    refreshFrameDelta(): void;
}

export type RenderingContextFactory = (canvas: HTMLCanvasElement) => IRenderingContext;

export type RenderingStep = (renderingContext: IRenderingContext, next: () => void) => void;