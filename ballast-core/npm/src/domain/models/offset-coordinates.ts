import { AxialCoordinates } from './axial-coordinates';
import { CubicCoordinates } from './cubic-coordinates';

export class OffsetCoordinates {

    public readonly col: number;
    public readonly row: number;

    private constructor(col: number, row: number) {
        this.col = col;
        this.row = row;        
        if (this.col == -0)
            this.col = 0;
        if (this.row == -0)
            this.row = 0;
    }

    public static fromAxial(object: AxialCoordinates) {
        // Bitwise AND (& 1) to get 0 for even or 1 for odd column offset
        let col = object.x + (object.z - (object.z & 1)) / 2;
        let row = object.z;
        return new OffsetCoordinates(col, row);
    }

    public static fromCubic(object: CubicCoordinates) {
        // Bitwise AND (& 1) to get 0 for even or 1 for odd column offset
        let col = object.x + (object.z - (object.z & 1)) / 2;
        let row = object.z;
        return new OffsetCoordinates(col, row);
    }

    public static fromOrderedPair(orderedPair: number[]) {
        if (orderedPair.length < 2)
            throw new Error('Length of ordered pair must be 2 (or greater)');
            let col = orderedPair[0]; // x
            let row = orderedPair[1]; // z
        return new OffsetCoordinates(col, row);
    }

    public toAxial() {
        return AxialCoordinates.fromOffset(this);
    }

    public toCubic() {
        return CubicCoordinates.fromOffset(this);
    }

    public toOrderedPair() {
        return [this.col, this.row];
    }

}