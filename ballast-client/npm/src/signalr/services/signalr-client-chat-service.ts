import { IChatMessage, IChatService } from "ballast-core";
import { inject, injectable } from "inversify";
import { TYPES as BallastClient } from "../../dependency-injection/types";
import { SignalRClientServiceBase } from "../signalr-client-service-base";
import { ISignalRClientOptions } from "../signalr-client-options";

@injectable()
export class SignalRClientChatService extends SignalRClientServiceBase implements IChatService {

    public static readonly hubName: string = "chathub";
    public get hubName() {
        return SignalRClientChatService.hubName;
    }

    public constructor(
        @inject(BallastClient.SignalR.ISignalRClientOptions) serviceOptions: ISignalRClientOptions
    ) {
        super(serviceOptions);
    }

    public async sendMessageAsync(message: IChatMessage): Promise<void> {
        await this.createInvocationAsync('sendMessageAsync', message);
    }    

}