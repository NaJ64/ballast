import { IPlayer, Player } from '../../models/player';
import { IEvent } from '../event';
import { EventBase } from '../event-base';

export interface IPlayerSignedInEvent extends IEvent {
    readonly player: IPlayer;
}

export class PlayerSignedInEvent extends EventBase implements IPlayerSignedInEvent {

    public static readonly id: string = 'PlayerSignedInEvent';

    public get id() {
        return PlayerSignedInEvent.id;
    }

    public readonly player: IPlayer; 

    private constructor(state: IPlayerSignedInEvent) {
        super(state.isoDateTime);
        this.player = Player.fromObject(state.player);
    }

    public static fromObject(object: IPlayerSignedInEvent) {
        return new PlayerSignedInEvent(object);
    }

    public static fromPlayer(player: IPlayer) {
        return new PlayerSignedInEvent({
            id: PlayerSignedInEvent.id,
            isoDateTime: EventBase.getIsoDateTime(),
            player: player
        });
    }

}