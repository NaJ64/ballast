import { IPlayerDto } from "../../models/player-dto";
import { IPlayerSignInRequest } from "../../models/player-sign-in-request";
import { IPlayerSignOutRequest } from "../../models/player-sign-out-request";
import { ISignInService } from "../sign-in-service";

export class DomainSignInService implements ISignInService {

    public signInAsync(request: IPlayerSignInRequest): Promise<IPlayerDto> {
        throw new Error("Method not implemented.");
    }    

    public signOutAsync(request: IPlayerSignOutRequest): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public getSignedInPlayerAsync(playerId: string): Promise<IPlayerDto | null> {
        throw new Error("Method not implemented.");
    }

    public dispose(): void {
        throw new Error("Method not implemented.");
    }
}