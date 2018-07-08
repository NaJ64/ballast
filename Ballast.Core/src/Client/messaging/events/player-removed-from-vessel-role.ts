import { IGame } from '../../models/game';
import { IPlayer, Player } from '../../models/player';
import { IVessel, Vessel } from '../../models/vessel';
import { IVesselRole, VesselRole } from '../../models/vessel-role';
import { IEvent } from '../event';
import { EventBase } from '../event-base';

export interface IPlayerRemovedFromVesselRoleEvent extends IEvent {
    readonly gameId: string;
    readonly vessel: IVessel;
    readonly vesselRole: IVesselRole;
    readonly player: IPlayer;
}

export class PlayerRemovedFromVesselRoleEvent extends EventBase implements IPlayerRemovedFromVesselRoleEvent {

    public static readonly id: string = 'PlayerRemovedFromVesselRoleEvent';

    public get id() {
        return PlayerRemovedFromVesselRoleEvent.id;
    }

    public readonly gameId: string; 
    public readonly vessel: Vessel; 
    public readonly vesselRole: VesselRole; 
    public readonly player: Player; 

    private constructor(state: IPlayerRemovedFromVesselRoleEvent) {
        super(state.isoDateTime);
        this.gameId = state.gameId;
        this.vessel = Vessel.fromObject(state.vessel);
        this.vesselRole = VesselRole.fromObject(state.vesselRole);
        this.player = Player.fromObject(state.player);
    }

    public static fromObject(object: IPlayerRemovedFromVesselRoleEvent) {
        return new PlayerRemovedFromVesselRoleEvent(object);
    }

    public static fromPlayerInGameVesselRole(game: IGame, vessel: IVessel, vesselRole: IVesselRole, player: IPlayer) {
        return new PlayerRemovedFromVesselRoleEvent({
            id: PlayerRemovedFromVesselRoleEvent.id,
            isoDateTime: EventBase.getIsoDateTime(),
            gameId: game.id,
            vessel: vessel,
            vesselRole: vesselRole,
            player: player
        });
    }

}