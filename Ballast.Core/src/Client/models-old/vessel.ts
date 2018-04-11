import { ITeam, Team } from './team';
import { IVesselPosition, VesselPosition } from './vessel-position';
import { IVesselType, VesselType } from './vessel-type';
import { IPlayer, Player } from './player';
import { IBoardSpace, BoardSpace } from './board-space';

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

export class Vessel implements IVessel {

    public id!: string;
    public team?: Team | null;
    public captain?: Player | null;
    public radioman?: Player | null;
    public vesselType!: VesselType;
    public startingPosition?: VesselPosition | null;
    public currentPosition?: VesselPosition | null;
    public positionHistory!: VesselPosition[];
    public active!: boolean;
    public remainingHP!: number;
    public kills!: number;
    
    public constructor(state: IVessel, team: Team, spaces: BoardSpace[]) {
        this.setState(state, team, spaces);
    }

    private setState(state: IVessel, team: Team, spaces: BoardSpace[]) {
        // Set primitives
        this.id = state.id;
        this.active = state.active;
        this.remainingHP = state.remainingHP;
        this.kills = state.kills;
        // Set vessel type from const with matching value
        this.vesselType = VesselType.fromValue(state.vesselType.value);
        // Set team reference prop
        this.team = team || null;
        // Set captain (player) reference prop
        this.captain = null;
        if (state.captain && team.players) {
            let captainData = state.captain;
            this.captain = team.players.find(x => x.id == captainData.id) || null;
        }
        // Set radioman (player) reference prop
        this.radioman = null;
        if (state.radioman && team.players) {
            let radiomanData = state.radioman;
            this.radioman = team.players.find(x => x.id == radiomanData.id) || null;
        }
        // Set positions history
        this.positionHistory = [];
        let sortedPositionData = state.positionHistory
            .sort((a, b) => b.arrivalUtc.valueOf() - a.arrivalUtc.valueOf());
        for (let positionData of sortedPositionData) {
            this.positionHistory.push(new VesselPosition(positionData, this, spaces));
        }
        // Set previous/next positions within list
        for(let position of this.positionHistory) {
            position.setNextAndPrevious(this.positionHistory);
        }
        return this;
    }

}