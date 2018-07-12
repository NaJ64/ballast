export interface ITileShape {
    value: number;
    name: string;
    applyHexRowScaling?: boolean;
    doubleIncrement?: boolean;
    hasDirectionNorth?: boolean;
    hasDirectionSouth?: boolean;
    hasDirectionWest?: boolean;
    hasDirectionEast?: boolean;
    hasDirectionNorthWest?: boolean;
    hasDirectionNorthEast?: boolean;
    hasDirectionSouthWest?: boolean;
    hasDirectionSouthEast?: boolean;
}

export class TileShape implements ITileShape {

    public static Square: TileShape = new TileShape({
        value: 0,
        name: 'Square',
        doubleIncrement: true,
        hasDirectionNorth: true,
        hasDirectionSouth: true,
        hasDirectionWest: true,
        hasDirectionEast: true
    });

    public static Octagon: TileShape = new TileShape({
        value: 1,
        name: 'Octagon',
        doubleIncrement: true,
        hasDirectionNorth: true,
        hasDirectionSouth: true,
        hasDirectionWest: true,
        hasDirectionEast: true,
        hasDirectionNorthWest: true,
        hasDirectionNorthEast: true,
        hasDirectionSouthWest: true,
        hasDirectionSouthEast: true
    });

    public static Hexagon: TileShape = new TileShape({
        value: 2,
        name: 'Hexagon',
        applyHexRowScaling: true,
        hasDirectionWest: true,
        hasDirectionEast: true,
        hasDirectionNorthWest: true,
        hasDirectionNorthEast: true,
        hasDirectionSouthWest: true,
        hasDirectionSouthEast: true
    });

    public static Circle: TileShape = new TileShape({
        value: 3,
        name: 'Circle',
        applyHexRowScaling: true,
        hasDirectionWest: true,
        hasDirectionEast: true,
        hasDirectionNorthWest: true,
        hasDirectionNorthEast: true,
        hasDirectionSouthWest: true,
        hasDirectionSouthEast: true
    });

    public readonly value: number;
    public readonly name: string;
    public readonly applyHexRowScaling: boolean;
    public readonly doubleIncrement: boolean;
    public readonly hasDirectionNorth: boolean;
    public readonly hasDirectionSouth: boolean;
    public readonly hasDirectionWest: boolean;
    public readonly hasDirectionEast: boolean;
    public readonly hasDirectionNorthWest: boolean;
    public readonly hasDirectionNorthEast: boolean;
    public readonly hasDirectionSouthWest: boolean;
    public readonly hasDirectionSouthEast: boolean;

    private constructor(state: ITileShape) {
        this.value = state.value;
        this.name = state.name;
        this.applyHexRowScaling = !!state.applyHexRowScaling;
        this.doubleIncrement = !!state.doubleIncrement;
        this.hasDirectionNorth = !!state.hasDirectionNorth;
        this.hasDirectionSouth = !!state.hasDirectionSouth;
        this.hasDirectionWest = !!state.hasDirectionWest;
        this.hasDirectionEast = !!state.hasDirectionEast;
        this.hasDirectionNorthWest = !!state.hasDirectionNorthWest;
        this.hasDirectionNorthEast = !!state.hasDirectionNorthEast;
        this.hasDirectionSouthWest = !!state.hasDirectionSouthWest;
        this.hasDirectionSouthEast = !!state.hasDirectionSouthEast;
    }

    public static list(): TileShape[] {
        return [
            TileShape.Square,
            TileShape.Octagon,
            TileShape.Hexagon,
            TileShape.Circle
        ];
    }

    public equals(tileShape: TileShape) {
        if (!tileShape) {
            return false;
        }
        return this.value == tileShape.value;
    }

    public static fromObject(object: ITileShape): TileShape {
        let item = !!object && TileShape.fromValue(object.value);
        if (!item) {
            throw new Error(`Could derive tile shape from object (${object})`);
        }
        return item;
    }

    public static fromValue(value: number): TileShape {
        let item = (value > -1) && TileShape.list().find(x => x.value == value);
        if (!item) {
            throw new Error(`Could derive tile shape from value (${value})`);
        }
        return item;
    }

    public static fromString(text: string): TileShape {
        let item = !!text && TileShape.list().find(x => x.name.toLocaleLowerCase() == text.toLocaleLowerCase());
        if (!item) {
            throw new Error(`Could derive tile shape from text (${text})`);
        }
        return item;
    }

    public get possibleDirections() {
        let directions = 0;
        if (this.hasDirectionNorth)
            directions += 1;
        if (this.hasDirectionSouth)
            directions += 1;
        if (this.hasDirectionWest)
            directions += 1;
        if (this.hasDirectionEast)
            directions += 1;
        if (this.hasDirectionNorthWest)
            directions += 1;
        if (this.hasDirectionNorthEast)
            directions += 1;
        if (this.hasDirectionSouthWest)
            directions += 1;
        if (this.hasDirectionSouthEast)
            directions += 1;
        return directions;
    }

}