import { IChatMessage } from '../value-objects';
import { IGameService } from './game-service';
import { IDisposable } from '../interfaces/disposable';

export interface IGameClientService extends IGameService {

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