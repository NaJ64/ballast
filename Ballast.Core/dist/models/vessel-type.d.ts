export interface IVesselType {
    value: number;
    name: string;
    baseHP: number;
    canReverse: boolean;
}
export declare class VesselType implements IVesselType {
    static Submarine: VesselType;
    value: number;
    name: string;
    baseHP: number;
    canReverse: boolean;
    private constructor();
    private setState(state);
    static list(): VesselType[];
    static fromValue(value: number): VesselType;
    static fromString(text: string): VesselType;
}
