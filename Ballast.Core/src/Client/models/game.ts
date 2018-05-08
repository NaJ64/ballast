import { Board, IBoard } from './board';
import { IPlayer, Player } from './player';
import { IVessel, Vessel } from './vessel';

export interface IGame {
    id: string;
    board: IBoard;
    vessels: IVessel[];
    players: IPlayer[];
}

export class Game implements IGame {

    public readonly id: string;
    public readonly board: Board;
    public readonly vessels: Vessel[];
    public readonly players: Player[];

    private constructor(state: IGame) {
        this.id = state.id;
        this.board = Board.fromObject(state.board);
        this.vessels = state.vessels.map(x => Vessel.fromObject(x));
        this.players = state.players.map(x => Player.fromObject(x));
    }

    public static fromObject(object: IGame) {
        return new Game(object);
    }

}
