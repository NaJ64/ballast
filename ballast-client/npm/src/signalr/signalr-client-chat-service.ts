import { IChatService, IChatMessage } from "ballast-core";

export class SignalRClientChatService implements IChatService {
    dispose(): void {
        throw new Error("Method not implemented.");
    }
    sendMessageAsync(message: IChatMessage): Promise<void> {
        throw new Error("Method not implemented.");
    }    
}