import { Game, IGame } from '../../../models/game';
import { EventBase } from '../../event-base';
import { Vessel, IVessel } from '../../../models/vessel';

export class VesselStateChangedEvent extends EventBase {

    public static readonly id: Symbol = Symbol.for('VesselStateChangedEvent');

    private readonly vesselId: string;

    public get id() {
        return VesselStateChangedEvent.id;
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