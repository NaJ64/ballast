import { Game, IGame } from '../../models/game';
import { IVessel, Vessel } from '../../models/vessel';
import { EventBase } from '../event-base';
import { IEvent } from '../event';

export interface IVesselStateChangedEvent extends IEvent {
    readonly vessel: IVessel;
    readonly game: IGame;
}

export class VesselStateChangedEvent extends EventBase {

    public static readonly id: string = 'VesselStateChangedEvent';

    public get id() {
        return VesselStateChangedEvent.id;
    }

    public readonly game: Game; 

    private readonly _vesselId: string;
    public get vessel(): Vessel {
        let vessel = this.game.vessels.find(x => x.id == this._vesselId);
        if (!vessel)
            throw new Error("Could not locate vessel using specified id");
        return vessel;
    }

    private constructor(state: IVesselStateChangedEvent) {
        super(state.isoDateTime);
        this.game = Game.fromObject(state.game);
        this._vesselId = state.vessel.id;
    }

    public static fromObject(object: IVesselStateChangedEvent) {
        return new VesselStateChangedEvent(object);
    }

    public static fromVesselInGame(game: IGame, vessel: IVessel) {
        return new VesselStateChangedEvent({
            id: VesselStateChangedEvent.id,
            isoDateTime: EventBase.getIsoDateTime(),
            game: game,
            vessel: vessel
        });
    }

}