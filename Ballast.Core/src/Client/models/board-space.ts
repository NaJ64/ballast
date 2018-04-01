import { Terrain, ITerrain} from './terrain';

export interface IBoardSpace { 
    coordinates: { row: number, column: number };
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

export class BoardSpace implements IBoardSpace {

    public coordinates!: { row: number, column: number };
    public terrain!: ITerrain;
    public northAdjacent?: IBoardSpace | null;
    public southAdjacent?: IBoardSpace | null;
    public eastAdjacent?: IBoardSpace | null;
    public westAdjacent?: IBoardSpace | null;
    public northWestAdjacent?: IBoardSpace | null;
    public northEastAdjacent?: IBoardSpace | null;
    public southWestAdjacent?: IBoardSpace | null;
    public southEastAdjacent?: IBoardSpace | null;
    
    public constructor(data: IBoardSpace) {
        this.setState(data);
    }

    private setState(data: IBoardSpace) {
        this.coordinates = data.coordinates;
        this.terrain = Terrain.fromValue(data.terrain.value);
        return this;
    }

    public setAdjacents(boardSpaces: BoardSpace[]) {
        // TODO:  Implement this lookup whereby the current space calculates adjacent spaces using the entire board
    }

}