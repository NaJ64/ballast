import * as THREE from 'three';
import { Game } from 'ballast-core';
import { KeyboardWatcher } from '../input/keyboard-watcher';

export class RenderingContext {

    public readonly canvas: HTMLCanvasElement;
    public readonly keyboard: KeyboardWatcher;
    public readonly renderer: THREE.WebGLRenderer;
    public readonly scene: THREE.Scene;
    public readonly camera: THREE.PerspectiveCamera;
    public readonly cameraPivot: THREE.Object3D;
    public readonly clock: THREE.Clock;

    public get game() {
        return this.currentGame;
    }

    private currentGame?: Game;
    private frameDelta: number;

    public constructor(canvas: HTMLCanvasElement, keyboardWatcher: KeyboardWatcher) {
        this.canvas = canvas;
        this.keyboard = keyboardWatcher;
        this.renderer = this.createRenderer(this.canvas);
        this.scene = this.createScene();
        this.camera = this.createCamera(this.canvas);
        this.cameraPivot = this.createCameraPivot(this.scene, this.camera);
        this.clock = new THREE.Clock();
        this.frameDelta = 0;
        this.currentGame = undefined;
    }

    private createRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
        return new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    }

    private createScene(): THREE.Scene {
        return new THREE.Scene();
    }

    private createCamera(canvas: HTMLCanvasElement): THREE.PerspectiveCamera {
        let aspect = canvas.clientWidth / canvas.clientHeight;
        let camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        return camera;
    }

    private createCameraPivot(scene: THREE.Scene, camera: THREE.Camera): THREE.Object3D {
        let cameraPivot = new THREE.Object3D();
        cameraPivot.position.copy(scene.position);
        cameraPivot.rotation.reorder('YXZ');
        cameraPivot.add(camera);
        scene.add(cameraPivot);
        return cameraPivot;
    }

    public setCurrentGame(game?: Game) {
        this.currentGame = game;
    }

    public refreshFrameDelta() {
        this.frameDelta = this.clock.getDelta();
    }

    public getCurrentFrameDelta() {
        return this.frameDelta;
    }

}