import { IPlayerDto, IPlayerSignInRequest, IPlayerSignOutRequest, ISignInService } from "ballast-core";
import { inject, injectable } from "inversify";
import { TYPES as BallastClient } from "../../dependency-injection/types";
import { SignalRClientServiceBase } from "../signalr-client-service-base";
import { ISignalRClientServiceOptions } from "../signalr-client-service-options";

@injectable()
export class SignalRClientSignInService extends SignalRClientServiceBase implements ISignInService {

    public static readonly hubName: string = "signinhub";
    public get hubName() {
        return SignalRClientSignInService.hubName;
    }

    public constructor(
        @inject(BallastClient.SignalR.ISignalRServiceOptionsFactory) optionsFactory: () => ISignalRClientServiceOptions
    ) {
        super(optionsFactory);
    }

    public async signInAsync(request: IPlayerSignInRequest): Promise<IPlayerDto> {
        return await this.createInvocationAsync<IPlayerDto>('signInAsync', request);
    }    

    public async signOutAsync(request: IPlayerSignOutRequest): Promise<void> {
        await this.createInvocationAsync('signOutAsync', request);
    }

    public async getSignedInPlayerAsync(playerId: string): Promise<IPlayerDto | null> {
        return await this.createInvocationAsync<IPlayerDto | null>('getSignedInPlayerAsync', playerId);
    }

}