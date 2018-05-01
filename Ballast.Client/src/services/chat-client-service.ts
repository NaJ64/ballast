import { IChatService, IChatMessage } from 'ballast-core';
import { IClientService } from './client-service';

export interface IChatClientService extends IChatService, IClientService {

    /**
     * Receives a new message then raises an event indicating a message has been received
     * 
     * (NOTE: This method is intended to be invoked in response to the server pushing data down to client)
     * @param message 
     */
    receiveMessageAsync(message: IChatMessage): Promise<void>;

}