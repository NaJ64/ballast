import THREE from "three";
import { IApplicationContext } from "../../application-context";
import { KeyboardWatcher } from "../../input/keyboard-watcher";
import { IRenderingContext } from "../rendering-context";
import { ThreePerspectiveTracker } from './three-perspective-tracker';

export class ThreeRenderingContext implements IRenderingContext {

    private readonly _application: IApplicationContext;
    private readonly _canvas: HTMLCanvasElement;
    private _frameDelta: number;
    private readonly _keyboard: KeyboardWatcher;
    private readonly _root: HTMLDivElement;
    private readonly _threeCamera: THREE.PerspectiveCamera;
    private readonly _threeCameraPivot: THREE.Object3D;
    private readonly _threeClock: THREE.Clock;
    private readonly _threeRenderer: THREE.WebGLRenderer;
    private readonly _threeScene: THREE.Scene
    private readonly _perspectiveTracker: ThreePerspectiveTracker;

    public constructor(
        root: HTMLDivElement,
        canvas: HTMLCanvasElement, 
        keyboard: KeyboardWatcher, 
        application: IApplicationContext
    ) {
        // Base IRenderingContext types
        this._application = application;
        this._canvas = canvas;
        this._frameDelta = 0;
        this._keyboard = keyboard;
        this._root = root;
        // THREE.js objects
        this._threeClock = new THREE.Clock();
        this._threeScene = new THREE.Scene();
        this._threeRenderer = this.createThreeRenderer(this._canvas);
        this._threeCamera = this.createThreeCamera(this._canvas);
        this._threeCameraPivot = this.createThreeCameraPivot(this._threeScene, this._threeCamera);
        // Perspective tracker
        this._perspectiveTracker = new ThreePerspectiveTracker(this._threeScene, this._threeCameraPivot);
    }

    public get application(): IApplicationContext {
        return this._application;
    }

    public get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    public get frameDelta(): number {
        return this._frameDelta;
    }

    public get isThreeRenderingContext(): boolean {
        return true; // Helper flag for ThreeRenderingComponent(s)
    }

    public get keyboard(): KeyboardWatcher {
        return this._keyboard;
    }

    public get perspectiveTracker(): ThreePerspectiveTracker {
        return this._perspectiveTracker;
    }

    public get root(): HTMLDivElement {
        return this._root;
    }

    public get threeCamera(): THREE.PerspectiveCamera {
        return this._threeCamera;
    }

    public get threeCameraPivot(): THREE.Object3D {
        return this._threeCameraPivot;
    }

    public get threeRenderer(): THREE.WebGLRenderer {
        return this._threeRenderer;
    }

    public get threeScene(): THREE.Scene {
        return this._threeScene;
    }

    public refreshFrameDelta(): void {
        this._frameDelta = this._threeClock.getDelta();
    }

    private createThreeRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
        var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
        renderer.setPixelRatio(1);
        return renderer;
    }

    private createThreeCamera(canvas: HTMLCanvasElement): THREE.PerspectiveCamera {
        let aspect = canvas.clientWidth / canvas.clientHeight;
        let camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        return camera;
    }

    private createThreeCameraPivot(scene: THREE.Scene, camera: THREE.Camera): THREE.Object3D {
        let cameraPivot = new THREE.Object3D();
        cameraPivot.position.copy(scene.position);
        cameraPivot.rotation.reorder('YXZ');
        cameraPivot.add(camera);
        scene.add(cameraPivot);
        return cameraPivot;
    }

    public attachCameraToObject(attachToObject: THREE.Object3D) {
        if (this._threeCameraPivot.parent != attachToObject) {
            this._threeScene.remove(this._threeCameraPivot);
            attachToObject.add(this._threeCameraPivot);
        }
        return attachToObject;
    }

    public detachCameraFromObject(detachFromObject: THREE.Object3D) {
        if (this._threeCameraPivot.parent == detachFromObject) {
            detachFromObject.remove(this._threeCameraPivot);
            this._threeScene.add(this._threeCameraPivot);
        }
        return detachFromObject;
    }

}