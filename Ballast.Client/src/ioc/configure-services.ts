import { Container } from 'inversify';
import { TYPES_BALLAST } from './types';
import { BallastBootstrapper } from '../app/ballast-bootstrapper';
import { BallastClient } from '../app/ballast-client';
import { BallastViewport } from '../app/ballast-viewport';
import { EventBus } from '../messaging/event-bus';
import { IEventBus } from '../messaging/ievent-bus';
import { ChatComponent } from '../components/chat';
import { GameComponent } from '../components/game';
import { HudComponent } from '../components/hud';
import { MenuComponent} from '../components/menu';
import { RootComponent } from '../components/root';
import { SignInComponent } from '../components/sign-in';

export function configureServices(container: Container, client: BallastClient): Container {
    configureApp(container, client);
    configureMessaging(container);
    configureComponents(container);
    return container;
}

function configureApp(container: Container, client: BallastClient): Container {
    container.bind<BallastBootstrapper>(TYPES_BALLAST.BallastBootstrapper)
        .to(BallastBootstrapper)
        .inSingletonScope();
    container.bind<BallastClient>(TYPES_BALLAST.BallastClient)
        .toConstantValue(client);
    container.bind<BallastViewport>(TYPES_BALLAST.BallastViewport)
        .toConstantValue(client.getViewport());
    return container;
}

function configureComponents(container: Container): Container {
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

function configureMessaging(container: Container): Container {
    container.bind<IEventBus>(TYPES_BALLAST.IEventBus)
        .to(EventBus)
        .inSingletonScope();
    return container;
}

