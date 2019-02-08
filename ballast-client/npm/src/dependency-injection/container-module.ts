import { BallastCoreContainerModule, IChatService, IGameService, ISignInService, TYPES as BallastCore } from "ballast-core";
import { ContainerModule, interfaces } from "inversify";
import { SignalRClientChatService } from "../signalr/signalr-client-chat-service";
import { SignalRClientGameService } from "../signalr/signalr-client-game-service";
import { SignalRClientSignInService } from "../signalr/signalr-client-sign-in-service";
import { BallastClientOptions, IBallastClientOptions } from "./options";

type ConfigureOptions = (options: IBallastClientOptions) => void;

export class BallastClientContainerModule extends ContainerModule { 

    public constructor(configureOptions?: ConfigureOptions) {
        super(BallastClientContainerModule.createBindingMethod(configureOptions));
    }

    public static createBindingMethod(configureOptions?: ConfigureOptions) {
        return (bind: interfaces.Bind) => {

            // Create new options instance
            let ballastClientOptions = new BallastClientOptions();
            configureOptions && configureOptions(ballastClientOptions);

            // Configure as client
            BallastCoreContainerModule.createBindingMethod(options => {
                options.useDomain = false;
                options.useLocalEventBus = true;
            })(bind);
            
            // SignalR Client service implementations
            if (ballastClientOptions.useSignalR) {
                bind<IChatService>(BallastCore.Application.Services.IChatService)
                    .to(SignalRClientChatService)
                    .inSingletonScope();
                bind<IGameService>(BallastCore.Application.Services.IGameService)
                    .to(SignalRClientGameService)
                    .inSingletonScope();
                bind<ISignInService>(BallastCore.Application.Services.ISignInService)
                    .to(SignalRClientSignInService)
                    .inSingletonScope();
            }

        };
    }

}