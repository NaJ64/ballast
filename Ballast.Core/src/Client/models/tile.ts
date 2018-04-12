import { ICubicCoordinates, CubicCoordinates } from './cubic-coordinates';
import { ITileShape, TileShape } from './tile-shape';

export interface ITile {
    cubicCoordinates: ICubicCoordinates;
    tileShape: ITileShape;
    hidden?: boolean;
}

export class Tile implements ITile {

    public readonly cubicCoordinates: CubicCoordinates;
    public readonly tileShape: TileShape;
    public readonly hidden: boolean;
    
    private constructor(state: ITile) {
        this.cubicCoordinates = CubicCoordinates.fromObject(state.cubicCoordinates);
        this.tileShape = TileShape.fromObject(state.tileShape);
        this.hidden = !!state.hidden;
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