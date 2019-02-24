import { BallastClientContainerModule } from "ballast-client";
import { ContainerModule, interfaces } from "inversify";
import { BallastAppState, IBallastAppState } from "../app-state";
import { KeyboardWatcher } from "../input/keyboard-watcher";
import { IVesselCompass } from "../input/vessel-compass";
import { CameraTracker } from "../rendering/camera-tracker";
import { BoardComponent } from "../rendering/components/board";
import { CameraComponent } from "../rendering/components/camera";
import { ChatComponent } from "../rendering/components/chat";
import { GameComponent } from "../rendering/components/game";
import { NavigationComponent } from "../rendering/components/navigation";
import { RootComponent } from "../rendering/components/root";
import { SignInComponent } from "../rendering/components/sign-in";
import { WorldComponent } from "../rendering/components/world";
import { IRenderer, Renderer } from "../rendering/renderer";
import { IRenderingContext, RenderingContext } from "../rendering/rendering-context";
import { BallastUiOptions, IBallastUiOptions } from "./options";
import { TYPES as BallastUi } from "./types";

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

            // Validate options
            if (!ballastUiOptions.clientId) {
                throw new Error("No clientId was provided for service registration");
            }
            if (!ballastUiOptions.serverUrl) {
                throw new Error("No serverUrl was provided for service registration");
            }
            if (!ballastUiOptions.host) {
                throw new Error("No host element was provided for service registration");
            }

            // Configure client container module
            BallastClientContainerModule.createBindingMethod(options => {
                options.clientId = ballastUiOptions.clientId;
                options.serverUrl = ballastUiOptions.serverUrl;
                options.useSignalR = true;
            })(bind);

            // IBallastAppState
            bind<IBallastAppState>(BallastUi.IBallastAppState)
                .to(BallastAppState)
                .inSingletonScope();
            
            // IBallastUiOptions
            bind<IBallastUiOptions>(BallastUi.DependencyInjection.IBallastUiOptions)
                .toConstantValue(ballastUiOptions);

            // KeyboardWatcher
            bind<KeyboardWatcher>(BallastUi.Input.KeyboardWatcher)
                .toConstantValue(new KeyboardWatcher(ballastUiOptions.host.ownerDocument!));

            // IVesselCompass 
            bind<IVesselCompass>(BallastUi.Input.IVesselCompass)
                .toService(BallastUi.Rendering.CameraTracker);

            // CameraTracker
            bind<CameraTracker>(BallastUi.Rendering.CameraTracker)
                .toDynamicValue(ctx => ctx.container.get<IRenderingContext>(BallastUi.Rendering.IRenderingContext)
                    .cameraTracker
                ).inSingletonScope();

            // Components
            bind<BoardComponent>(BallastUi.Rendering.Components.BoardComponent)
                .to(BoardComponent)
                .inSingletonScope();
            bind<CameraComponent>(BallastUi.Rendering.Components.CameraComponent)
                .to(CameraComponent)
                .inSingletonScope();
            bind<ChatComponent>(BallastUi.Rendering.Components.ChatComponent)
                .to(ChatComponent)
                .inSingletonScope();
            bind<GameComponent>(BallastUi.Rendering.Components.GameComponent)
                .to(GameComponent)
                .inSingletonScope();
            bind<NavigationComponent>(BallastUi.Rendering.Components.NavigationComponent)
                .to(NavigationComponent)
                .inSingletonScope();
            bind<RootComponent>(BallastUi.Rendering.Components.RootComponent)
                .to(RootComponent)
                .inSingletonScope();
            bind<SignInComponent>(BallastUi.Rendering.Components.SignInComponent)
                .to(SignInComponent)
                .inSingletonScope();
            bind<WorldComponent>(BallastUi.Rendering.Components.WorldComponent)
                .to(WorldComponent)
                .inSingletonScope();

            // IRenderer
            bind<IRenderer>(BallastUi.Rendering.IRenderer)
                .toDynamicValue(ctx => {
                    let keyboardWatcher = ctx.container.get<KeyboardWatcher>(BallastUi.Input.KeyboardWatcher);
                    let appState = ctx.container.get<IBallastAppState>(BallastUi.IBallastAppState);
                    let renderingContextFactory = {
                        create: (canvas: HTMLCanvasElement, gameStyle: HTMLStyleElement) => 
                            new RenderingContext(canvas, gameStyle, keyboardWatcher, appState)
                    };
                    let rootComponentFactory = {
                        create: () => ctx.container.get<RootComponent>(BallastUi.Rendering.Components.RootComponent)
                    };
                    return new Renderer(
                        ballastUiOptions.host!, 
                        ballastUiOptions.clientId!, 
                        renderingContextFactory, 
                        rootComponentFactory
                    );
                }).inSingletonScope();
            
            // IRenderingContext
            bind<IRenderingContext>(BallastUi.Rendering.IRenderingContext)
                .toDynamicValue(ctx => ctx.container
                    .get<IRenderer>(BallastUi.Rendering.IRenderer)
                    .renderingContext
                ).inSingletonScope();
            
        };
    }

}