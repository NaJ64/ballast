import { IDisposable } from "../../interfaces/disposable";
import { IChatMessage } from "../models/chat-message";

export interface IChatService extends IDisposable {
    sendMessageAsync(message: IChatMessage): Promise<void>;
}
