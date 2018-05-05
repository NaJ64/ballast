import { CubicCoordinates, ICubicCoordinates } from "./cubic-coordinates";

export interface IVessel {
    id: string;
    cubicCoordinates: ICubicCoordinates;
}

export class Vessel implements IVessel {

    public readonly id: string;
    public readonly cubicCoordinates: CubicCoordinates;

    private constructor(state: IVessel) {
        this.id = state.id;
        this.cubicCoordinates = CubicCoordinates.fromObject(state.cubicCoordinates);
    }

    public static fromObject(object: IVessel) {
        return new Vessel(object);
    }

}