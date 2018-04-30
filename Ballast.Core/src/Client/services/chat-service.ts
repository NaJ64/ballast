import { IChatMessage } from '../value-objects';
import { IDisposable } from '../interfaces/disposable';

export interface IChatService extends IDisposable {

    /**
     * Sends a message then raises an event indicating a message has been sent
     * @param message 
     */
    sendMessageAsync(message: IChatMessage): Promise<void>;

    /**
     * Receives a new message then raises an event indicating a message has been received
     * 
     * (NOTE: This method is intended to be invoked in response to the server)
     * @param message 
     */
    receiveMessageAsync(message: IChatMessage): Promise<void>;

    /**
     * Gets a boolean value indicating whether or not the service is currently connected to the server
     */
    isConnected: boolean;

    /**
     * Initiates the service connection back to the server
     */
    connectAsync(): Promise<void>;

    /**
     * Terminates the current service connection
     */
    disconnectAsync(): Promise<void>;

}