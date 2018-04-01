import { IBoard, Board } from './board';
import { IPlayer, Player} from './player';
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

export class Game implements IGame {

    public startUtc!: Date | null;
    public endUtc!: Date | null;
    public board!: Board | null;
    public players!: Player[];
    public teams!: Team[];
    public moves!: Move[];
    
    public constructor(state: IGame) {
        this.setState(state);
    }

    private setState(state: IGame): Game {
        this.startUtc = state.startUtc || null;
        this.endUtc = state.endUtc || null;
        if (!state.board) {
            throw new Error('Cannot build the current game model without board data');
        }
        this.board = new Board(state.board);
        this.players = [];
        for(let playerData of state.players) {
            this.players.push(new Player(playerData));
        }
        this.teams = [];
        for(let teamData of state.teams) {
            this.teams.push(new Team(teamData, this.players, this.board.spaces));
        }
        this.moves = [];
        for (let moveData of state.moves) {
            this.moves.push(new Move(moveData, this.teams));
        }
        return this;
    }

}