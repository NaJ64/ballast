import { EventBase } from '../../event';
import { IChatMessage } from 'ballast-core';

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