import { IChatMessage } from '../../../value-objects';
import { EventBase } from '../../event-base';

export class ChatMessageReceivedEvent extends EventBase {

    public static readonly id: Symbol = Symbol.for('ChatMessageReceivedEvent');

    public get id() {
        return ChatMessageReceivedEvent.id;
    }

    public readonly message: IChatMessage; 

    public constructor(message: IChatMessage) {
        super();
        this.message = message;
    }

}