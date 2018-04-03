import * as THREE from 'three';
export declare class RenderingContext {
    readonly canvas: HTMLCanvasElement;
    readonly canvas2dContext?: CanvasRenderingContext2D;
    readonly threeWebGLRenderer?: THREE.WebGLRenderer;
    readonly threePerspectiveCamera?: THREE.PerspectiveCamera;
    readonly threeScene?: THREE.Scene;
    constructor(canvas: HTMLCanvasElement);
    private create2dContext(canvas);
    private createRenderer(canvas);
    private createScene();
    private createCamera(canvas);
}
