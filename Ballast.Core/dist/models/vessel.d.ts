import { ITeam, Team } from './team';
import { IVesselPosition, VesselPosition } from './vessel-position';
import { IVesselType, VesselType } from './vessel-type';
import { IPlayer, Player } from './player';
import { BoardSpace } from './board-space';
export interface IVessel {
    id: string;
    team?: ITeam | null;
    captain?: IPlayer | null;
    radioman?: IPlayer | null;
    vesselType: IVesselType;
    startingPosition?: IVesselPosition | null;
    currentPosition?: IVesselPosition | null;
    positionHistory: IVesselPosition[];
    active: boolean;
    remainingHP: number;
    kills: number;
}
export declare class Vessel implements IVessel {
    id: string;
    team?: Team | null;
    captain?: Player | null;
    radioman?: Player | null;
    vesselType: VesselType;
    startingPosition?: VesselPosition | null;
    currentPosition?: VesselPosition | null;
    positionHistory: VesselPosition[];
    active: boolean;
    remainingHP: number;
    kills: number;
    constructor(state: IVessel, team: Team, spaces: BoardSpace[]);
    private setState(state, team, spaces);
}
