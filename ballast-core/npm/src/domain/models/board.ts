import { BoardType } from "./board-type";
import { CubicCoordinates } from "./cubic-coordinates";
import { Tile } from "./tile";
import { TileShape } from "./tile-shape";

export class Board {

    public readonly id: string;
    public readonly boardType: BoardType;
    public readonly tileShape: TileShape;
    public readonly tileMap: Map<string, Tile>;

    private cachedTiles?: Tile[];
    public get tiles(): Tile[] {
        if (!this.cachedTiles) {
            this.cachedTiles = Array.from(this.tileMap.values());
        }
        return this.cachedTiles || [];
    }

    public getTile(orderedTriple: number[]) {
        return this.tileMap.get(orderedTriple.toLocaleString());
    }

    public constructor(id: string, boardType: BoardType, tileShape: TileShape, tiles: Tile[]) {
        this.id = id;
        this.boardType = boardType;
        this.tileShape = tileShape;
        this.tileMap = new Map(this.mapTiles(tiles));
    }

    private *mapTiles(tiles: Tile[]) {
        let tileIterator = tiles;
        for (let tile of tileIterator) {
            let item: [string, Tile] = [ tile.cubicCoordinates.toOrderedTriple().toLocaleString(), tile ];
            yield item;
        }
    }

    public getRandomPassableCoordinates(): CubicCoordinates {
        let passables = this.tiles
            .filter(x => !!x.terrain.passable);
        let index = Math.floor(Math.random() * Math.floor(passables.length)) - 1;
        return passables[index].cubicCoordinates;
    }

    public getTileFromCoordinates(cubicCoordinates: CubicCoordinates) {
        return this.tiles.find(x => x.cubicCoordinates.equals(cubicCoordinates));
    }

}