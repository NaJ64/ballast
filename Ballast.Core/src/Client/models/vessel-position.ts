import { IBoardSpace, BoardSpace } from './board-space';
import { IVessel, Vessel } from './vessel';
import { IStrike, Strike } from './strike';

export interface IVesselPosition { 

    // space: IBoardSpace;
    // vessel: IVessel;
    arrivalUtc: Date;
    // arrivalDirection: IDirection;
    // exitUtc?: Date | null;
    // exitDirection?: IDirection | null;
    // previous?: IVesselPosition | null;
    // next?: IVesselPosition | null;
    // isSpawn: boolean;
    // incurredStrikes: IStrike[];
    
}

export class VesselPosition implements IVesselPosition {

    public arrivalUtc!: Date;

    public hydrate(data: IVesselPosition) {
        this.arrivalUtc = data.arrivalUtc;
        return this;
    }

    public setAdjacents(positions: VesselPosition[]) {
        // TODO:  Implement this lookup by calculating adjacent positions using current index within the sequence 
    }

}