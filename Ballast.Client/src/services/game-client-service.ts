import { IGameService, IGame } from 'ballast-core';
import { IClientService } from './client-service';

export interface IGameClientService extends IGameService, IClientService {

    /**
     * Receives an updated game object then raises an event indicating the game state has changed
     * 
     * (NOTE: This method is intended to be invoked in response to the server pushing data down to client)
     * @param update 
     */
    updateGameStateAsync(update: IGame): Promise<void>;

}