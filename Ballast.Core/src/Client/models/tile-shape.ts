export interface ITileShape { 
    value: number;
    name: string;
}

export class TileShape implements ITileShape {

    public static Square: TileShape = new TileShape({ value: 0, name: 'Square' });
    public static Octagonal: TileShape = new TileShape({ value: 1, name: 'Octagonal' });
    public static Hexagonal: TileShape = new TileShape({ value: 2, name: 'Hexagonal' });
    
    public readonly value: number;
    public readonly name: string;

    private constructor(state: ITileShape) {
        this.value = state.value;
        this.name = state.name;
    }

    public static list(): TileShape[] {
        return [
            TileShape.Square,
            TileShape.Octagonal,
            TileShape.Hexagonal
        ];
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