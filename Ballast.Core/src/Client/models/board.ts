import { ITile, Tile } from './tile';
import { ITileShape, TileShape } from './tile-shape';
import { IBoardType, BoardType } from './board-type';

export interface IBoard {
    boardType: IBoardType;
    gameId: string;
    tiles: ITile[];
    tileShape: ITileShape;
}

export class Board implements IBoard {

    public readonly boardType: BoardType;
    public readonly gameId: string;
    public readonly tileShape: TileShape;
    public readonly tileMap: Map<string, Tile>;

    private cachedTiles?: Tile[];
    public get tiles() {
        if (!this.cachedTiles) {
            this.cachedTiles = Array.from(this.tileMap.values());
        }
        return this.cachedTiles;
    }

    public getTile(orderedTriple: number[]) {
        return this.tileMap.get(orderedTriple.toLocaleString());
    }

    private constructor(state: IBoard) {
        this.boardType = BoardType.fromObject(state.boardType);
        this.gameId = state.gameId;
        this.tileShape = TileShape.fromObject(state.tileShape);
        this.tileMap = new Map(this.mapTiles(state.tiles));
    }

    public static fromObject(object: IBoard) {
        return new Board(object);
    }

    private *mapTiles(tiles: ITile[]) {
        let tileIterator = Tile.fromObjectList(tiles);
        for (let tile of tileIterator) {
            let item: [string, Tile] = [ tile.cubicCoordinates.toOrderedTriple().toLocaleString(), tile ];
            yield item;
        }
    }

}