import { IPlayer } from '../../../models/player';
import { IEvent } from '../../event';
import { EventBase } from '../../event-base';

export interface IPlayerSignedOutEvent extends IEvent {
    readonly player?: IPlayer;
}

export class PlayerSignedOutEvent extends EventBase implements IPlayerSignedOutEvent {

    public static readonly id: string = 'PlayerSignedOutEvent';

    public get id() {
        return PlayerSignedOutEvent.id;
    }

    public readonly player?: IPlayer; 

    public constructor(player?: IPlayer)
    public constructor(player?: IPlayer, isoDateTime?: string) {
        super(isoDateTime);
        this.player = player;
    }

}