import { ITeam, Team } from './team';
import { IVesselPosition, VesselPosition } from './vessel-position';
import { IVesselType, VesselType } from './vessel-type';
import { IPlayer, Player } from './player';

export interface IVessel {
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

    public constructor(data: IVessel, team: Team, teamPlayers: Player[]) {
        this.hydrate(data, team, teamPlayers);
    }

    public hydrate(data: IVessel, team: Team, teamPlayers: Player[]) {
        // Set primitives
        this.active = data.active;
        this.remainingHP = data.remainingHP;
        this.kills = data.kills;
        // Set vessel type from const with matching value
        this.vesselType = VesselType.fromValue(data.vesselType.value);
        // Set team reference prop
        this.team = team || null;
        // Set captain (player) reference props
        this.captain = null;
        if (data.captain && teamPlayers) {
            let captainData = data.captain;
            this.captain = teamPlayers.find(x => x.id == captainData.id) || null;
        }
        // Set radioman (player) reference props
        this.radioman = null;
        if (data.radioman && teamPlayers) {
            let radiomanData = data.radioman;
            this.radioman = teamPlayers.find(x => x.id == radiomanData.id) || null;
        }
        // Set positions history
        this.positionHistory = [];
        let sortedPositionData = data.positionHistory
            .sort((a, b) => b.arrivalUtc.valueOf() - a.arrivalUtc.valueOf());
        for (let positionData of sortedPositionData) {
            this.positionHistory.push(new VesselPosition(positionData));
        }
        // Set adjacent positions within list
        let positions = this.positionHistory.splice(0);
        for(let position of this.positionHistory) {
            position.setAdjacents(positions);
        }
        return this;
    }

}