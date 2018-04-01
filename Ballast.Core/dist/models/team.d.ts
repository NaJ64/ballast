import { IPlayer, Player } from './player';
import { IVessel, Vessel } from './vessel';
import { BoardSpace } from './board-space';
export interface ITeam {
    id: string;
    name: string;
    players: IPlayer[];
    vessels: IVessel[];
}
export declare class Team implements ITeam {
    id: string;
    name: string;
    players: Player[];
    vessels: Vessel[];
    constructor(state: ITeam, allPlayers: Player[], spaces: BoardSpace[]);
    private setState(state, allPlayers, spaces);
    setPlayers(players: Player[]): void;
}
