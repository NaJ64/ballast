import { EventBase } from '../../event';
import { IChatMessage } from '../../../services/chat/chat-message';

export class ChatMessageSentEvent extends EventBase {

    public static readonly id: Symbol = Symbol.for('ChatMessageSentEvent');

    public get id() {
        return ChatMessageSentEvent.id;
    }

    public readonly message: IChatMessage; 

    public constructor(message: IChatMessage) {
        super();
        this.message = message;
    }

}