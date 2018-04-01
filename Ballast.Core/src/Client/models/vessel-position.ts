import { IBoardSpace, BoardSpace } from './board-space';
import { IDirection, Direction } from './direction';
import { IVessel, Vessel } from './vessel';
import { IStrike, Strike } from './strike';

export interface IVesselPosition { 
    space: IBoardSpace;
    vessel: IVessel;
    arrivalUtc: Date;
    arrivalDirection: IDirection;
    exitUtc: Date | null;
    exitDirection: IDirection | null;
    previous?: IVesselPosition | null;
    next?: IVesselPosition | null;
}

export class VesselPosition implements IVesselPosition {

    public space!: BoardSpace;
    public vessel!: Vessel;
    public arrivalUtc!: Date;
    public arrivalDirection!: Direction;
    public exitUtc!: Date | null;
    public exitDirection!: Direction | null;    
    public previous?: IVesselPosition | null;
    public next?: IVesselPosition | null;

    public constructor(state: IVesselPosition, vessel: Vessel, allSpaces: BoardSpace[]) {
        this.setState(state, vessel, allSpaces);
    }

    public setState(state: IVesselPosition, vessel: Vessel, allSpaces: BoardSpace[]): VesselPosition {
        // Set dates
        this.arrivalUtc = state.arrivalUtc || null;
        this.exitUtc = null;
        if (state.exitUtc) {
            this.exitUtc = state.exitUtc;
        }
        // Set vessel reference prop(s)
        this.vessel = vessel;
        // Set directions using constants
        this.arrivalDirection = Direction.fromValue(state.arrivalDirection.value);
        this.exitDirection = (state.exitDirection && Direction.fromValue(state.arrivalDirection.value)) || null;
        // Set board space reference prop
        let space: BoardSpace | null = null;
        if (state.space) {
            let row = state.space.coordinates.row;
            let column = state.space.coordinates.column;
            space = allSpaces.find(x => row == x.coordinates.row && column == x.coordinates.column) || null;
        }
        if (!space) {
            throw new Error('Could not set vessel position due to invalid/unknown board coordinates');
        }
        this.space = space;
        return this;
    }

    public setNextAndPrevious(positions: VesselPosition[]) {
        let foundIndex = positions.findIndex(x => x == this);
        if (foundIndex < 0) {
            return; // The current position is not in the collection
        }
        if (foundIndex > 0) {
            this.previous = positions[foundIndex - 1];
        } else {
            this.previous = null; // is current position
        }
        if (foundIndex < (positions.length - 1)) {
            this.next = positions[foundIndex + 1];
        } else {
            this.next = null; // is last position
        }
    }

}