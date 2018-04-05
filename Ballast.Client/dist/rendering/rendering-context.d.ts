import * as THREE from 'three';
import { KeyboardWatcher } from '../input/keyboard-watcher';
export declare class RenderingContext {
    readonly canvas: HTMLCanvasElement;
    readonly keyboard: KeyboardWatcher;
    readonly threeWebGLRenderer?: THREE.WebGLRenderer;
    readonly threePerspectiveCamera?: THREE.PerspectiveCamera;
    readonly threeScene?: THREE.Scene;
    constructor(canvas: HTMLCanvasElement, keyboardWatcher: KeyboardWatcher);
    private createRenderer(canvas);
    private createScene();
    private createCamera(canvas);
}
