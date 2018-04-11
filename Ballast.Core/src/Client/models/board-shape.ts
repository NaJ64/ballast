export interface IBoardShape { 
    value: number;
    name: string;
}

export class BoardShape implements IBoardShape {

    public static Rectangle: BoardShape = new BoardShape({ value: 0, name: 'Rectangle' });
    public static RegularPolygon: BoardShape = new BoardShape({ value: 1, name: 'RegularPolygon' });
    
    public readonly value: number;
    public readonly name: string;

    private constructor(state: IBoardShape) {
        this.value = state.value;
        this.name = state.name;
    }

    public static list(): BoardShape[] {
        return [
            BoardShape.Rectangle,
            BoardShape.RegularPolygon
        ];
    }

    public static fromObject(object: IBoardShape): BoardShape {           
        let item = !!object && BoardShape.fromValue(object.value);
        if (!item) {
            throw new Error(`Could derive board type from object (${object})`);
        }
        return item;
    }

    public static fromValue(value: number): BoardShape {           
        let item = !!value && BoardShape.list().find(x => x.value == value);
        if (!item) {
            throw new Error(`Could derive board type from value (${value})`);
        }
        return item;
    }

    public static fromString(text: string): BoardShape {           
        let item = !!text && BoardShape.list().find(x => x.name.toLocaleLowerCase() == text.toLocaleLowerCase());
        if (!item) {
            throw new Error(`Could derive board type from text (${text})`);
        }
        return item;
    }

}