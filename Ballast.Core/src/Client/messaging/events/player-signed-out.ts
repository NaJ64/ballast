import { IPlayer, Player } from '../../models/player';
import { IEvent } from '../event';
import { EventBase } from '../event-base';

export interface IPlayerSignedOutEvent extends IEvent {
    readonly player?: IPlayer;
}

export class PlayerSignedOutEvent extends EventBase implements IPlayerSignedOutEvent {

    public static readonly id: string = 'PlayerSignedOutEvent';

    public get id() {
        return PlayerSignedOutEvent.id;
    }

    public readonly player?: Player; 

    private constructor(state: IPlayerSignedOutEvent) {
        super(state.isoDateTime);
        this.player = state.player && Player.fromObject(state.player) || undefined;
    }

    public static fromObject(object: IPlayerSignedOutEvent) {
        return new PlayerSignedOutEvent(object);
    }

    public static fromPlayer(player?: IPlayer) {
        return new PlayerSignedOutEvent({
            id: PlayerSignedOutEvent.id,
            isoDateTime: EventBase.getIsoDateTime(),
            player: player
        });
    }

}