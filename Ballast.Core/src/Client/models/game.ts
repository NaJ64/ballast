import { IBoard, Board } from './board';

export interface IGame {
    id: string;
    board: IBoard;
}

export class Game implements IGame {

    public readonly id: string;
    public readonly board: Board;

    private constructor(state: IGame) {
        this.id = state.id;
        this.board = Board.fromObject(state.board);
    }

    public static fromObject(object: IGame) {
        return new Game(object);
    }


}
