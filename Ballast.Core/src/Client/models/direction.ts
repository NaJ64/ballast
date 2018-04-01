export interface IDirection {
    value: number;
    name: string;
    isCardinal: boolean;
}

export class Direction implements IDirection {

    public static North: Direction = new Direction({ value: 0, name: 'North', isCardinal: true });
    public static South: Direction = new Direction({ value: 1, name: 'South', isCardinal: true  });
    public static West: Direction = new Direction({ value: 2, name: 'West', isCardinal: true  });
    public static East: Direction = new Direction({ value: 3, name: 'East', isCardinal: true  });

    public static NorthWest: Direction = new Direction({ value: 4, name: 'NorthWest', isCardinal: false });
    public static NorthEast: Direction = new Direction({ value: 5, name: 'NorthEast', isCardinal: false  });
    public static SouthWest: Direction = new Direction({ value: 6, name: 'SouthWest', isCardinal: false  });
    public static SouthEast: Direction = new Direction({ value: 7, name: 'SouthEast', isCardinal: false  });

    public value!: number;
    public name!: string;
    public isCardinal!: boolean;

    private constructor(data: IDirection) {
        this.setState(data);
    }

    private setState(data: IDirection): Direction {
        this.value = data.value;
        this.name = data.name;
        return this;
    }

    public static list(): Direction[] {
        return [
            Direction.North,
            Direction.South,
            Direction.West,
            Direction.East,
            Direction.NorthWest,
            Direction.NorthEast,
            Direction.SouthWest,
            Direction.SouthEast
        ];
    }

    public static fromValue(value: number): Direction {
        if (!!value) {
            switch(value) {
                case (Direction.North.value):
                    return Direction.North;
                case (Direction.South.value):
                    return Direction.South;
                case (Direction.West.value):
                    return Direction.West;
                case (Direction.East.value):
                    return Direction.East;
                case (Direction.NorthWest.value):
                    return Direction.NorthWest;
                case (Direction.NorthEast.value):
                    return Direction.NorthEast;
                case (Direction.SouthWest.value):
                    return Direction.SouthWest;
                case (Direction.SouthEast.value):
                    return Direction.SouthEast;
            }
        }
        throw new Error(`Could derive direction from value (${value})`);
    }

    public static fromString(text: string): Direction {
        if (!!text) {
            switch(text.toLocaleLowerCase()) {
                case (Direction.North.name.toLocaleLowerCase()):
                    return Direction.North;
                case (Direction.South.name.toLocaleLowerCase()):
                    return Direction.South;
                case (Direction.West.name.toLocaleLowerCase()):
                    return Direction.West;
                case (Direction.East.name.toLocaleLowerCase()):
                    return Direction.East;
                case (Direction.NorthWest.name.toLocaleLowerCase()):
                    return Direction.NorthWest;
                case (Direction.NorthEast.name.toLocaleLowerCase()):
                    return Direction.NorthEast;
                case (Direction.SouthWest.name.toLocaleLowerCase()):
                    return Direction.SouthWest;
                case (Direction.SouthEast.name.toLocaleLowerCase()):
                    return Direction.SouthEast;
            }
        }
        throw new Error(`Could derive direction from text/name (${text})`);
    }

}
