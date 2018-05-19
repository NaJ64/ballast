import { CubicCoordinates, ICubicCoordinates } from "./cubic-coordinates";
import { IPlayer, Player } from './player';
import { IVesselRole, VesselRole } from './vessel-role';

export interface IVessel {
    id: string;
    cubicCoordinates: ICubicCoordinates;
    captain: IPlayer | null;
    radioman: IPlayer | null;
}

export class Vessel implements IVessel {

    public readonly id: string;
    public cubicCoordinates: CubicCoordinates;
    public captain: Player | null;
    public radioman: Player | null;

    private constructor(state: IVessel) {
        this.id = state.id;
        this.cubicCoordinates = CubicCoordinates.fromObject(state.cubicCoordinates);
        this.captain = state.captain && Player.fromObject(state.captain);
        this.radioman = state.radioman && Player.fromObject(state.radioman);
    }

    public static fromObject(object: IVessel) {
        return new Vessel(object);
    }
    
    public updateCoordinates(cubicCoordinates: ICubicCoordinates) {
        this.cubicCoordinates = CubicCoordinates.fromObject(cubicCoordinates);
        return this.cubicCoordinates;
    }
    
    public setVesselRole(vesselRole: VesselRole, player: Player) {
        if (vesselRole.equals(VesselRole.Captain))
        {
            this.captain = player;
            return;
        }
        if (vesselRole.equals(VesselRole.Radioman))
        {
            this.radioman = player;
            return;
        }
        throw new Error(`Vessel role matching value '${vesselRole.value}' does not exist on the current vessel`);
    }

    public removePlayer(player: Player) {
        if (!player)
            throw new Error("Player cannot be null");
        if (this.captain && this.captain.id == player.id)
            this.captain = null;
        if (this.radioman && this.radioman.id == player.id)
            this.radioman = null;
    }

}