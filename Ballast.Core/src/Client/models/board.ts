import { ITile, Tile } from './tile';
import { ITileShape, TileShape } from './tile-shape';
import { IBoardShape, BoardShape } from './board-shape';

export interface IBoardState {
    boardShape: IBoardShape;
    gameId: string;
    tiles: ITile[];
    tileShape: ITileShape;
}

export class Board implements IBoardState {

    public readonly boardShape: BoardShape;
    public readonly gameId: string;
    public readonly tileShape: TileShape;
    public readonly tileMap: Map<number[], Tile>;

    private cachedTiles?: Tile[];
    public get tiles() {
        if (!this.cachedTiles) {
            this.cachedTiles = Array.from(this.tileMap.values());
        }
        return this.cachedTiles;
    }

    private constructor(state: IBoardState) {
        this.boardShape = BoardShape.fromObject(state.boardShape);
        this.gameId = state.gameId;
        this.tileShape = TileShape.fromObject(state.tileShape);
        this.tileMap = new Map(this.mapTiles(state.tiles));
    }

    private *mapTiles(tiles: ITile[]) {
        let tileIterator = Tile.fromObjectList(tiles);
        for (let tile of tileIterator) {
            let item: [number[], Tile] = [ tile.cubicCoordinates.toOrderedTriple(), tile ];
            yield item;
        }
    }

    public create(tileShape: ITileShape, boardShape: IBoardShape, sizeWidth: number, sizeHeight?: number) {
        let useTileShape = TileShape.fromObject(tileShape);
        let useBoardShape = BoardShape.fromObject(boardShape);   
        let width = sizeWidth;
        let height = sizeHeight || sizeWidth;  
        if (useBoardShape.equals(BoardShape.RegularPolygon) && sizeWidth != sizeHeight) {
            throw new Error('Regular polygon board(s) cannot specify different width/height values');
        }
        // TODO:  Create tiles collection here
    }


}