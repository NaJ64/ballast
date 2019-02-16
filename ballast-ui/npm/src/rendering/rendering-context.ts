import { IApplicationContext } from "../application-context";
import { KeyboardWatcher } from "../input/keyboard-watcher";

export interface IRenderingContext {
    readonly application: IApplicationContext;
    readonly canvas: HTMLCanvasElement;
    readonly frameDelta: number;
    readonly keyboard: KeyboardWatcher;
    readonly root: HTMLDivElement;
    refreshFrameDelta(): void;
}

export type RenderingStep = (renderingContext: IRenderingContext, next: () => void) => void;