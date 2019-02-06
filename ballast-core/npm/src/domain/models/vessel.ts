import { CubicCoordinates } from "./cubic-coordinates";
import { Player } from "./player";
import { VesselRole } from "./vessel-role";

export class Vessel {

    public readonly id: string;
    public name: string;
    public cubicCoordinates: CubicCoordinates;
    public captain: Player | null;
    public radioman: Player | null;

    private constructor(id: string, name: string, cubicCoordinates: CubicCoordinates, captain: Player | null = null, radioman: Player | null = null) {
        this.id = id;
        this.name = name;
        this.cubicCoordinates = cubicCoordinates;
        this.captain = captain || null;
        this.radioman = radioman || null;
    }

    public updateCoordinates(cubicCoordinates: CubicCoordinates) {
        this.cubicCoordinates = cubicCoordinates;
        return this.cubicCoordinates;
    }
    
    public setVesselRole(vesselRole: VesselRole, player: Player | null) {
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