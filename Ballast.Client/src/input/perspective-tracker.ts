import * as THREE from 'three';
import { injectable, inject } from 'inversify';
import { TYPES_BALLAST } from '../ioc/types';
import { RenderingContext } from "../rendering/rendering-context";

@injectable()
export class PerspectiveTracker {

    private static BASE_FORWARD: THREE.Vector3 = new THREE.Vector3(0, 0, -1);
    private static BASE_BACK: THREE.Vector3 = new THREE.Vector3(0, 0, 1);
    private static BASE_LEFT: THREE.Vector3 = new THREE.Vector3(-1, 0, );
    private static BASE_RIGHT: THREE.Vector3 = new THREE.Vector3(1, 0, 0);

    private readonly renderingContext: RenderingContext;
    private readonly rotationM4: THREE.Matrix4;
    private readonly cameraPivotQ: THREE.Quaternion;
    private readonly snappedRotationMap: Map<number, Map<number, number>>;

    public constructor(
        @inject(TYPES_BALLAST.RenderingContext) renderingContext: RenderingContext
    ) {
        this.renderingContext = renderingContext;
        this.rotationM4 = new THREE.Matrix4();
        this.cameraPivotQ = this.renderingContext.cameraPivot.quaternion.clone();
        this.snappedRotationMap = this.createSnappedRotationMap();
    }

    private createSnappedRotationMap(): Map<number, Map<number, number>> {
        // new map of sides to snap points
        let map = new Map<number, Map<number, number>>();
        // 4-directions
        map.set(4, new Map<number, number>([
            [7 / 4, 0],
            [5 / 4, 3 / 4],
            [3 / 4, 1],
            [1 / 4, 1 / 2],
            [0, 0]
        ]));
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

    public getCameraHalfTurns() {
        //let radiansY = this.getCameraRotation().y;
        let radiansY = this.renderingContext.cameraPivot.rotation.y * -1;
        let turns =  Math.round((radiansY / Math.PI) * 100) / 100;
        if (1/turns === -Infinity) {
            turns = 0;
        }
        if (turns < 0) {
            turns = (turns + 2);
        }
        return turns;
    }

    public getCameraRotation() {
        var rotationE = this.renderingContext.cameraPivot.rotation.clone();
        rotationE.setFromQuaternion(this.cameraPivotQ.setFromEuler(rotationE).inverse());
        return rotationE;
    }

    public getCameraTurns() {
        return this.getCameraHalfTurns() / 2;
    }

    public getUnsnappedRotation(): THREE.Matrix4 {
        let cameraHalfTurns = (2 - this.getCameraHalfTurns()) % 2;
        this.rotationM4.makeRotationY(cameraHalfTurns * Math.PI);
        return this.rotationM4;
    }

    public getSnappedRotation(directions: number): THREE.Matrix4 {
        let map = this.snappedRotationMap.get(directions);
        if (!map) {
            throw new Error(`Could not determine snap rotations for increment '${directions}'`);
        }
        let minimums = map.keys();
        let cameraHalfTurns = (2 - this.getCameraHalfTurns()) % 2;
        let halfTurns = 0;
        let done = false;
        while(!done) {
            let lowerBound = minimums.next();
            if (lowerBound.done)
                done = true;
            if (cameraHalfTurns > lowerBound.value) {
                halfTurns = <number>map.get(lowerBound.value);
            }
        }
        this.rotationM4.makeRotationY(halfTurns * Math.PI);
        return this.rotationM4;
    }

    public transformDirection(movementV3: THREE.Vector3, possibleDirections?: number): THREE.Vector3 {
        let rotationM4 = null;
        if (possibleDirections) {
            rotationM4 = this.getSnappedRotation(possibleDirections);
        } else {
            rotationM4 = this.getUnsnappedRotation();
        }
        return movementV3.applyMatrix4(rotationM4);
    }

    private getBaseMovementScaled(baseMovement: THREE.Vector3, scalar: number, possibleDirections?: number) {
        let vector = baseMovement.clone().multiplyScalar(scalar);
        return this.transformDirection(vector, possibleDirections);
    }

    public getForwardScaled(scalar: number, possibleDirections?: number): THREE.Vector3 {
        return this.getBaseMovementScaled(PerspectiveTracker.BASE_FORWARD, scalar);
    }

    public getBackScaled(scalar: number, possibleDirections?: number): THREE.Vector3 {
        return this.getBaseMovementScaled(PerspectiveTracker.BASE_BACK, scalar);
    }
    
    public getLeftScaled(scalar: number, possibleDirections?: number): THREE.Vector3 {
        return this.getBaseMovementScaled(PerspectiveTracker.BASE_LEFT, scalar);
    }
    
    public getRightScaled(scalar: number, possibleDirections?: number): THREE.Vector3 {
        return this.getBaseMovementScaled(PerspectiveTracker.BASE_RIGHT, scalar);
    }
}