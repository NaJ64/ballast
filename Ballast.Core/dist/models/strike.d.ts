import { Team } from "./team";
import { IVessel, Vessel } from "./vessel";
import { IMove, Move } from "./move";
export interface IStrike {
    startUtc: Date;
    endUtc: Date | null;
    move: IMove;
    source: IVessel;
    affected: IVessel[];
    totalDamageHP: number;
}
export declare class Strike implements IStrike {
    startUtc: Date;
    endUtc: Date | null;
    move: Move;
    source: Vessel;
    affected: Vessel[];
    totalDamageHP: number;
    constructor(state: IStrike, move: Move, teams: Team[]);
    private setState(state, move, teams);
    private getVessels(teams);
}
