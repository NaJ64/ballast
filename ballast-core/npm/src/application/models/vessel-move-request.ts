import { IDirection } from "./direction";

export interface IVesselMoveRequest {
    gameId: string;
    vesselId: string;
    startedIsoString: string;
    sourceOrderedTriple: number[];
    targetOrderedTriple: number[];
    direction: IDirection | null;
}