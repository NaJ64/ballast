export interface IBoardType {
    value: number;
    name: string;
}
export declare class BoardType implements IBoardType {
    static Square: BoardType;
    static Octagon: BoardType;
    value: number;
    name: string;
    private constructor();
    private setState(state);
    static list(): BoardType[];
    static fromValue(value: number): BoardType;
    static fromString(text: string): BoardType;
}
