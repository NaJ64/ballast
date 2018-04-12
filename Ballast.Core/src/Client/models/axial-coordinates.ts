import { ICubicCoordinates, CubicCoordinates } from './cubic-coordinates';
import { IOffsetCoordinates, OffsetCoordinates } from './offset-coordinates';

export interface IAxialCoordinates { 
    q: number;
    r: number;
}

export class AxialCoordinates implements IAxialCoordinates {

    public readonly q: number;
    public readonly r: number;

    private constructor(state: IAxialCoordinates) {
        this.q = state.q;
        this.r = state.r;
    }

    public static fromObject(object: IAxialCoordinates) {
        return new AxialCoordinates(object);
    }

    public static fromCubic(object: ICubicCoordinates) {
        return AxialCoordinates.fromObject(object);
    }

    public static fromOffset(object: IOffsetCoordinates) {
        return AxialCoordinates.fromCubic(
            CubicCoordinates.fromOffset(object)
        );
    }

    public equals(object: IAxialCoordinates) {
        if (!object) {
            return false;
        }
        return (
            this.q == object.q &&
            this.r == object.r
        );
    }

    public equalsCubic(object: ICubicCoordinates) {
        return AxialCoordinates
            .fromCubic(object)
            .equals(this);
    }

    public toOrderedPair() {
        return [this.q, this.r];
    }

}