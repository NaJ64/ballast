export interface IDirection {
    value: number;
    name: string;
    isCardinal: boolean;
}
export declare class Direction implements IDirection {
    static North: Direction;
    static South: Direction;
    static West: Direction;
    static East: Direction;
    static NorthWest: Direction;
    static NorthEast: Direction;
    static SouthWest: Direction;
    static SouthEast: Direction;
    value: number;
    name: string;
    isCardinal: boolean;
    private constructor();
    private setState(data);
    static list(): Direction[];
    static fromValue(value: number): Direction;
    static fromString(text: string): Direction;
}
