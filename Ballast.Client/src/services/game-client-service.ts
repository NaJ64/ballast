import { IGameService } from 'ballast-core';
import { IClientService } from './client-service';

export interface IGameClientService extends IGameService, IClientService {

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