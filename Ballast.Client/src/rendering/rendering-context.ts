import * as THREE from 'three';

export class RenderingContext {

    public readonly canvas: HTMLCanvasElement;
    public readonly threeWebGLRenderer?: THREE.WebGLRenderer;
    public readonly threePerspectiveCamera?: THREE.PerspectiveCamera;
    public readonly threeScene?: THREE.Scene;

    public constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.threeWebGLRenderer = this.createRenderer(canvas);
        this.threeScene = this.createScene();
        this.threePerspectiveCamera = this.createCamera(canvas);
    }

    private createRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
        return new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    }

    private createScene(): THREE.Scene {
        return new THREE.Scene();
    }

    private createCamera(canvas: HTMLCanvasElement): THREE.PerspectiveCamera {
        var aspect = canvas.clientWidth / canvas.clientHeight;
        return new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    }

}