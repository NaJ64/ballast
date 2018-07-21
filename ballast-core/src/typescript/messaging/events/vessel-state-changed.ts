import { Game, IGame } from '../../models/game';
import { IVessel, Vessel } from '../../models/vessel';
import { EventBase } from '../event-base';
import { IEvent } from '../event';

export interface IVesselStateChangedEvent extends IEvent {
    readonly gameId: string;
    readonly vessel: IVessel;
}

export class VesselStateChangedEvent extends EventBase {

    public static readonly id: string = 'VesselStateChangedEvent';

    public get id() {
        return VesselStateChangedEvent.id;
    }

    public readonly vessel: Vessel;
    public readonly gameId: string; 

    private constructor(state: IVesselStateChangedEvent) {
        super(state.isoDateTime);
        this.gameId = state.gameId;
        this.vessel = Vessel.fromObject(state.vessel);
    }

    public static fromObject(object: IVesselStateChangedEvent) {
        return new VesselStateChangedEvent(object);
    }

    public static fromVesselInGame(game: IGame, vessel: IVessel) {
        return new VesselStateChangedEvent({
            id: VesselStateChangedEvent.id,
            isoDateTime: EventBase.getIsoDateTime(),
            gameId: game.id,
            vessel: vessel
        });
    }

}