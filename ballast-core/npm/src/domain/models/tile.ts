import { CubicCoordinates } from './cubic-coordinates';
import { Terrain } from './terrain';
import { TileShape } from './tile-shape';

export class Tile {

    public readonly cubicCoordinates: CubicCoordinates;
    public readonly tileShape: TileShape;
    private _terrain: Terrain;

    public get terrain(): Terrain {
        return this._terrain;
    }

    public set terrain(value: Terrain) { 
        this.setTerrain(value);
    }
    
    public constructor(cubicCoordinates: CubicCoordinates, tileShape: TileShape, terrain: Terrain) {
        this.cubicCoordinates = cubicCoordinates;
        this.tileShape = tileShape;
        this._terrain = terrain;
    }

    public setTerrain(terrain: Terrain) {
        this._terrain = terrain || this.terrain;
    }

}