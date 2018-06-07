import { IDisposable } from '../interfaces/disposable';
import { IPlayer } from '../models/player';
import { IPlayerSignInRequest } from '../value-objects/player-sign-in-request';
import { IPlayerSignOutRequest } from '../value-objects/player-sign-out-request';

export interface ISignInService extends IDisposable {

    /**
     * Signs the player/client in with the game server
     * @param request 
     */
    signInAsync(request: IPlayerSignInRequest): Promise<IPlayer>;

    /**
     * Signs the player/client out from the game server
     * @param request 
     */
    signOutAsync(request: IPlayerSignOutRequest): Promise<void>;
}