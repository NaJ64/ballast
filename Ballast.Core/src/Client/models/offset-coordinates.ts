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
        let col = object.q + (object.r - (object.r & 1)) / 2;
        let row = object.r;
        return new OffsetCoordinates({col: col, row: row});
    }

    public static fromCubic(object: ICubicCoordinates) {
        return OffsetCoordinates.fromAxial(object);
    }

    public toOrderedPair() {
        return [this.col, this.row];
    }

}