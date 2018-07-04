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

    private constructor(state: IChatMessageReceivedEvent) {
        super(state.isoDateTime);
        this.message = state.message;
    }

    public static fromObject(object: IChatMessageReceivedEvent) {
        return new ChatMessageReceivedEvent(object);
    }

    public static fromMessage(message: IChatMessage) {
        return new ChatMessageReceivedEvent({
            id: ChatMessageReceivedEvent.id,
            isoDateTime: EventBase.getIsoDateTime(),
            message: message
        });
    }

}