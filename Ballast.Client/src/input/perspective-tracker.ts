import * as THREE from 'three';
import { injectable, inject } from 'inversify';
import { TYPES_BALLAST } from '../ioc/types';
import { RenderingConstants } from "../rendering/rendering-constants";
import { RenderingContext } from "../rendering/rendering-context";

@injectable()
export class PerspectiveTracker {

    private static INITIAL_ORIENTATION_EULER = new THREE.Euler(0, -1 * RenderingConstants.INITIAL_ORIENTATION_RADIANS, 0, 'YXZ');
    private static BASE_FORWARD: THREE.Vector3 = new THREE.Vector3(0, 0, -1).applyEuler(PerspectiveTracker.INITIAL_ORIENTATION_EULER);
    private static BASE_BACK: THREE.Vector3 = new THREE.Vector3(0, 0, 1).applyEuler(PerspectiveTracker.INITIAL_ORIENTATION_EULER);
    private static BASE_LEFT: THREE.Vector3 = new THREE.Vector3(-1, 0, ).applyEuler(PerspectiveTracker.INITIAL_ORIENTATION_EULER);
    private static BASE_RIGHT: THREE.Vector3 = new THREE.Vector3(1, 0, 0).applyEuler(PerspectiveTracker.INITIAL_ORIENTATION_EULER);

    private readonly renderingContext: RenderingContext;
    private readonly rotationM4: THREE.Matrix4;
    private readonly objectQ: THREE.Quaternion;
    private readonly snappedRotationMap: Map<number, Map<number, number>>;

    public constructor(
        @inject(TYPES_BALLAST.RenderingContext) renderingContext: RenderingContext
    ) {
        this.renderingContext = renderingContext;
        this.rotationM4 = new THREE.Matrix4();
        this.objectQ = this.renderingContext.cameraPivot.quaternion.clone();
        this.snappedRotationMap = this.createSnappedRotationMap();
    }

    private createSnappedRotationMap(): Map<number, Map<number, number>> {
        // new map of sides to snap points
        let map = new Map<number, Map<number, number>>();
        // 4-directions
        map.set(4, new Map<number, number>([
            [7 / 4, 0],
            [5 / 4, 3 / 2],
            [3 / 4, 1],
            [1 / 4, 1 / 2],
            [0, 0]
        ]));
        Math.PI / -2
        // 6 directions (no direct north/south)
        map.set(6, new Map<number, number>([
            [11 / 6, 0],
            [3 / 2, 5 / 3],
            [7 / 6, 4 / 3],
            [5 / 6, 1],
            [1 / 2, 2 / 3],
            [1 / 6, 1 / 3],
            [0, 0]
        ]));
        // 8 directions
        map.set(8, new Map<number, number>([
            [15 / 8, 0],
            [13 / 8, 7 / 4],
            [11 / 8, 3 / 2],
            [9 / 8, 5 / 4],
            [7 / 8, 1],
            [5 / 8, 3 / 4],
            [3 / 8, 1 / 2],
            [1 / 8, 1 / 4],
            [0, 0]
        ]));
        // return the map
        return map;
    }

    private getHalfTurns(subject?: THREE.Object3D) {
        let object = subject || this.renderingContext.cameraPivot;
        let radiansY = object.rotation.y * -1;
        radiansY -= RenderingConstants.INITIAL_ORIENTATION_RADIANS;
        let turns =  Math.round((radiansY / Math.PI) * 100) / 100;
        if (1/turns === -Infinity) {
            turns = 0;
        }
        if (turns < 0) {
            turns = (turns + 2);
        }
        return turns;
    }

    public getTurns(subject?: THREE.Object3D) {
        return this.getHalfTurns(subject) / 2;
    }

    public getUnsnappedRotation(subject?: THREE.Object3D): THREE.Matrix4 {
        let objectHalfTurns = (2 - this.getHalfTurns(subject)) % 2;
        this.rotationM4.makeRotationY(objectHalfTurns * Math.PI);
        return this.rotationM4;
    }

    public getSnappedRotation(directions: number, subject?: THREE.Object3D): THREE.Matrix4 {
        let map = this.snappedRotationMap.get(directions);
        if (!map) {
            throw new Error(`Could not determine snap rotations for increment '${directions}'`);
        }
        let minimums = map.keys();
        let objectHalfTurns = (2 - this.getHalfTurns(subject)) % 2;
        let halfTurns = 0;
        let done = false;
        while(!done) {
            let lowerBound = minimums.next();
            if (lowerBound.done)
                done = true;
            if (objectHalfTurns >= lowerBound.value) {
                halfTurns = <number>map.get(lowerBound.value);
                done = true;
            }
        }
        let radians = (halfTurns * Math.PI);
        this.rotationM4.makeRotationY(radians);
        return this.rotationM4;
    }

    public transformDirection(movementV3: THREE.Vector3, subject?: THREE.Object3D, directions?: number): THREE.Vector3 {
        let rotationM4: THREE.Matrix4;
        if (!directions) {
            rotationM4 = this.getUnsnappedRotation(subject);
        } else {
            rotationM4 = this.getSnappedRotation(directions, subject);
        }
        return movementV3.applyMatrix4(rotationM4);
    }

    private getBaseMovementScaled(baseMovement: THREE.Vector3, scalar: number, subject?: THREE.Object3D, directions?: number) {
        let vector = baseMovement.clone().multiplyScalar(scalar);
        return this.transformDirection(vector, subject, directions);
    }

    public getForwardScaled(scalar: number, subject?: THREE.Object3D, directions?: number): THREE.Vector3 {
        return this.getBaseMovementScaled(PerspectiveTracker.BASE_FORWARD, scalar, subject, directions);
    }

    public getBackScaled(scalar: number, subject?: THREE.Object3D, directions?: number): THREE.Vector3 {
        return this.getBaseMovementScaled(PerspectiveTracker.BASE_BACK, scalar, subject, directions);
    }
    
    public getLeftScaled(scalar: number, subject?: THREE.Object3D, directions?: number): THREE.Vector3 {
        return this.getBaseMovementScaled(PerspectiveTracker.BASE_LEFT, scalar, subject, directions);
    }
    
    public getRightScaled(scalar: number, subject?: THREE.Object3D, directions?: number): THREE.Vector3 {
        return this.getBaseMovementScaled(PerspectiveTracker.BASE_RIGHT, scalar, subject, directions);
    }
}