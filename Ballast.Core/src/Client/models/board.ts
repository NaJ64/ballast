import { ITile, Tile } from './tile';
import { ITileShape, TileShape } from './tile-shape';
import { IBoardType, BoardType } from './board-type';

export interface IBoardState {
    boardType: IBoardType;
    gameId: string;
    tiles: ITile[];
    tileShape: ITileShape;
}

export class Board implements IBoardState {

    public readonly boardType: BoardType;
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
        this.boardType = BoardType.fromObject(state.boardType);
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

    public create(tileShape: ITileShape, boardType: IBoardType, sizeWidth: number, sizeHeight?: number) {
        let useTileShape = TileShape.fromObject(tileShape);
        let useBoardType = BoardType.fromObject(boardType);   
        let width = sizeWidth;
        let height = sizeHeight || sizeWidth;  
        if (useBoardType.equals(BoardType.RegularPolygon) && sizeWidth != sizeHeight) {
            throw new Error('Regular polygon board(s) cannot specify different width/height values');
        }
        // TODO:  Create tiles collection here
    }


}