import { AxialCoordinates } from "./axial-coordinates";
import { OffsetCoordinates } from "./offset-coordinates";

export class CubicCoordinates {

    public readonly x: number;
    public readonly y: number;
    public readonly z: number;

    private constructor(x: number, y: number, z: number) {
        if ((x + y + z) != 0) {
            throw new Error("Provided object coordinate(s) do not match constraint 'x + y + z = 0'");
        }
        this.x = x;
        this.y = y;
        this.z = z;
        if (this.x == -0)
            this.x = 0;
        if (this.y == -0)
            this.y = 0;
        if (this.z == -0)
            this.z = 0;
    }

    public static fromAxial(object: AxialCoordinates) {
        let y = -1 * (object.x + object.z);
        return new CubicCoordinates(object.x, y, object.z);
    }

    public static fromOffset(object: OffsetCoordinates) {
        var x = object.col - (object.row - (object.row & 1)) / 2;
        var z = object.row;
        var y = -1 * (x + z);
        return new CubicCoordinates(x, y, z );
    }

    public static fromOrderedTriple(orderedTriple: number[]) {
        if (orderedTriple.length < 3)
            throw new Error('Length of ordered pair must be 3 (or greater)');
        let x = orderedTriple[0];
        let y = orderedTriple[1];
        let z = orderedTriple[2];
        return new CubicCoordinates(x, y, z);
    }

    public equals(object: CubicCoordinates) {
        if (!object) {
            return false;
        }
        return (
            this.x == object.x &&
            this.y == object.y &&
            this.z == object.z
        );
    }

    public equalsAxial(object: AxialCoordinates) {
        return CubicCoordinates
            .fromAxial(object)
            .equals(this);
    }

    public equalsOffset(object: OffsetCoordinates) {
        return CubicCoordinates
            .fromOffset(object)
            .equals(this);
    }

    public toAxial() {
        return AxialCoordinates.fromCubic(this);
    }

    public toOffset() {
        return OffsetCoordinates.fromCubic(this);
    }

    public toOrderedTriple() {
        return [this.x, this.y, this.z];
    }

    public addXSubtractY(units: number){
        // Right
        return new CubicCoordinates(
            this.x + units,
            this.y - units,
            this.z
        );
    }

    public addXSubtractZ(units: number)
    {
        // Right + Up
        return new CubicCoordinates(
            this.x + units,
            this.y,
            this.z - units
        );
    }

    public addYSubtractX(units: number)
    {
        // Left
        return new CubicCoordinates(
            this.x - units,
            this.y + units,
            this.z
        );
    }

    public addYSubtractZ(units: number)
    {
        // Left + Up
        return new CubicCoordinates(
            this.x,
            this.y + units,
            this.z - units
        );
    }

    public addZSubtractX(units: number)
    {
        // Left + Down
        return new CubicCoordinates(
            this.x - units,
            this.y,
            this.z + units
        );
    }

    public addZSubtractY(units: number)
    {
        // Right + Down
        return new CubicCoordinates(
            this.x,
            this.y - units,
            this.z + units
        );
    }

}