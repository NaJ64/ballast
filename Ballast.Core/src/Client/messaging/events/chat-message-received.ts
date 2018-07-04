import { IChatMessage } from '../../value-objects';
import { IEvent } from '../event';
import { EventBase } from '../event-base';

export interface IChatMessageReceivedEvent extends IEvent {
    readonly message: IChatMessage;
}

export class ChatMessageReceivedEvent extends EventBase implements IChatMessageReceivedEvent {

    public static readonly id: string = 'ChatMessageReceivedEvent';

    public get id() {
        return ChatMessageReceivedEvent.id;
    }

    public readonly message: IChatMessage; 

    public constructor(message: IChatMessage) 
    public constructor(message: IChatMessage, isoDateTime?: string) {
        super(isoDateTime);
        this.message = message;
    }

}