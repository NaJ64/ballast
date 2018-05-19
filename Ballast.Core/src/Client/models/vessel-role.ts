export interface IVesselRole { 
    value: number;
    name: string;
}

export class VesselRole implements IVesselRole {

    public static Captain: VesselRole = new VesselRole({ value: 0, name: 'Captain' });
    public static Radioman: VesselRole = new VesselRole({ value: 1, name: 'Radioman' });
    
    public readonly value: number;
    public readonly name: string;

    private constructor(state: IVesselRole) {
        this.value = state.value;
        this.name = state.name;
    }

    public static list(): VesselRole[] {
        return [
            VesselRole.Captain,
            VesselRole.Radioman
        ];
    }

    public equals(VesselRole: VesselRole) {
        if (!VesselRole) {
            return false;
        }
        return this.value == VesselRole.value;
    }

    public static fromObject(object: IVesselRole): VesselRole {           
        let item = !!object && VesselRole.fromValue(object.value);
        if (!item) {
            throw new Error(`Could derive VesselRole from object (${object})`);
        }
        return item;
    }

    public static fromValue(value: number): VesselRole {           
        let item = (value > -1) && VesselRole.list().find(x => x.value == value);
        if (!item) {
            throw new Error(`Could derive vessel role from value (${value})`);
        }
        return item;
    }

    public static fromString(text: string): VesselRole {           
        let item = !!text && VesselRole.list().find(x => x.name.toLocaleLowerCase() == text.toLocaleLowerCase());
        if (!item) {
            throw new Error(`Could derive vessel role from text (${text})`);
        }
        return item;
    }

}