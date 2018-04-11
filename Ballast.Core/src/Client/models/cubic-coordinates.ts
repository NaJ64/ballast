import { IAxialCoordinates, AxialCoordinates } from './axial-coordinates';
import { IOffsetCoordinates, OffsetCoordinates } from './offset-coordinates';

export interface ICubicCoordinates extends IAxialCoordinates {
    s: number;
}

export class CubicCoordinates implements ICubicCoordinates {

    public readonly q: number;
    public readonly r: number;
    public readonly s: number;

    private constructor(state: ICubicCoordinates) {
        if ((state.q + state.s + state.r) != 0) {
            throw new Error("Provided object coordinate(s) do not match constraint 'q + r + s = 0'");
        }
        this.q = state.q;
        this.r = state.r;
        this.s = state.s;
    }

    public static fromObject(object: ICubicCoordinates) {
        return new CubicCoordinates(object);
    }

    public static fromAxial(object: IAxialCoordinates) {
        let s = -1 * (object.q + object.r);
        return new CubicCoordinates({ q: object.q, r: object.r, s: s });
    }

    public static fromOffset(object: IOffsetCoordinates) {
        var q = object.col - (object.row - (object.row & 1)) / 2;
        var r = object.row;
        var s = -1 * (q + r);
        return new CubicCoordinates({q: q, r: r, s: s });
    }

    public equals(object: ICubicCoordinates) {
        if (!object) {
            return false;
        }
        return (
            this.q == object.q &&
            this.r == object.r &&
            this.s == object.s
        );
    }

    public equalsAxial(object: IAxialCoordinates) {
        return CubicCoordinates
            .fromAxial(object)
            .equals(this);
    }

    public equalsOffset(object: IOffsetCoordinates) {
        return CubicCoordinates
            .fromOffset(object)
            .equals(this);
    }

    public toOrderedTriple() {
        return [this.q, this.r, this.s];
    }

}