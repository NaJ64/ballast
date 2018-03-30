import { Container } from 'inversify';
import { TYPES_BALLAST } from './types';
import { BallastBootstrapper } from '../app/ballast-bootstrapper';
import { BallastClientContext } from '../app/ballast-client-context';
import { BallastClient } from '../app/ballast-client';
import { BallastViewport } from '../app/ballast-viewport';
import { ChatController } from '../controllers/chat-controller';
import { GameController } from '../controllers/game-controller';
import { HudController } from '../controllers/hud-controller';
import { MenuController } from '../controllers/menu-controller';
import { RootController } from '../controllers/root-controller';
import { SignInController } from '../controllers/sign-in-controller';
import { EventBus } from '../messaging/event-bus';
import { IEventBus } from '../messaging/ievent-bus';
import { IChatView } from '../views/abstractions/ichat-view';
import { IGameView } from '../views/abstractions/igame-view';
import { IHudView } from '../views/abstractions/ihud-view';
import { IMenuView } from '../views/abstractions/imenu-view';
import { ISignInView } from '../views/abstractions/isign-in-view';
import { ChatView } from '../views/chat-view';
import { GameView } from '../views/game-view';
import { HudView } from '../views/hud-view';
import { MenuView } from '../views/menu-view';
import { SignInView } from '../views/sign-in-view';

export function configureServices(container: Container, client: BallastClient): Container {
    configureApp(container, client);
    configureControllers(container);
    configureMessaging(container);
    configureViews(container);
    return container;
}

function configureApp(container: Container, client: BallastClient): Container {
    var clientContext = new BallastClientContext(client)
    container.bind<BallastBootstrapper>(TYPES_BALLAST.BallastBootstrapper)
        .to(BallastBootstrapper)
        .inSingletonScope();
    container.bind<BallastClientContext>(TYPES_BALLAST.BallastClientContext)
        .toConstantValue(clientContext);
    container.bind<BallastClient>(TYPES_BALLAST.BallastClient)
        .toConstantValue(clientContext.client);
    container.bind<BallastViewport>(TYPES_BALLAST.BallastViewport)
        .toConstantValue(clientContext.client.getViewport());
    return container;
}

function configureControllers(container: Container): Container {
    container.bind<ChatController>(TYPES_BALLAST.ChatController)
        .to(ChatController)
        .inTransientScope();
    container.bind<GameController>(TYPES_BALLAST.GameController)
        .to(GameController)
        .inTransientScope();
    container.bind<HudController>(TYPES_BALLAST.HudController)
        .to(HudController)
        .inTransientScope();
    container.bind<MenuController>(TYPES_BALLAST.MenuController)
        .to(MenuController)
        .inTransientScope();
    container.bind<RootController>(TYPES_BALLAST.RootController)
        .to(RootController)
        .inSingletonScope(); // Singleton scope
    container.bind<SignInController>(TYPES_BALLAST.SignInController)
        .to(SignInController)
        .inTransientScope();
    return container;
}

function configureMessaging(container: Container): Container {
    container.bind<IEventBus>(TYPES_BALLAST.IEventBus)
        .to(EventBus)
        .inSingletonScope();
    return container;
}

function configureViews(container: Container): Container {
    container.bind<IChatView>(TYPES_BALLAST.IChatView)
        .to(ChatView)
        .inTransientScope();
    container.bind<() => IChatView>(TYPES_BALLAST.IChatViewFactory)
        .toFactory(context => () => context.container.get<IChatView>(TYPES_BALLAST.IChatView));
    container.bind<IGameView>(TYPES_BALLAST.IGameView)
        .to(GameView)
        .inTransientScope();
    container.bind<() => IGameView>(TYPES_BALLAST.IGameViewFactory)
        .toFactory(context => () => context.container.get<IGameView>(TYPES_BALLAST.IGameView));
    container.bind<IHudView>(TYPES_BALLAST.IHudView)
        .to(HudView)
        .inTransientScope();
    container.bind<() => IHudView>(TYPES_BALLAST.IHudViewFactory)
        .toFactory(context => () => context.container.get<IHudView>(TYPES_BALLAST.IHudView));
    container.bind<IMenuView>(TYPES_BALLAST.IMenuView)
        .to(MenuView)
        .inTransientScope();
    container.bind<() => IMenuView>(TYPES_BALLAST.IMenuViewFactory)
        .toFactory(context => () => context.container.get<IMenuView>(TYPES_BALLAST.IMenuView));
    container.bind<ISignInView>(TYPES_BALLAST.ISignInView)
        .to(SignInView)
        .inTransientScope();
    container.bind<() => ISignInView>(TYPES_BALLAST.ISignInViewFactory)
        .toFactory(context => () => context.container.get<IMenuView>(TYPES_BALLAST.ISignInView));
    return container;
}
