import { IDirection } from "./direction";

export interface IVesselMoveRequest {
    gameId: string;
    vesselId: string;
    sentOnDateIsoString: string;
    sourceOrderedTriple: number[];
    targetOrderedTriple: number[];
    direction: IDirection | null;
}