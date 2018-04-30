import { IAxialCoordinates, AxialCoordinates } from './axial-coordinates';
import { ICubicCoordinates, CubicCoordinates } from './cubic-coordinates';

export interface IOffsetCoordinates  {
    col: number;
    row: number;
}

export class OffsetCoordinates implements IOffsetCoordinates {

    public readonly col: number;
    public readonly row: number;

    private constructor(state: IOffsetCoordinates) {
        this.col = state.col;
        this.row = state.row;        
        if (this.col == -0)
            this.col = 0;
        if (this.row == -0)
            this.row = 0;
    }

    public static fromObject(object: IOffsetCoordinates) {
        return new OffsetCoordinates(object);
    }

    public static fromAxial(object: IAxialCoordinates) {
        // Bitwise AND (& 1) to get 0 for even or 1 for odd column offset
        let col = object.x + (object.z - (object.z & 1)) / 2;
        let row = object.z;
        return new OffsetCoordinates({col: col, row: row});
    }

    public static fromCubic(object: ICubicCoordinates) {
        return OffsetCoordinates.fromAxial(object);
    }

    public static fromOrderedPair(orderedPair: number[]) {
        if (orderedPair.length < 2)
            throw new Error('Length of ordered pair must be 2 (or greater)');
            let col = orderedPair[0]; // x
            let row = orderedPair[1]; // z
        return OffsetCoordinates.fromObject({ col: col, row: row });
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