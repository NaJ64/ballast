import { ITeam, Team } from './team';
import { IPlayer, Player } from './player';
import { IVessel, Vessel } from './vessel';
import { IVesselPosition, VesselPosition } from './vessel-position';
import { IStrike, Strike } from './strike';

export interface IMove { 
    team: ITeam;
    player: IPlayer;
    vessel: IVessel;
    fromPosition: IVesselPosition;
    startUtc: Date;
    endUtc?: Date | null;
    strike: IStrike | null;
}

export class Move implements IMove {

    public team!: Team;
    public player!: Player;
    public vessel!: Vessel;
    public fromPosition!: VesselPosition;
    public startUtc!: Date;
    public endUtc?: Date | null;
    public strike!: Strike | null;

    public constructor(state: IMove, teams: Team[]) {
        this.setState(state, teams);
    }

    private setState(state: IMove, teams: Team[]) {
        this.startUtc = state.startUtc;
        this.endUtc = state.endUtc || null;
        let team = teams.find(x => x.id == state.team.id) || null;
        if (!team) {
            throw new Error('Could not associate the current move with an existing team');
        }
        this.team = team;
        let player = this.team.players.find(x => x.id == state.player.id) || null;
        if (!player) {
            throw new Error('Could not associate the current move with an existing player');
        }
        this.player = player;
        let vessel = this.team.vessels.find(x => x.id == state.vessel.id) || null;
        if (!vessel) {
            throw new Error('Could not associate the current move with an existing vessel');
        }
        this.vessel = vessel;
        let fromPosition = this.vessel.positionHistory
            .find(x => x.space.coordinates.row == state.fromPosition.space.coordinates.row &&
                       x.space.coordinates.column == state.fromPosition.space.coordinates.column &&
                       x.arrivalUtc.valueOf() == state.fromPosition.arrivalUtc.valueOf()) || null;
        if (!fromPosition) {
            throw new Error('Could not associate the current move with a vessel position');
        }
        this.fromPosition = fromPosition;
        this.strike = state.strike && new Strike(state.strike, this, teams) || null;
        return this;
    }

}