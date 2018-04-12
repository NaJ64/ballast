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

    public static Octagonal: TileShape = new TileShape({ 
        value: 1, 
        name: 'Octagonal',
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

    public static Hexagonal: TileShape = new TileShape({ 
        value: 2, 
        name: 'Hexagonal',
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
            TileShape.Octagonal,
            TileShape.Hexagonal
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
            throw new Error(`Could derive board type from object (${object})`);
        }
        return item;
    }

    public static fromValue(value: number): TileShape {           
        let item = !!value && TileShape.list().find(x => x.value == value);
        if (!item) {
            throw new Error(`Could derive board type from value (${value})`);
        }
        return item;
    }

    public static fromString(text: string): TileShape {           
        let item = !!text && TileShape.list().find(x => x.name.toLocaleLowerCase() == text.toLocaleLowerCase());
        if (!item) {
            throw new Error(`Could derive board type from text (${text})`);
        }
        return item;
    }

}