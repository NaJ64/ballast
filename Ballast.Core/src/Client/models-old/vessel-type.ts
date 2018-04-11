export interface IVesselType {
    value: number;
    name: string;
    baseHP: number;
    canReverse: boolean;
}

export class VesselType implements IVesselType {

    public static Submarine: VesselType = new VesselType({ value: 0, name: 'Submarine', baseHP: 100, canReverse: false });
    
    public value!: number;
    public name!: string;
    public baseHP!: number;
    public canReverse!: boolean;

    private constructor(state: IVesselType) {
        this.setState(state);
    }

    private setState(state: IVesselType): VesselType {
        this.value = state.value;
        this.name = state.name;
        this.baseHP = state.baseHP;
        this.canReverse = state.canReverse;
        return this;
    }

    public static list(): VesselType[] {
        return [
            VesselType.Submarine,
        ];
    }

    public static fromValue(value: number): VesselType {
        if (!!value) {
            switch(value) {
                case (VesselType.Submarine.value):
                    return VesselType.Submarine;
            }
        }
        throw new Error(`Could derive vessel type from value (${value})`);
    }

    public static fromString(text: string): VesselType {
        if (!!text) {
            switch(text.toLocaleLowerCase()) {
                case (VesselType.Submarine.name.toLocaleLowerCase()):
                    return VesselType.Submarine;
            }
        }
        throw new Error(`Could derive vessel type from text/name (${text})`);
    }

}
