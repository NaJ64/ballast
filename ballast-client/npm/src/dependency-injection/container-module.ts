import { BallastCoreContainerModule, IChatService, IGameService, ISignInService, TYPES as BallastCore } from "ballast-core";
import { ContainerModule, interfaces } from "inversify";
import { IClientBootstrapper } from "../client-bootstrapper";
import { SignalRClientChatService } from "../signalr/services/signalr-client-chat-service";
import { SignalRClientGameService } from "../signalr/services/signalr-client-game-service";
import { SignalRClientSignInService } from "../signalr/services/signalr-client-sign-in-service";
import { SignalRClientBootstrapper } from "../signalr/signalr-client-bootstrapper";
import { ISignalRClientEventSubscriber, SignalRClientEventSubscriber } from "../signalr/signalr-client-event-subscriber";
import { ISignalRClientOptions, SignalRClientOptions } from "../signalr/signalr-client-options";
import { BallastClientOptions, IBallastClientOptions } from "./options";
import { TYPES as BallastClient } from "./types";

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

            // IBallastClientOptions
            bind<IBallastClientOptions>(BallastClient.DependencyInjection.IBallastClientOptions)
                .toConstantValue(ballastClientOptions);

            // Configure as client
            BallastCoreContainerModule.createBindingMethod(options => {
                options.useDomain = false;
                options.useLocalEventBus = true;
            })(bind);
            
            // SignalR Client service implementations
            if (ballastClientOptions.useSignalR) {
                if (!ballastClientOptions.serverUrl) {
                    throw new Error("ServerUrl option is required if using SignalR");
                }
                if (!ballastClientOptions.clientId) {
                    throw new Error("ClientId option is required if using SignalR");
                }
                bind<ISignalRClientOptions>(BallastClient.SignalR.ISignalRClientOptions)
                    .toConstantValue(new SignalRClientOptions(ballastClientOptions.serverUrl, ballastClientOptions.clientId));
                bind<ISignalRClientEventSubscriber>(BallastClient.SignalR.ISignalRClientEventSubscriber)
                    .to(SignalRClientEventSubscriber)
                    .inSingletonScope();
                bind<IChatService>(BallastCore.Application.Services.IChatService)
                    .to(SignalRClientChatService)
                    .inSingletonScope();
                bind<IGameService>(BallastCore.Application.Services.IGameService)
                    .to(SignalRClientGameService)
                    .inSingletonScope();
                bind<ISignInService>(BallastCore.Application.Services.ISignInService)
                    .to(SignalRClientSignInService)
                    .inSingletonScope();
                bind<IClientBootstrapper>(BallastClient.IClientBootstrapper)
                    .to(SignalRClientBootstrapper)
                    .inSingletonScope();
            }

        };
    }

}