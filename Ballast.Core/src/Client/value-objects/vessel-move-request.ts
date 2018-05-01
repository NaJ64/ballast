export interface IVesselMoveRequest {
    gameId: string;
    boardId: string;
    vesselId: string;
    timestampText: string;
    sourceOrderedTriple: number[];
    targetOrderedTriple: number[];
}