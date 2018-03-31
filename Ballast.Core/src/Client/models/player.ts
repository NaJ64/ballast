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

    private teamData?: ITeam | null;

    public constructor(data?: IPlayer) {
        if (data) {
            this.hydrate(data);
        }
    }

    private hydrate(data: IPlayer) {
        this.id = data.id;
        this.name = data.name;
        this.teamData = data.team;
    }

    public setTeam(team?: Team) {
        this.team = team;
    }

}