export interface ITerrain {
    value: number;
    name: string;
}

export class Terrain implements ITerrain {

    public static Water: Terrain = new Terrain({ value: 0, name: 'Water' });
    public static DeepWater: Terrain = new Terrain({ value: 1, name: 'DeepWater' });
    public static ShallowWater: Terrain = new Terrain({ value: 2, name: 'ShallowWater' });
    public static Coast: Terrain = new Terrain({ value: 3, name: 'Coast' });
    public static Grass: Terrain = new Terrain({ value: 4, name: 'Grass' });
    public static Forest: Terrain = new Terrain({ value: 5, name: 'Forest' });
    public static Mountain: Terrain = new Terrain({ value: 6, name: 'Mountain' });

    public value!: number;
    public name!: string;

    private constructor(state: ITerrain) {
        this.setState(state);
    }
  
    private setState(state: ITerrain): Terrain {
        this.value = state.value;
        this.name = state.name;
        return this;
    }

    public static list(): Terrain[] {
        return [
            Terrain.Water,
            Terrain.DeepWater,
            Terrain.ShallowWater,
            Terrain.Coast,
            Terrain.Grass,
            Terrain.Forest,
            Terrain.Mountain
        ];
    }

    public static fromValue(value: number): Terrain {
        if (!!value) {
            switch(value) {
                case (Terrain.Water.value):
                    return Terrain.Water;
                case (Terrain.DeepWater.value):
                    return Terrain.DeepWater;
                case (Terrain.ShallowWater.value):
                    return Terrain.ShallowWater;
                case (Terrain.Coast.value):
                    return Terrain.Coast;
                case (Terrain.Grass.value):
                    return Terrain.Grass;
                case (Terrain.Forest.value):
                    return Terrain.Forest;
                case (Terrain.Mountain.value):
                    return Terrain.Mountain;
            }
        }
        throw new Error(`Could derive terrain from value (${value})`);
    }

    public static fromString(text: string): Terrain {
        if (!!text) {
            switch(text.toLocaleLowerCase()) {
                case (Terrain.Water.name.toLocaleLowerCase()):
                    return Terrain.Water;
                case (Terrain.DeepWater.name.toLocaleLowerCase()):
                    return Terrain.DeepWater;
                case (Terrain.ShallowWater.name.toLocaleLowerCase()):
                    return Terrain.ShallowWater;
                case (Terrain.Coast.name.toLocaleLowerCase()):
                    return Terrain.Coast;
                case (Terrain.Grass.name.toLocaleLowerCase()):
                    return Terrain.Grass;
                case (Terrain.Forest.name.toLocaleLowerCase()):
                    return Terrain.Forest;
                case (Terrain.Mountain.name.toLocaleLowerCase()):
                    return Terrain.Mountain;
            }
        }
        throw new Error(`Could derive terrain from text/name (${text})`);
    }

}
