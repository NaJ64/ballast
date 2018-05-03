import { Board, IBoard } from './board';
import { IVessel, Vessel } from './vessel';

export interface IGame {
    id: string;
    board: IBoard;
    vessels: IVessel[];
}

export class Game implements IGame {

    public readonly id: string;
    public readonly board: Board;
    public readonly vessels: Vessel[];

    private constructor(state: IGame) {
        this.id = state.id;
        this.board = Board.fromObject(state.board);
        this.vessels = state.vessels.map(x => Vessel.fromObject(x));
    }

    public static fromObject(object: IGame) {
        return new Game(object);
    }

}
