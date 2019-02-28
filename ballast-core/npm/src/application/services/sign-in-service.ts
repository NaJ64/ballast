import { IDisposable } from "../../interfaces/disposable";
import { IPlayerDto } from "../models/player-dto";
import { IPlayerSignInRequest } from "../models/player-sign-in-request";
import { IPlayerSignOutRequest } from "../models/player-sign-out-request";

export interface ISignInService extends IDisposable {
    signInAsync(request: IPlayerSignInRequest): Promise<IPlayerDto>;
    signOutAsync(request: IPlayerSignOutRequest): Promise<void>;
    getSignedInPlayerAsync(playerId: string): Promise<IPlayerDto | null>;
}