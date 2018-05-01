import { ICubicCoordinates, CubicCoordinates } from "./cubic-coordinates";

export interface IVessel {
    id: string;
    cubicOrderedTriple: number[];
}

export class Vessel implements IVessel {

    public readonly id: string;
    public readonly cubicOrderedTriple: number[];
    public readonly cubicCoordinates: CubicCoordinates;

    private constructor(state: IVessel) {
        this.id = state.id;
        this.cubicOrderedTriple = state.cubicOrderedTriple;
        this.cubicCoordinates = CubicCoordinates.fromOrderedTriple(state.cubicOrderedTriple);
    }

    public static fromObject(object: IVessel) {
        return new Vessel(object);
    }

}