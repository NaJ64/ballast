import { BoardType, IBoardType } from './board-type';
import { CubicCoordinates, ICubicCoordinates } from './cubic-coordinates';
import { ITile, Tile } from './tile';
import { ITileShape, TileShape } from './tile-shape';

export interface IBoard {
    boardType: IBoardType;
    id: string;
    tiles: ITile[];
    tileShape: ITileShape;
}

export class Board implements IBoard {

    public readonly boardType: BoardType;
    public readonly id: string;
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
        this.id = state.id;
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

    public getRandomPassableCoordinates(): ICubicCoordinates {
        let passables = this.tiles
            .filter(x => !!x.terrain.passable);
        let index = Math.floor(Math.random() * Math.floor(passables.length)) - 1;
        return passables[index].cubicCoordinates;
    }

    public getTileFromCoordinates(cubicCoordinates: ICubicCoordinates) {
        return this.tiles.find(x => x.cubicCoordinates.equals(cubicCoordinates));
    }

}