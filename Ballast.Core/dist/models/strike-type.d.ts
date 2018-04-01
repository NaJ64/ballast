export interface IStrikeType {
    value: number;
    name: string;
    directImpactHP: number;
    indirectImpactHP: number;
}
export declare class StrikeType implements IStrikeType {
    static Torpedo: StrikeType;
    value: number;
    name: string;
    directImpactHP: number;
    indirectImpactHP: number;
    private constructor();
    private setState(data);
    static list(): StrikeType[];
    static fromValue(value: number): StrikeType;
    static fromString(text: string): StrikeType;
}
