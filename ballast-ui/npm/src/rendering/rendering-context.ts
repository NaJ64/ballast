import { IEventBus } from "ballast-core";
import { IApplicationContext } from "../application-context";
import { KeyboardWatcher } from "../input/keyboard-watcher";

export interface IRenderingContext {
    readonly canvas: HTMLCanvasElement;
    readonly application: IApplicationContext;
    readonly eventBus: IEventBus;
    readonly keyboard: KeyboardWatcher;
    readonly frameDelta: number;
    refreshFrameDelta(): void;
}

export type RenderingStep = (renderingContext: IRenderingContext, next: () => void) => void;