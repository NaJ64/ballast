export interface ITerrain { 
    value: number;
    name: string;
    passable: boolean;
}

export class Terrain implements ITerrain {

    public static Water: Terrain = new Terrain({ value: 0, name: 'Water', passable: false });
    public static Coast: Terrain = new Terrain({ value: 1, name: 'Coast', passable: true });
    public static Land: Terrain = new Terrain({ value: 2, name: 'Land', passable: true });
    
    public readonly value: number;
    public readonly name: string;
    public readonly passable: boolean;

    private constructor(state: ITerrain) {
        this.value = state.value;
        this.name = state.name;
        this.passable = state.passable;
    }

    public static list(): Terrain[] {
        return [
            Terrain.Water,
            Terrain.Coast,
            Terrain.Land
        ];
    }

    public equals(Terrain: Terrain) {
        if (!Terrain) {
            return false;
        }
        return this.value == Terrain.value;
    }

    public static fromObject(object: ITerrain): Terrain {           
        let item = !!object && Terrain.fromValue(object.value);
        if (!item) {
            throw new Error(`Could derive terrain from object (${object})`);
        }
        return item;
    }

    public static fromValue(value: number): Terrain {           
        let item = (value > -1) && Terrain.list().find(x => x.value == value);
        if (!item) {
            throw new Error(`Could derive terrain from value (${value})`);
        }
        return item;
    }

    public static fromString(text: string): Terrain {           
        let item = !!text && Terrain.list().find(x => x.name.toLocaleLowerCase() == text.toLocaleLowerCase());
        if (!item) {
            throw new Error(`Could derive terrain from text (${text})`);
        }
        return item;
    }

}