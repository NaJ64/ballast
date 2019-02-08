import { IChatMessage, IChatService } from "ballast-core";
import { inject, injectable } from "inversify";
import { TYPES as BallastClient } from "../../dependency-injection/types";
import { SignalRClientServiceBase } from "../signalr-client-service-base";
import { ISignalRClientServiceOptions } from "../signalr-client-service-options";

@injectable()
export class SignalRClientChatService extends SignalRClientServiceBase implements IChatService {

    public static readonly hubName: string = "chathub";
    public get hubName() {
        return SignalRClientChatService.hubName;
    }

    public constructor(
        @inject(BallastClient.SignalR.ISignalRServiceOptionsFactory) serviceOptionsFactory: () => ISignalRClientServiceOptions
    ) {
        super(serviceOptionsFactory);
    }

    public async sendMessageAsync(message: IChatMessage): Promise<void> {
        await this.createInvocationAsync('sendMessageAsync', message);
    }    

}