export interface IBoardType {
    value: number;
    name: string;
}

export class BoardType implements IBoardType {

    public static Square: BoardType = new BoardType({ value: 0, name: 'Square' });
    public static Octagon: BoardType = new BoardType({ value: 1, name: 'Octagon' });
    
    public value!: number;
    public name!: string;

    private constructor(state: IBoardType) {
        this.setState(state);
    }

    private setState(state: IBoardType): BoardType {
        this.value = state.value;
        this.name = state.name;
        return this;
    }

    public static list(): BoardType[] {
        return [
            BoardType.Square,
            BoardType.Octagon
        ];
    }

    public static fromValue(value: number): BoardType {
        if (!!value) {
            switch(value) {
                case (BoardType.Square.value):
                    return BoardType.Square;
                case (BoardType.Octagon.value):
                    return BoardType.Octagon;
            }
        }
        throw new Error(`Could derive board type from value (${value})`);
    }

    public static fromString(text: string): BoardType {
        if (!!text) {
            switch(text.toLocaleLowerCase()) {
                case (BoardType.Square.name.toLocaleLowerCase()):
                    return BoardType.Square;
                case (BoardType.Octagon.name.toLocaleLowerCase()):
                    return BoardType.Octagon;
            }
        }
        throw new Error(`Could derive board type from text/name (${text})`);
    }

}
