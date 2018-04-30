import { IDisposable } from 'ballast-core';

export interface IClientService extends IDisposable {

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