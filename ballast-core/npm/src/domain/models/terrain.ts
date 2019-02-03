export class Terrain {

    public static Water: Terrain = new Terrain(0, "Water", true);
    public static Coast: Terrain = new Terrain(1, "Coast", false);
    public static Land: Terrain = new Terrain(2, "Land", false);

    public readonly value: number;
    public readonly name: string;
    public readonly passable: boolean;

    private constructor(value: number, name: string, passable: boolean) {
        this.value = value;
        this.name = name;
        this.passable = passable;
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

    public static fromValue(value: number): Terrain {
        let item = (value > -1) && Terrain.list().find(x => x.value == value);
        if (!item) {
            throw new Error(`Could derive terrain from value (${value})`);
        }
        return item;
    }

    public static fromName(text: string): Terrain {
        let item = !!text && Terrain.list().find(x => x.name.toLocaleLowerCase() == text.toLocaleLowerCase());
        if (!item) {
            throw new Error(`Could derive terrain from text (${text})`);
        }
        return item;
    }

}