import { ITerrain } from './terrain';
export interface IBoardSpace {
    coordinates: {
        row: number;
        column: number;
    };
    terrain: ITerrain;
    northAdjacent?: IBoardSpace | null;
    southAdjacent?: IBoardSpace | null;
    eastAdjacent?: IBoardSpace | null;
    westAdjacent?: IBoardSpace | null;
    northWestAdjacent?: IBoardSpace | null;
    northEastAdjacent?: IBoardSpace | null;
    southWestAdjacent?: IBoardSpace | null;
    southEastAdjacent?: IBoardSpace | null;
}
export declare class BoardSpace implements IBoardSpace {
    coordinates: {
        row: number;
        column: number;
    };
    terrain: ITerrain;
    northAdjacent?: IBoardSpace | null;
    southAdjacent?: IBoardSpace | null;
    eastAdjacent?: IBoardSpace | null;
    westAdjacent?: IBoardSpace | null;
    northWestAdjacent?: IBoardSpace | null;
    northEastAdjacent?: IBoardSpace | null;
    southWestAdjacent?: IBoardSpace | null;
    southEastAdjacent?: IBoardSpace | null;
    constructor(data: IBoardSpace);
    private setState(data);
    setAdjacents(boardSpaces: BoardSpace[]): void;
}
