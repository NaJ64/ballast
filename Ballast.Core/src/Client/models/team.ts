import { IPlayer, Player } from './player';
import { IVessel, Vessel } from './vessel';
import { IBoardSpace, BoardSpace } from './board-space';

export interface ITeam { 
    id: string;
    name: string;
    players: IPlayer[];
    vessels: IVessel[];
}

export class Team implements ITeam {

    public id!: string;
    public name!: string;
    public players!: Player[];
    public vessels!: Vessel[];

    public constructor(state: ITeam, allPlayers: Player[], spaces: BoardSpace[]) {
        this.setState(state, allPlayers, spaces);
    }

    private setState(state: ITeam, allPlayers: Player[], spaces: BoardSpace[]): Team {
        // Set primitives
        this.id = state.id;
        this.name = state.name;
        // Set player reference prop(s)
        this.players = [];
        for(let playerData of state.players) {
            let player = allPlayers.find(x => x.id == playerData.id) || null;
            if (player) {
                this.players.push(player);
            }
        }
        for (let player of this.players) {
            player.setTeam(this); // Set team reference for all players that were added
        }
        // Set vessel reference prop(s)
        this.vessels = [];
        for (let vesselData of state.vessels) {
            this.vessels.push(new Vessel(vesselData, this, spaces));
        }
        return this;
    }

    public setPlayers(players: Player[]) {
        this.players = [];
        for(let player of players) {
            this.players.push(player);
        }
    }

}