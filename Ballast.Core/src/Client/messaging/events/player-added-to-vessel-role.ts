import { IGame } from '../../models/game';
import { IPlayer, Player } from '../../models/player';
import { IVessel, Vessel } from '../../models/vessel';
import { IVesselRole, VesselRole } from '../../models/vessel-role';
import { IEvent } from '../event';
import { EventBase } from '../event-base';

export interface IPlayerAddedToVesselRoleEvent extends IEvent {
    readonly gameId: string;
    readonly vessel: IVessel;
    readonly vesselRole: IVesselRole;
    readonly player: IPlayer;
}

export class PlayerAddedToVesselRoleEvent extends EventBase implements IPlayerAddedToVesselRoleEvent {

    public static readonly id: string = 'PlayerAddedToVesselRoleEvent';

    public get id() {
        return PlayerAddedToVesselRoleEvent.id;
    }

    public readonly gameId: string; 
    public readonly vessel: Vessel; 
    public readonly vesselRole: VesselRole; 
    public readonly player: Player; 

    private constructor(state: IPlayerAddedToVesselRoleEvent) {
        super(state.isoDateTime);
        this.gameId = state.gameId;
        this.vessel = Vessel.fromObject(state.vessel);
        this.vesselRole = VesselRole.fromObject(state.vesselRole);
        this.player = Player.fromObject(state.player);
    }

    public static fromObject(object: IPlayerAddedToVesselRoleEvent) {
        return new PlayerAddedToVesselRoleEvent(object);
    }

    public static fromPlayerInGameVesselRole(game: IGame, vessel: IVessel, vesselRole: IVesselRole, player: IPlayer) {
        return new PlayerAddedToVesselRoleEvent({
            id: PlayerAddedToVesselRoleEvent.id,
            isoDateTime: EventBase.getIsoDateTime(),
            gameId: game.id,
            vessel: vessel,
            vesselRole: vesselRole,
            player: player
        });
    }

}