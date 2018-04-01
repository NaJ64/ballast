import { ITeam, Team } from './team';

export interface IPlayer { 
    id: string;
    name: string;
    team?: ITeam | null;
}

export class Player implements IPlayer {

    public id!: string;
    public name!: string;
    public team?: Team | null;

    public constructor(state: IPlayer) {
        this.setState(state);
    }

    private setState(state: IPlayer): Player {
        this.id = state.id;
        this.name = state.name;
        return this; 
    }

    public setTeam(team: Team | null) {
        this.team = team;
    }

}