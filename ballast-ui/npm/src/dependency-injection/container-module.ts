import { ContainerModule, interfaces } from "inversify";
import { BallastUiOptions, IBallastUiOptions } from "./options";
import { TYPES as BallastClient } from "./types";
import { BallastClientContainerModule } from "ballast-client";

type ConfigureOptions = (options: IBallastUiOptions) => void;

export class BallastUiContainerModule extends ContainerModule { 

    public constructor(configureOptions?: ConfigureOptions) {
        super(BallastUiContainerModule.createBindingMethod(configureOptions));
    }

    public static createBindingMethod(configureOptions?: ConfigureOptions) {
        return (bind: interfaces.Bind) => {

            // Create new options instance
            let ballastUiOptions = new BallastUiOptions();
            configureOptions && configureOptions(ballastUiOptions);

            // IBallastUiOptions
            bind<IBallastUiOptions>(BallastClient.DependencyInjection.IBallastUiOptions)
                .toConstantValue(ballastUiOptions);

            // Configure client container module
            BallastClientContainerModule.createBindingMethod(options => {
                options.clientId = ballastUiOptions.clientId;
                options.serverUrl = ballastUiOptions.serverUrl;
                options.useSignalR = true;
            })(bind);
            
        };
    }

}