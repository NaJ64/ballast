import { IPlayerDto, IPlayerSignInRequest, IPlayerSignOutRequest, ISignInService } from "ballast-core";
import { inject, injectable } from "inversify";
import { TYPES as BallastClient } from "../../dependency-injection/types";
import { ISignalRClientOptions } from "../signalr-client-options";
import { SignalRClientServiceBase } from "../signalr-client-service-base";

@injectable()
export class SignalRClientSignInService extends SignalRClientServiceBase implements ISignInService {

    public static readonly hubName: string = "signinhub";
    public get hubName() {
        return SignalRClientSignInService.hubName;
    }

    public constructor(
        @inject(BallastClient.SignalR.ISignalRClientOptions) serviceOptions: ISignalRClientOptions
    ) {
        super(serviceOptions);
    }

    public async signInAsync(request: IPlayerSignInRequest): Promise<IPlayerDto> {
        return await this.createInvocationAsync<IPlayerDto>('SignInAsync', request);
    }    

    public async signOutAsync(request: IPlayerSignOutRequest): Promise<void> {
        await this.createInvocationAsync('SignOutAsync', request);
    }

    public async getSignedInPlayerAsync(playerId: string): Promise<IPlayerDto | null> {
        return await this.createInvocationAsync<IPlayerDto | null>('GetSignedInPlayerAsync', playerId);
    }

}