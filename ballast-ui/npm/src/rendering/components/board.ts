import { RenderingComponentBase } from "../rendering-component";
import * as THREE from "three";

export class BoardComponent extends RenderingComponentBase { 

    public getTilePosition(orderedTriple: number[]): THREE.Vector3 {
        throw new Error("Method not implemented");
    }
}