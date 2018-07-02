import { IChatMessage } from '../../../value-objects';
import { IEvent } from '../../event';
import { EventBase } from '../../event-base';

export interface IChatMessageSentEvent extends IEvent {
    readonly message: IChatMessage;
}

export class ChatMessageSentEvent extends EventBase implements IChatMessageSentEvent {

    public static readonly id: string = 'ChatMessageSentEvent';

    public get id() {
        return ChatMessageSentEvent.id;
    }

    public readonly message: IChatMessage; 

    public constructor(message: IChatMessage) 
    public constructor(message: IChatMessage, isoDateTime?: string) {
        super(isoDateTime);
        this.message = message;
    }

}