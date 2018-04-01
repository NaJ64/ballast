import { IBoardSpace, BoardSpace } from './board-space';
import { IBoardType, BoardType } from './board-type';
import { IVessel, Vessel } from './vessel';
export interface IBoard {
    type: IBoardType;
    spaces: IBoardSpace[];
    rows: IBoardSpace[][];
    columns: IBoardSpace[][];
    vessels: IVessel[];
}
export declare class Board implements IBoard {
    type: BoardType;
    spaces: BoardSpace[];
    rows: BoardSpace[][];
    columns: BoardSpace[][];
    vessels: Vessel[];
    constructor(state: IBoard);
    private setState(state);
    private groupRows(spaces);
    private groupColumns(spaces);
}
