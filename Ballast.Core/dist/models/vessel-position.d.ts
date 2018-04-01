import { IBoardSpace, BoardSpace } from './board-space';
import { IDirection, Direction } from './direction';
import { IVessel, Vessel } from './vessel';
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
export declare class VesselPosition implements IVesselPosition {
    space: BoardSpace;
    vessel: Vessel;
    arrivalUtc: Date;
    arrivalDirection: Direction;
    exitUtc: Date | null;
    exitDirection: Direction | null;
    previous?: IVesselPosition | null;
    next?: IVesselPosition | null;
    constructor(state: IVesselPosition, vessel: Vessel, allSpaces: BoardSpace[]);
    setState(state: IVesselPosition, vessel: Vessel, allSpaces: BoardSpace[]): VesselPosition;
    setNextAndPrevious(positions: VesselPosition[]): void;
}
