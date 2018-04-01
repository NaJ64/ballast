export interface ITerrain {
    value: number;
    name: string;
}
export declare class Terrain implements ITerrain {
    static Water: Terrain;
    static DeepWater: Terrain;
    static ShallowWater: Terrain;
    static Coast: Terrain;
    static Grass: Terrain;
    static Forest: Terrain;
    static Mountain: Terrain;
    value: number;
    name: string;
    private constructor();
    private setState(state);
    static list(): Terrain[];
    static fromValue(value: number): Terrain;
    static fromString(text: string): Terrain;
}
