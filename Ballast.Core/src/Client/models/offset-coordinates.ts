import { IAxialCoordinates, AxialCoordinates } from './axial-coordinates';
import { ICubicCoordinates, CubicCoordinates } from './cubic-coordinates';

export interface IOffsetCoordinates  {
    row: number;
    col: number;
}

export class OffsetCoordinates implements IOffsetCoordinates {

    public readonly col: number;
    public readonly row: number;

    private constructor(state: IOffsetCoordinates) {
        this.col = state.col;
        this.row = state.row;
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

    public toOrderedPair() {
        return [this.col, this.row];
    }

    public toOffsetOctagonal() {
        let sign = (this.col < 0) ? -1 : 1 ;
        let newCol = 1 + ((3/2 * this.col) - sign * ((this.col % 2) / 2));
        let newRow = 1 + this.row;
        return new OffsetCoordinates({ col: newCol, row: newRow });
    }

}