import { ModelBase } from './model-base';
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

export class BoardSpace extends ModelBase<BoardSpace, IBoardSpace> implements IBoardSpace {

    public coordinates!: { row: number, column: number };
    public terrain!: ITerrain;
    
    public constructor(data?: IBoardSpace) {
        super(data);
    }

    public hydrate(data: IBoardSpace) {
        this.coordinates = data.coordinates;
        this.terrain = Terrain.fromValue(data.terrain.value);
        return this;
    }

    public setAdjacents(boardSpaces: BoardSpace[]) {
        // TODO:  Implement this lookup whereby the current space calculates adjacent spaces using the entire board
    }

}