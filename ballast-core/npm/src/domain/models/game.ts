import { Board } from "./board";
import { Player } from "./player";
import { Vessel } from "./vessel";
import { VesselRole } from "./vessel-role";
import { CubicCoordinates } from "./cubic-coordinates";

export class Game {

    public readonly id: string;
    public readonly board: Board;
    public readonly vessels: Vessel[];
    public readonly players: Player[];
    public createdUtc: Date;
    public startedUtc: Date | null;
    public endedUtc: Date | null;

    private constructor(
        id: string, board: Board, vessels: Vessel[], players: Player[], 
        createdUtc: Date, startedUtc: Date | null = null, endedUtc: Date | null
    ) {
        this.id = id;
        this.board = board;
        this.vessels = vessels.slice(0);
        this.players = players.slice(0);
        this.createdUtc = createdUtc;
        this.startedUtc = startedUtc || null;
        this.endedUtc = endedUtc || null;
    }

    public updateVesselCoordinates(vesselId: string, cubicCoordinates: CubicCoordinates)
    {
        var foundVessel = this.vessels.find(x => x.id == vesselId);
        if (!foundVessel)
            throw new Error(`Could not locate vessel with id '${vesselId}'`);
        var foundTile = this.board.getTileFromCoordinates(cubicCoordinates);
        if (!foundTile)
            throw new Error(`Could not locate tile with coordinates ${cubicCoordinates.toOrderedTriple()}`);
        if (!foundTile.terrain.passable)
            throw new Error(`The requested tile terrain is not passable`);
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
