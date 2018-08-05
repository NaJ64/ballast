import { CubicCoordinates, ICubicCoordinates } from './cubic-coordinates';
import { ITerrain, Terrain } from './terrain';
import { ITileShape, TileShape } from './tile-shape';

export interface ITile {
    cubicCoordinates: ICubicCoordinates;
    tileShape: ITileShape;
    terrain: ITerrain;
}

export class Tile implements ITile {

    public readonly cubicCoordinates: CubicCoordinates;
    public readonly tileShape: TileShape;
    private _terrain: Terrain;

    public get terrain(): Terrain {
        return this._terrain;
    }

    public set terrain(value: Terrain) { 
        this.setTerrain(value);
    }
    
    private constructor(state: ITile) {
        this.cubicCoordinates = CubicCoordinates.fromObject(state.cubicCoordinates);
        this.tileShape = TileShape.fromObject(state.tileShape);
        this._terrain = Terrain.fromObject(state.terrain);
    }

    public setTerrain(terrain: Terrain) {
        this._terrain = terrain || this.terrain;
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