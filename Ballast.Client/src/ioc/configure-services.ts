import { Container } from 'inversify';
import { TYPES_BALLAST } from './types';
import { BallastBootstrapper } from '../app/ballast-bootstrapper';
import { BallastClient } from '../app/ballast-client';
import { BallastViewport } from '../app/ballast-viewport';
import { EventBus } from '../messaging/event-bus';
import { IEventBus } from '../messaging/ievent-bus';
import { BoardComponent } from '../components/board';
import { CameraComponent } from '../components/camera';
import { ChatComponent } from '../components/chat';
import { GameComponent } from '../components/game';
import { HudComponent } from '../components/hud';
import { MenuComponent} from '../components/menu';
import { RootComponent } from '../components/root';
import { SignInComponent } from '../components/sign-in';
import { RenderingContext } from '../rendering/rendering-context';
import { KeyboardWatcher } from '../input/keyboard-watcher';
import { PerspectiveTracker } from '../input/perspective-tracker';

export function configureServices(container: Container, client: BallastClient): Container {
    configureApp(container, client);
    configureComponents(container);
    configureInput(container);
    configureMessaging(container);
    configureRendering(container, client);
    return container;
}

function configureApp(container: Container, client: BallastClient): Container {
    container.bind<BallastBootstrapper>(TYPES_BALLAST.BallastBootstrapper)
        .to(BallastBootstrapper)
        .inSingletonScope();
    container.bind<BallastClient>(TYPES_BALLAST.BallastClient)
        .toConstantValue(client);
    container.bind<BallastViewport>(TYPES_BALLAST.BallastViewport)
        .toDynamicValue(context => client.getViewport());
    return container;
}

function configureComponents(container: Container): Container {
    // BoardComponent
    container.bind<BoardComponent>(TYPES_BALLAST.BoardComponent)
        .to(BoardComponent)
        .inTransientScope();
    container.bind<() => BoardComponent>(TYPES_BALLAST.BoardComponentFactory)
        .toFactory(context => () => context.container.get<BoardComponent>(TYPES_BALLAST.BoardComponent));
    // CameraComponent
    container.bind<CameraComponent>(TYPES_BALLAST.CameraComponent)
        .to(CameraComponent)
        .inTransientScope();
    container.bind<() => CameraComponent>(TYPES_BALLAST.CameraComponentFactory)
        .toFactory(context => () => context.container.get<CameraComponent>(TYPES_BALLAST.CameraComponent));
    // ChatComponent
    container.bind<ChatComponent>(TYPES_BALLAST.ChatComponent)
        .to(ChatComponent)
        .inTransientScope();
    container.bind<() => ChatComponent>(TYPES_BALLAST.ChatComponentFactory)
        .toFactory(context => () => context.container.get<ChatComponent>(TYPES_BALLAST.ChatComponent));
    // GameComponent
    container.bind<GameComponent>(TYPES_BALLAST.GameComponent)
        .to(GameComponent)
        .inTransientScope();
    container.bind<() => GameComponent>(TYPES_BALLAST.GameComponentFactory)
        .toFactory(context => () => context.container.get<GameComponent>(TYPES_BALLAST.GameComponent));
    // HudComponent
    container.bind<HudComponent>(TYPES_BALLAST.HudComponent)
        .to(HudComponent)
        .inTransientScope();
    container.bind<() => HudComponent>(TYPES_BALLAST.HudComponentFactory)
        .toFactory(context => () => context.container.get<HudComponent>(TYPES_BALLAST.HudComponent));
    // MenuComponent
    container.bind<MenuComponent>(TYPES_BALLAST.MenuComponent)
        .to(MenuComponent)
        .inTransientScope();
    container.bind<() => MenuComponent>(TYPES_BALLAST.MenuComponentFactory)
        .toFactory(context => () => context.container.get<MenuComponent>(TYPES_BALLAST.MenuComponent));
    // RootComponent
    container.bind<RootComponent>(TYPES_BALLAST.RootComponent)
        .to(RootComponent)
        .inTransientScope();
    container.bind<() => RootComponent>(TYPES_BALLAST.RootComponentFactory)
        .toFactory(context => () => context.container.get<RootComponent>(TYPES_BALLAST.RootComponent));
    // SignInComponent
    container.bind<SignInComponent>(TYPES_BALLAST.SignInComponent)
        .to(SignInComponent)
        .inTransientScope();
    container.bind<() => SignInComponent>(TYPES_BALLAST.SignInComponentFactory)
        .toFactory(context => () => context.container.get<SignInComponent>(TYPES_BALLAST.SignInComponent));
    return container;
}

function configureInput(container: Container): Container {
    container.bind<KeyboardWatcher>(TYPES_BALLAST.KeyboardWatcher)
        .toDynamicValue(context => context.container.get<RenderingContext>(TYPES_BALLAST.RenderingContext)
            .keyboard
        );
    container.bind<PerspectiveTracker>(TYPES_BALLAST.PerspectiveTracker)
        .to(PerspectiveTracker)
        .inTransientScope();
    return container;
}


function configureMessaging(container: Container): Container {
    container.bind<IEventBus>(TYPES_BALLAST.IEventBus)
        .to(EventBus)
        .inSingletonScope();
    return container;
}

function configureRendering(container: Container, client: BallastClient): Container {
    container.bind<RenderingContext>(TYPES_BALLAST.RenderingContext)
        .toDynamicValue(context => client.getViewport().getRenderingContext());
    return container;
}