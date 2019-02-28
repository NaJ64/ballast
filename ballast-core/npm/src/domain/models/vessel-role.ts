export class VesselRole {

    public static Captain: VesselRole = new VesselRole(0, "Captain");
    public static Radioman: VesselRole = new VesselRole(1, "Radioman");
    
    public readonly value: number;
    public readonly name: string;

    private constructor(value: number, name: string) {
        this.value = value;
        this.name = name;
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

    public static fromValue(value: number): VesselRole {           
        let item = (value > -1) && VesselRole.list().find(x => x.value == value);
        if (!item) {
            throw new Error(`Could derive vessel role from value (${value})`);
        }
        return item;
    }

    public static fromName(text: string): VesselRole {           
        let item = !!text && VesselRole.list().find(x => x.name.toLocaleLowerCase() == text.toLocaleLowerCase());
        if (!item) {
            throw new Error(`Could derive vessel role from text (${text})`);
        }
        return item;
    }

}