export interface IStrikeType {
    value: number;
    name: string;
    directImpactHP: number;
    indirectImpactHP: number;
}

export class StrikeType implements IStrikeType {

    public static Torpedo: StrikeType = new StrikeType({ value: 0, name: 'Torpedo', directImpactHP: 100, indirectImpactHP: 50 });

    public value!: number;
    public name!: string;
    public directImpactHP!: number;
    public indirectImpactHP!: number;

    private constructor(data: IStrikeType) {
        this.setState(data);
    }

    private setState(data: IStrikeType): StrikeType {
        this.value = data.value;
        this.name = data.name;
        this.directImpactHP = data.directImpactHP
        this.indirectImpactHP = data.indirectImpactHP
        return this;
    }

    public static list(): StrikeType[] {
        return [
            StrikeType.Torpedo
        ];
    }

    public static fromValue(value: number): StrikeType {
        if (!!value) {
            switch(value) {
                case (StrikeType.Torpedo.value):
                    return StrikeType.Torpedo;
            }
        }
        throw new Error(`Could derive strike type from value (${value})`);
    }

    public static fromString(text: string): StrikeType {
        if (!!text) {
            switch(text.toLocaleLowerCase()) {
                case (StrikeType.Torpedo.name.toLocaleLowerCase()):
                    return StrikeType.Torpedo;
            }
        }
        throw new Error(`Could derive strike type from text/name (${text})`);
    }

}
