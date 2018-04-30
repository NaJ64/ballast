import { ICubicCoordinates, CubicCoordinates } from './cubic-coordinates';
import { ITileShape, TileShape } from './tile-shape';
import { ITerrain, Terrain } from './terrain';

export interface ITile {
    cubicCoordinates: ICubicCoordinates;
    tileShapeValue: number;
    terrainValue: number;
    inactive?: boolean;
}

export class Tile implements ITile {

    public readonly cubicCoordinates: CubicCoordinates;
    public readonly tileShape: TileShape;
    public readonly tileShapeValue: number;
    public readonly terrain: Terrain;
    public readonly terrainValue: number;
    public readonly inactive: boolean;
    
    private constructor(state: ITile) {
        this.cubicCoordinates = CubicCoordinates.fromObject(state.cubicCoordinates);
        this.tileShapeValue = state.tileShapeValue;
        this.tileShape = TileShape.fromValue(this.tileShapeValue);
        this.terrainValue = state.terrainValue;
        this.terrain = Terrain.fromValue(this.terrainValue);
        this.inactive = !!state.inactive;
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