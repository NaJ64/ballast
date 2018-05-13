import { Game, IGame } from '../../../models/game';
import { EventBase } from '../../event-base';
import { Vessel, IVessel } from '../../../models/vessel';

export class VesselMovedEvent extends EventBase {

    public static readonly id: Symbol = Symbol.for('VesselMovedEvent');

    private readonly vesselId: string;

    public get id() {
        return VesselMovedEvent.id;
    }

    public get vessel(): IVessel {
        let vessel = this.game.vessels.find(x => x.id == this.vesselId);
        if (!vessel)
            throw new Error("Could not locate vessel using specified id");
        return vessel;
    }

    public readonly game: IGame; 

    public constructor(game: Game, vesselId: string) {
        super();
        this.vesselId = vesselId;
        this.game = game;
    }

}