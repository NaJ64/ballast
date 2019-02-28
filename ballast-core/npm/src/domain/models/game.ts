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
    public createdOnDate: Date;
    public startedOnDate: Date | null;
    public endedOnDate: Date | null;

    public constructor(
        id: string, board: Board, vessels: Vessel[], players: Player[], 
        createdOnDate: Date, startedOnDate: Date | null = null, endedOnDate: Date | null = null
    ) {
        this.id = id;
        this.board = board;
        this.vessels = vessels.slice(0);
        this.players = players.slice(0);
        this.createdOnDate = createdOnDate
        this.startedOnDate = startedOnDate || null;
        this.endedOnDate = endedOnDate || null;
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
        if (!!this.startedOnDate)
            throw new Error("Can't re-start game after it has already begun!");
        var startedOnDate = new Date(Date.now());
        this.startedOnDate = startedOnDate;
        return startedOnDate;
    }

    public end(): Date {
        if (!!this.endedOnDate)
            throw new Error("Can't end game after it has already finished!");
        var endedOnDate = new Date(Date.now());
        this.endedOnDate = endedOnDate;
        return endedOnDate;
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
