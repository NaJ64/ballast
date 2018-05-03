import { ICubicCoordinates, CubicCoordinates } from './cubic-coordinates';
import { ITileShape, TileShape } from './tile-shape';
import { ITerrain, Terrain } from './terrain';

export interface ITile {
    cubicCoordinates: ICubicCoordinates;
    tileShape: ITileShape;
    terrain: ITerrain;
}

export class Tile implements ITile {

    public readonly cubicCoordinates: CubicCoordinates;
    public readonly tileShape: TileShape;
    public readonly terrain: Terrain;
    
    private constructor(state: ITile) {
        this.cubicCoordinates = CubicCoordinates.fromObject(state.cubicCoordinates);
        this.tileShape = TileShape.fromObject(state.tileShape);
        this.terrain = Terrain.fromObject(state.terrain);
    }

    public static fromObject(object: ITile): Tile {
        return new Tile(object);
    }

    public static *fromObjectList(objects: ITile[]) : IterableIterator<Tile> {
        if (!objects || objects.length < 1) {
            return [];
        }
        for(let object of objects) {
            yield Tile.fromObject(object);
        }
    }

}