import { Board, IBoard } from './board';
import { IPlayer, Player } from './player';
import { IVessel, Vessel } from './vessel';
import { IVesselRole, VesselRole } from './vessel-role';
import { CubicCoordinates, ICubicCoordinates } from './cubic-coordinates';

export interface IGame {
    id: string;
    board: IBoard;
    vessels: IVessel[];
    players: IPlayer[];
    createdUtc: Date;
    startedUtc?: Date;
    endedUtc?: Date;
}

export class Game implements IGame {

    public readonly id: string;
    public readonly board: Board;
    public readonly vessels: Vessel[];
    public readonly players: Player[];
    public createdUtc: Date;
    public startedUtc?: Date;
    public endedUtc?: Date;

    private constructor(state: IGame) {
        this.id = state.id;
        this.board = Board.fromObject(state.board);
        this.vessels = state.vessels.map(x => Vessel.fromObject(x));
        this.players = state.players.map(x => Player.fromObject(x));
        this.createdUtc = state.createdUtc;
        this.startedUtc = state.startedUtc;
        this.endedUtc = state.endedUtc;
    }

    public static fromObject(object: IGame) {
        return new Game(object);
    }
    
    public updateVesselCoordinates(vesselId: string, cubicCoordinates: ICubicCoordinates)
    {
        var foundVessel = this.vessels.find(x => x.id == vesselId);
        if (!foundVessel)
            throw new Error(`Could not locate vessel with id '${vesselId}'`);
        return foundVessel.updateCoordinates(cubicCoordinates);
    }

    public start(): Date {
        if (!!this.startedUtc)
            throw new Error("Can't re-start game after it has already begun!");
        var startedUtc = new Date(Date.now());
        this.startedUtc = startedUtc;
        return startedUtc;
    }

    public end(): Date {
        if (!!this.endedUtc)
            throw new Error("Can't end game after it has already finished!");
        var endedUtc = new Date(Date.now());
        this.endedUtc = endedUtc;
        return endedUtc;
    }

    public addPlayer(player: Player): Player {
        if (!player || !player.id)
            throw new Error(`Could not locate player matching id ${player && player.id}`);
        if (this.players.find(x => x.id == player.id))
            throw new Error(`Player with id ${player.id} already exists`);
        this.players.push(player);
        return player;
    }

    public setVesselRole(vesselId: string, vesselRole : VesselRole, player: Player) {
        var vessel = this.vessels.find(x => x.id == vesselId);
        if (!vessel)
            throw new Error(`Could not find vessel for id ${vesselId}`);
        vessel.setVesselRole(vesselRole, player);
    }

    public removePlayerById(playerId: string) {
        if (!playerId)
            throw new Error("Player id is required");
        var player = this.players.find(x => x.id == playerId);
        if (!!player) {
            this.removePlayer(player);
        }
    }

    public removePlayer(player: Player) {
        if (!player || !player.id)
            throw new Error("Player.id is required");
        for(let vessel of this.vessels)
        {
           vessel.removePlayer(player); 
        }
        var playerIndex = this.players.findIndex(x => x.id == player.id);
        if (playerIndex > 0)
            this.players.splice(playerIndex, 1);
    }

}
