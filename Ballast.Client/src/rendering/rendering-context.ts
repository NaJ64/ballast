import * as THREE from 'three';
import { KeyboardWatcher } from '../input/keyboard-watcher';

export class RenderingContext {

    public readonly canvas: HTMLCanvasElement;
    public readonly keyboard: KeyboardWatcher;
    public readonly renderer: THREE.WebGLRenderer;
    public readonly scene: THREE.Scene;
    public readonly camera: THREE.PerspectiveCamera;
    public readonly cameraPivot: THREE.Object3D;
    public readonly clock: THREE.Clock;

    private frameDelta: number;
    private cameraPivotQ: THREE.Quaternion;

    public constructor(canvas: HTMLCanvasElement, keyboardWatcher: KeyboardWatcher) {
        this.canvas = canvas;
        this.keyboard = keyboardWatcher;
        this.renderer = this.createRenderer(this.canvas);
        this.scene = this.createScene();
        this.camera = this.createCamera(this.canvas);
        this.cameraPivot = this.createCameraPivot(this.scene, this.camera);
        this.clock = new THREE.Clock();
        this.frameDelta = 0;
        this.cameraPivotQ = this.cameraPivot.quaternion.clone();
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

    public refreshFrameDelta() {
        this.frameDelta = this.clock.getDelta();
    }

    public getCurrentFrameDelta() {
        return this.frameDelta;
    }

    public getCameraRotation() {
        var orientation = this.cameraPivot.rotation.clone();
        orientation.setFromQuaternion(this.cameraPivotQ.setFromEuler(orientation).inverse());
        return orientation;
    }

    public getCameraTurns() {
        //let radiansY = this.getCameraRotation().y;
        let radiansY = this.cameraPivot.rotation.y * -1;
        let turns =  Math.round((radiansY / Math.PI) * 100) / 200;
        if (1/turns === -Infinity) {
            turns = 0;
        }
        if (turns < 0) {
            turns = (turns + 1);
        }
        return turns;
    }

    public getPositionIncrement(direction: string): THREE.Vector3 { //returns a Vector3 of how the position of an object should change based on the current camera rotation
        if(direction==='left'){
            if (this.getCameraTurns() === 0 ){
                return new THREE.Vector3(-.1,0,0);
            }else if(this.getCameraTurns() ===.25){
                return new THREE.Vector3(0,0,-.1);
            }else if(this.getCameraTurns() ===.5){
                return new THREE.Vector3(.1,0,0);
            }else if(this.getCameraTurns() ===.75){
                return new THREE.Vector3(0,0,.1);
            }
        }else if(direction==='right'){
            if (this.getCameraTurns() === 0 ){
                return new THREE.Vector3(.1,0,0);
            }else if(this.getCameraTurns() ===.25){
                return new THREE.Vector3(0,0,.1);
            }else if(this.getCameraTurns() ===.5){
                return new THREE.Vector3(-.1,0,0);
            }else if(this.getCameraTurns() ===.75){
                return new THREE.Vector3(0,0,-.1);
            }
        }else if(direction==='up'){
            if (this.getCameraTurns() === 0 ){
                return new THREE.Vector3(0,0,-.1);
            }else if(this.getCameraTurns() ===.25){
                return new THREE.Vector3(.1,0,0);
            }else if(this.getCameraTurns() ===.5){
                return new THREE.Vector3(0,0,.1);
            }else if(this.getCameraTurns() ===.75){
                return new THREE.Vector3(-.1,0,0);
            }
        }else if(direction==='down'){
            if (this.getCameraTurns() === 0 ){
                return new THREE.Vector3(0,0,.1);
            }else if(this.getCameraTurns() ===.25){
                return new THREE.Vector3(-.1,0,0);
            }else if(this.getCameraTurns() ===.5){
                return new THREE.Vector3(0,0,-.1);
            }else if(this.getCameraTurns() ===.75){
                return new THREE.Vector3(.1,0,0);
            }
        }
        return new THREE.Vector3(0,0,0);
    
    }

}