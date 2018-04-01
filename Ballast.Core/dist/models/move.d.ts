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
export declare class Move implements IMove {
    team: Team;
    player: Player;
    vessel: Vessel;
    fromPosition: VesselPosition;
    startUtc: Date;
    endUtc?: Date | null;
    strike: Strike | null;
    constructor(state: IMove, teams: Team[]);
    private setState(state, teams);
}
