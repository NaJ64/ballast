import { CubicCoordinates } from "./cubic-coordinates";
import { OffsetCoordinates } from "./offset-coordinates";

export class AxialCoordinates {

    public readonly x: number;
    public readonly z: number;

    private constructor(x: number, z: number) {
        this.x = x;
        this.z = z;
        if (this.x == -0)
            this.x = 0;
        if (this.z == -0)
            this.z = 0;
    }

    public static fromCubic(object: CubicCoordinates) {
        return new AxialCoordinates(object.x, object.z);
    }

    public static fromOffset(object: OffsetCoordinates) {
        return AxialCoordinates.fromCubic(
            CubicCoordinates.fromOffset(object)
        );
    }

    public static fromOrderedPair(orderedPair: number[]) {
        if (orderedPair.length < 2)
            throw new Error('Length of ordered pair must be 2 (or greater)');
        let x = orderedPair[0];
        let z = orderedPair[1];
        return new AxialCoordinates(x, z);
    }

    public equals(object: AxialCoordinates) {
        if (!object) {
            return false;
        }
        return (
            this.x == object.x &&
            this.z == object.z
        );
    }

    public equalsCubic(object: CubicCoordinates) {
        return AxialCoordinates
            .fromCubic(object)
            .equals(this);
    }

    public toCubic() {
        return CubicCoordinates.fromAxial(this);
    }

    public toOffset() {
        return OffsetCoordinates.fromAxial(this);
    }

    public toOrderedPair() {
        return [this.x, this.z];
    }

}