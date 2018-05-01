import { IChatMessage } from '../value-objects';
import { IDisposable } from '../interfaces/disposable';

export interface IChatService extends IDisposable {

    /**
     * Sends a message then raises an event indicating a message has been sent
     * @param message 
     */
    sendMessageAsync(message: IChatMessage): Promise<void>;

}