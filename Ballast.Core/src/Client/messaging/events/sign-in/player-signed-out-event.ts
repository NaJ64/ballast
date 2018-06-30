import { IPlayer } from '../../../models/player';
import { getUtcNow } from '../../../utility/date-helpers';
import { EventBase } from '../../event-base';

export class PlayerSignedOutEvent extends EventBase {

    public static readonly id: Symbol = Symbol.for('PlayerSignedOutEvent');

    public get id() {
        return PlayerSignedOutEvent.id;
    }

    public readonly player?: IPlayer; 
    public readonly timeStamp?: Date;

    public constructor(player?: IPlayer) {
        super();
        this.player = player;
        this.timeStamp = getUtcNow();
    }

}