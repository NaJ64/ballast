import { IBoard, Board } from './board';
import { IPlayer, Player} from './player';
import { ITeam, Team } from './team';

export interface IGame { 
    startUtc?: Date;
    endUtc?: Date;
    totalMoves: number;
    board?: IBoard | null;
    players: IPlayer[];
    teams: ITeam[];
}

export class Game implements IGame {

    public startUtc?: Date;
    public endUtc?: Date;
    public totalMoves!: number;
    public board?: Board | null;
    public players!: Player[];
    public teams!: Team[];
    
    public constructor(data?: IGame) {
        if (data) {
            this.hydrate(data);
        }
    }

    private hydrate(data: IGame) {
        // Set primitives
        this.startUtc = data.startUtc;
        this.endUtc = data.endUtc;
        this.totalMoves = data.totalMoves;
        // Set board reference prop(s)
        if (!data.board) {
            throw new Error('Cannot build the current game model without a board specification');
        }
        this.board = new Board(data.board);
        // Set player reference props
        this.players = [];
        for(let playerData of data.players) {
            this.players.push(new Player(playerData));
        }
        // Set team reference props
        this.teams = [];
        let players = this.players.splice(0);
        for(let teamData of data.teams) {
            this.teams.push(new Team(teamData, players));
        }
        return this;
    }

}