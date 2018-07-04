import { IChatMessage } from '../../value-objects';
import { IEvent } from '../event';
import { EventBase } from '../event-base';

export interface IChatMessageSentEvent extends IEvent {
    readonly message: IChatMessage;
}

export class ChatMessageSentEvent extends EventBase implements IChatMessageSentEvent {

    public static readonly id: string = 'ChatMessageSentEvent';

    public get id() {
        return ChatMessageSentEvent.id;
    }

    public readonly message: IChatMessage; 

    private constructor(state: IChatMessageSentEvent) {
        super(state.isoDateTime);
        this.message = state.message;
    }

    public static fromObject(object: IChatMessageSentEvent) {
        return new ChatMessageSentEvent(object);
    }

    public static fromMessage(message: IChatMessage) {
        return new ChatMessageSentEvent({
            id: ChatMessageSentEvent.id,
            isoDateTime: EventBase.getIsoDateTime(),
            message: message
        });
    }

}