export interface IPlayer {
    id: string;
    name: string;
}

export class Player implements IPlayer {

    public readonly id: string;
    public readonly name: string;

    private constructor(state: IPlayer) {
        this.id = state.id;
        this.name = state.name;
    }

    public static fromObject(object: IPlayer) {
        return new Player(object);
    }

}