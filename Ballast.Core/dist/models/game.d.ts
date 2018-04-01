import { IBoard, Board } from './board';
import { IPlayer, Player } from './player';
import { ITeam, Team } from './team';
import { IMove, Move } from './move';
export interface IGame {
    startUtc: Date | null;
    endUtc: Date | null;
    board: IBoard | null;
    players: IPlayer[];
    teams: ITeam[];
    moves: IMove[];
}
export declare class Game implements IGame {
    startUtc: Date | null;
    endUtc: Date | null;
    board: Board | null;
    players: Player[];
    teams: Team[];
    moves: Move[];
    constructor(state: IGame);
    private setState(state);
}
