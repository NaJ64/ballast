import { CubicCoordinates, ICubicCoordinates } from "./cubic-coordinates";
import { IPlayer, Player } from './player';

export interface IVessel {
    id: string;
    cubicCoordinates: ICubicCoordinates;
    captain: IPlayer;
    radioman: IPlayer;
}

export class Vessel implements IVessel {

    public readonly id: string;
    public cubicCoordinates: CubicCoordinates;
    public readonly captain: Player;
    public readonly radioman: Player;

    private constructor(state: IVessel) {
        this.id = state.id;
        this.cubicCoordinates = CubicCoordinates.fromObject(state.cubicCoordinates);
        this.captain = Player.fromObject(state.captain);
        this.radioman = Player.fromObject(state.radioman);
    }

    public static fromObject(object: IVessel) {
        return new Vessel(object);
    }
    
    public updateCoordinates(cubicCoordinates: ICubicCoordinates)
    {
        this.cubicCoordinates = CubicCoordinates.fromObject(cubicCoordinates);
        return this.cubicCoordinates;
    }

}