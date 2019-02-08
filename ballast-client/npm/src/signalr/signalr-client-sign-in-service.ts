import { IPlayerDto, IPlayerSignInRequest, IPlayerSignOutRequest, ISignInService } from "ballast-core";

export class SignalRClientSignInService implements ISignInService {
    dispose(): void {
        throw new Error("Method not implemented.");
    }
    signInAsync(request: IPlayerSignInRequest): Promise<IPlayerDto> {
        throw new Error("Method not implemented.");
    }    
    signOutAsync(request: IPlayerSignOutRequest): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getSignedInPlayerAsync(playerId: string): Promise<IPlayerDto | null> {
        throw new Error("Method not implemented.");
    }
}