import { IEvent } from "../../messaging/event";
import { EventBase } from "../../messaging/event-base";
import { IChatMessage } from "../models/chat-message";

export interface IChatMessageSentEvent extends IEvent {
    message: IChatMessage;
}

export class ChatMessageSentEvent extends EventBase implements IChatMessageSentEvent {

    public static readonly id: string = "ChatMessageSentEvent";
    public get id() {
        return ChatMessageSentEvent.id;
    }

    public readonly message: IChatMessage; 

    private constructor(eventDateIsoString: string, message: IChatMessage) {
        super(eventDateIsoString);
        this.message = message;
    }

    public static fromJSON(json: IChatMessageSentEvent): ChatMessageSentEvent {
        if (!json) {
            throw new Error("No json object was provided");
        }
        if (!json.id) {
            throw new Error("Missing id");
        }
        if (json.id != ChatMessageSentEvent.id) {
            throw new Error("Id does not match event key");
        }
        if (!json.eventDateIsoString) {
            throw new Error("Missing dateIsoString");
        }
        if (!json.message) {
            throw new Error("Missing message");
        }
        return new ChatMessageSentEvent(json.eventDateIsoString, json.message);
    }

    public static fromMessage(message: IChatMessage) {
        return new ChatMessageSentEvent(
            EventBase.getDateIsoString(),
            message
        );
    }

}