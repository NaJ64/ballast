import { ContainerModule, interfaces } from "inversify";
import { IChatService } from "../application/services/chat-service";
import { IGameService } from "../application/services/game-service";
import { DomainChatService } from "../application/services/impl/domain-chat-service";
import { DomainGameService } from "../application/services/impl/domain-game-service";
import { DomainSignInService } from "../application/services/impl/domain-sign-in-service";
import { ISignInService } from "../application/services/sign-in-service";
import { BoardGenerator, IBoardGenerator } from "../domain/services/board-generator";
import { IEventBus } from "../messaging/event-bus";
import { LocalEventBus } from "../messaging/impl/local-event-bus";
import { BallastCoreOptions, IBallastCoreOptions } from "./options";
import { TYPES as BallastCore } from "./types";

type ConfigureOptions = (options: IBallastCoreOptions) => void;

export class BallastCoreContainerModule extends ContainerModule { 

    public constructor(configureOptions?: ConfigureOptions) {
        super(BallastCoreContainerModule.createBindingMethod(configureOptions));
    }

    public static createBindingMethod(configureOptions?: ConfigureOptions) {
        return (bind: interfaces.Bind) => {

            // Create new options instance
            let ballastCoreOptions = new BallastCoreOptions();
            configureOptions && configureOptions(ballastCoreOptions);

            // IBallastCoreOptions
            bind<IBallastCoreOptions>(BallastCore.DependencyInjection.IBallastCoreOptions)
                .toConstantValue(ballastCoreOptions);
            
            // Local event bus
            if (ballastCoreOptions.useLocalEventBus) {
                bind<IEventBus>(BallastCore.Messaging.IEventBus)
                    .to(LocalEventBus)
                    .inSingletonScope();
            }

            // Domain service implementations
            if (ballastCoreOptions.useDomain) {
                bind<IBoardGenerator>(BallastCore.Domain.Services.IBoardGenerator)
                    .to(BoardGenerator)
                    .inTransientScope();
                bind<IChatService>(BallastCore.Application.Services.IChatService)
                    .to(DomainChatService)
                    .inSingletonScope();
                bind<IGameService>(BallastCore.Application.Services.IGameService)
                    .to(DomainGameService)
                    .inSingletonScope();
                bind<ISignInService>(BallastCore.Application.Services.ISignInService)
                    .to(DomainSignInService)
                    .inSingletonScope();
            }

        };
    }

}