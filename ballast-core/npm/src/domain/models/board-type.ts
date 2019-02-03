export class BoardType {

    public static Rectangle: BoardType = new BoardType(0, "Rectangle", false);
    public static RegularPolygon: BoardType = new BoardType(1, "RegularPolygon", true );
    
    public readonly value: number;
    public readonly name: string;
    public readonly centerOrigin: boolean;

    private constructor(value: number, name: string, centerOrigin: boolean) {
        this.value = value;
        this.name = name;
        this.centerOrigin = centerOrigin;
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

    public static fromValue(value: number): BoardType {        
        let item = (value > -1) && BoardType.list().find(x => x.value == value);
        if (!item) {
            throw new Error(`Could derive board type from value (${value})`);
        }
        return item;
    }

    public static fromName(text: string): BoardType {           
        let item = !!text && BoardType.list().find(x => x.name.toLocaleLowerCase() == text.toLocaleLowerCase());
        if (!item) {
            throw new Error(`Could derive board type from text (${text})`);
        }
        return item;
    }

}