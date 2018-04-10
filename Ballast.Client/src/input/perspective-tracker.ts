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

    public constructor(
        @inject(TYPES_BALLAST.RenderingContext) renderingContext: RenderingContext
    ) {
        this.renderingContext = renderingContext;
        this.rotationM4 = new THREE.Matrix4();
        this.cameraPivotQ = this.renderingContext.cameraPivot.quaternion.clone();
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

    public getSnappedRotation(): THREE.Matrix4 {
        let cameraHalfTurns = (2 - this.getCameraHalfTurns()) % 2;
        if (cameraHalfTurns >= 1.625 && cameraHalfTurns < 1.875) {
            this.rotationM4.makeRotationY(1.75 * Math.PI);
        } else if (cameraHalfTurns >= 1.375) {
            this.rotationM4.makeRotationY(1.5 * Math.PI);
        } else if (cameraHalfTurns >= 1.125) {
            this.rotationM4.makeRotationY(1.25 * Math.PI);
        } else if (cameraHalfTurns >= 0.875) {
            this.rotationM4.makeRotationY(Math.PI);
        } else if (cameraHalfTurns >= 0.625) {
            this.rotationM4.makeRotationY(0.75 * Math.PI);
        } else if (cameraHalfTurns >= 0.375) {
            this.rotationM4.makeRotationY(0.5 * Math.PI);
        } else if (cameraHalfTurns >= 0.125) {
            this.rotationM4.makeRotationY(0.25 * Math.PI);
        } else {
            this.rotationM4.makeRotationY(0);
        }
        return this.rotationM4;
    }

    public transformDirection(movementV3: THREE.Vector3): THREE.Vector3 {
        let rotationM4 = this.getSnappedRotation();
        return movementV3.applyMatrix4(rotationM4);
    }

    private getBaseMovementScaled(baseMovement: THREE.Vector3, s: number) {
        return this.transformDirection(baseMovement
            .clone()
            .multiplyScalar(s)
        );
    }

    public getForwardScaled(s: number): THREE.Vector3 {
        return this.getBaseMovementScaled(PerspectiveTracker.BASE_FORWARD, s);
    }

    public getBackScaled(s: number): THREE.Vector3 {
        return this.getBaseMovementScaled(PerspectiveTracker.BASE_BACK, s);
    }
    
    public getLeftScaled(s: number): THREE.Vector3 {
        return this.getBaseMovementScaled(PerspectiveTracker.BASE_LEFT, s);
    }
    
    public getRightScaled(s: number): THREE.Vector3 {
        return this.getBaseMovementScaled(PerspectiveTracker.BASE_RIGHT, s);
    }
}