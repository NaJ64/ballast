import { IPlayer } from '../../models/player';
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

    public constructor(player: IPlayer)
    public constructor(player: IPlayer, isoDateTime?: string) {
        super(isoDateTime);
        this.player = player;
    }

}