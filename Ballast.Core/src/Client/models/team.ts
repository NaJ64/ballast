import { IPlayer, Player } from './player';
import { IVessel, Vessel } from './vessel';

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

    public constructor(data?: ITeam, players?: Player[]) {
        if (data) {
            this.hydrate(data, players);
        }
    }

    private hydrate(data: ITeam, allPlayers?: Player[]) {
        // Set primitives
        this.id = data.id;
        this.name = data.name;
        // Set player reference prop(s)
        this.players = [];
        for(let playerData of data.players) {
            let player: Player | null = null;
            if (allPlayers) {
                player = allPlayers.find(x => x.id == playerData.id) || null;
            } else {
                player = new Player(playerData);
            }
            if (player) {
                this.players.push(player);
            }
        }
        // Set vessel reference prop(s)
        this.vessels = [];
        let players = this.players.splice(0);
        for (let vesselData of data.vessels) {
            this.vessels.push(new Vessel(vesselData, this, this.players));
        }
    }

}