import * as THREE from 'three';
export declare class RenderingContext {
    readonly canvas: HTMLCanvasElement;
    readonly threeWebGLRenderer?: THREE.WebGLRenderer;
    readonly threePerspectiveCamera?: THREE.PerspectiveCamera;
    readonly threeScene?: THREE.Scene;
    constructor(canvas: HTMLCanvasElement);
    private createRenderer(canvas);
    private createScene();
    private createCamera(canvas);
}
