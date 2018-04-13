
export interface IBoardType { 
    value: number;
    name: string;
    centerOrigin: boolean;
}

export class BoardType implements IBoardType {

    public static Rectangle: BoardType = new BoardType({ value: 0, name: 'Rectangle', centerOrigin: false });
    public static RegularPolygon: BoardType = new BoardType({ value: 1, name: 'RegularPolygon', centerOrigin: true });
    
    public readonly value: number;
    public readonly name: string;
    public readonly centerOrigin: boolean;

    private constructor(state: IBoardType) {
        this.value = state.value;
        this.name = state.name;
        this.centerOrigin = state.centerOrigin;
    }

    public static list(): BoardType[] {
        return [
            BoardType.Rectangle,
            BoardType.RegularPolygon
        ];
    }

    public equals(BoardType: BoardType) {
        if (!BoardType) {
            return false;
        }
        return this.value == BoardType.value;
    }

    public static fromObject(object: IBoardType): BoardType {           
        let item = !!object && BoardType.fromValue(object.value);
        if (!item) {
            throw new Error(`Could derive board type from object (${object})`);
        }
        return item;
    }

    public static fromValue(value: number): BoardType {           
        let item = (value > -1) && BoardType.list().find(x => x.value == value);
        if (!item) {
            throw new Error(`Could derive board type from value (${value})`);
        }
        return item;
    }

    public static fromString(text: string): BoardType {           
        let item = !!text && BoardType.list().find(x => x.name.toLocaleLowerCase() == text.toLocaleLowerCase());
        if (!item) {
            throw new Error(`Could derive board type from text (${text})`);
        }
        return item;
    }

}