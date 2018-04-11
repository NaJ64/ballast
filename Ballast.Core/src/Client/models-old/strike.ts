import { ITeam, Team } from "./team";
import { IVessel, Vessel } from "./vessel";
import { IMove, Move } from "./move";
import { IStrikeType, StrikeType } from './strike-type';

export interface IStrike { 
    type: IStrikeType;
    startUtc: Date;
    endUtc: Date | null;
    move: IMove;
    source: IVessel;
    affected: IVessel[];
    totalDamageHP: number;
}

export class Strike implements IStrike {

    public type!: StrikeType;
    public startUtc!: Date;
    public endUtc!: Date | null;
    public move!: Move;
    public source!: Vessel;
    public affected!: Vessel[];
    public totalDamageHP!: number;

    public constructor(state: IStrike, move: Move, teams: Team[]) {
        this.setState(state, move, teams);
    }

    private setState(state: IStrike, move: Move, teams: Team[]) {
        this.startUtc = state.startUtc;
        this.endUtc = state.endUtc || null;
        this.totalDamageHP = state.totalDamageHP;
        this.move = move;
        this.type = StrikeType.fromValue(state.type.value);
        let allVessels = this.getVessels(teams);
        let source = allVessels.find(x => x.id == state.source.id);
        if (!source) {
            throw new Error('Could not associate the current strike with an existing source vessel');
        }
        this.source = source;
        this.affected = [];
        for(let vesselData of state.affected) {
            let vessel = allVessels.find(x => x.id == vesselData.id) || null;
            if (!vessel) {
                throw new Error('Could not associate the current strike with one (or more) affected vessel(s)');
            }
            this.affected.push(vessel);
        }
        return this;
    }

    private getVessels(teams: Team[]): Vessel[] {
        return teams.reduce((allVessels: Vessel[], nextTeam: Team) => {
            for(let teamVessel of nextTeam.vessels) {
                allVessels.push(teamVessel);
            }
            return allVessels;
        }, []);
    }

}