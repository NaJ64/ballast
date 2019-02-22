import { IDirection } from "ballast-core";
import * as THREE from "three";
import { BallastAppConstants } from "../app-constants";
import { IVesselCompass } from "../input/vessel-compass";
import { RenderingConstants } from "../rendering/rendering-constants";

export class CameraTracker implements IVesselCompass {

    private readonly _threeCameraPivot: THREE.Object3D;
    private readonly _threeScene: THREE.Scene;
    private readonly _rotationM4: THREE.Matrix4;
    private readonly _snappedRotationMap: Map<number, Map<number, number>>;

    public constructor(threeScene: THREE.Scene, threeCameraPivot: THREE.Object3D) {
        this._rotationM4 = new THREE.Matrix4();
        this._snappedRotationMap = this.createSnappedRotationMap();
        this._threeCameraPivot = threeCameraPivot;
        this._threeScene = threeScene;
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
        // Determine the default subject
        // Use the camera pivot if it is the top-level subject in the scene, 
        // Otherwise default to using whatever object the cameraPivot is attached to
        let defaultSubject = this._threeCameraPivot;
        if (this._threeCameraPivot.parent && this._threeCameraPivot.parent != this._threeScene) {
            defaultSubject = this._threeCameraPivot.parent;
        }
        let object = subject || defaultSubject;
        // Assumes the object/subject point of reference is  adjusted by the initial orientation
        let radiansY = object.rotation.y - RenderingConstants.INITIAL_ORIENTATION_RADIANS;
        //radiansY *= -1;
        let turns =  Math.round((radiansY / Math.PI) * 10000) / 10000;
        if (1/turns === -Infinity) {
            turns = 0;
        }
        if (turns < 0) {
            turns = (turns + 2);
        }
        return turns;
    }

    public getDirection(tileShape: string, subject?: THREE.Object3D): IDirection {
        let turns = this.getTurns(subject);
        /* Square
                N
              ____
         W   |    |   E
             |____|
                S
        */
        if (tileShape.toLocaleLowerCase() == BallastAppConstants.TILE_SHAPE_SQUARE) {
            if (turns > 0.5 && turns < 1) {
                return { east: false, north: false, west: false, south: true };
            } else if (turns > 0.25) {
                return { east: false, north: false, west: true, south: false };
            } else if (turns > 0) {
                return { east: false, north: true, west: false, south: false };
            } else {
                return { east: true, north: false, west: false, south: false };
            }
        }
        /* Octagon
         NW     N     NE
             ______
            /      \   
        W  |        |  E
           |        |
            \______/
         SW     S    SE
        */
        if (tileShape.toLocaleLowerCase() == BallastAppConstants.TILE_SHAPE_OCTAGON) {
            if (turns > 0.75 && turns < 1) {
                return { east: true, north: false, west: false, south: true };
            } else if (turns > 0.625) {
                return { east: false, north: false, west: false, south: true };
            } else if (turns > 0.5) {
                return { east: false, north: false, west: true, south: true };
            } else if (turns > 0.375) {
                return { east: false, north: false, west: true, south: false };
            } else if (turns > 0.25) {
                return { east: false, north: true, west: true, south: false };
            } else if (turns > 0.175) {
                return { east: false, north: true, west: false, south: false };
            } else if (turns > 0) {
                return { east: true, north: true, west: false, south: false };
            } else {
                return { east: true, north: false, west: false, south: false };
            }
        }
        /* Hexagon (pointy-top) OR Circle
           NW     NE
             .-"-.
         W  |     |  E
             "-.-"
           SW      SE
        */
        // if (
        //     tileShape.toLocaleLowerCase() == BallastAppConstants.TILE_SHAPE_CIRCLE ||
        //     tileShape.toLocaleLowerCase() == BallastAppConstants.TILE_SHAPE_HEXAGON
        // ) {
        if (turns > (.67) && turns < 1) { // TODO:  Fix rounding error for .67 (4/6)
            return { east: true, north: false, west: false, south: true };
        } else if (turns > (3/6)) {
            return { east: false, north: false, west: true, south: true };
        } else if (turns > (.34)) { // TODO:  Fix rounding error for .34 (2/6)
            return { east: false, north: false, west: true, south: false };
        } else if (turns > (1/6)) {
            return { east: false, north: true, west: true, south: false };
        } else if (turns > 0) {
            return { east: true, north: true, west: false, south: false };
        } else {
            return { east: true, north: false, west: false, south: false };
        }
        // }
    }

    public getTurns(subject?: THREE.Object3D): number {
        return this.getHalfTurns(subject) / 2;
    }

    public getUnsnappedRotation(subject?: THREE.Object3D): THREE.Matrix4 {
        let objectHalfTurns = (2 - this.getHalfTurns(subject)) % 2;
        this._rotationM4.makeRotationY(objectHalfTurns * Math.PI);
        return this._rotationM4;
    }

    public getSnappedRotation(directions: number, subject?: THREE.Object3D): THREE.Matrix4 {
        let map = this._snappedRotationMap.get(directions);
        if (!map) {
            throw new Error(`Could not determine snap rotations for increment "${directions}"`);
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
        this._rotationM4.makeRotationY(radians);
        return this._rotationM4;
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

}