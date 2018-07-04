import { Game, IGame } from '../../models/game';
import { IVessel } from '../../models/vessel';
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

    private readonly _vesselId: string;
    public readonly game: IGame; 

    public get vessel(): IVessel {
        let vessel = this.game.vessels.find(x => x.id == this._vesselId);
        if (!vessel)
            throw new Error("Could not locate vessel using specified id");
        return vessel;
    }

    public constructor(game: Game, vesselId: string)
    public constructor(game: Game, vesselId: string, isoDateTime?: string) {
        super(isoDateTime);
        this._vesselId = vesselId;
        this.game = game;
    }

}