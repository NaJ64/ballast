import { ITeam, Team } from './team';
export interface IPlayer {
    id: string;
    name: string;
    team?: ITeam | null;
}
export declare class Player implements IPlayer {
    id: string;
    name: string;
    team?: Team | null;
    constructor(state: IPlayer);
    private setState(state);
    setTeam(team: Team | null): void;
}
