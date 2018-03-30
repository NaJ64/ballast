import { Container } from 'inversify';
import { TYPES_BALLAST } from './types';
import { BallastBootstrapper, BallastClientContext, BallastClient, BallastViewport } from '../app';
import { ChatController, GameController, HudController, MenuController, RootController, SignInController } from '../controllers';
import { IEventBus, EventBus } from '../messaging';
import { IChatView, IGameView, IHudView, IMenuView, ISignInView } from '../views';
import { ChatView, GameView, HudView, MenuView, SignInView } from '../views';

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
        .to(ChatView)
        .inTransientScope();
    container.bind<() => IGameView>(TYPES_BALLAST.IGameViewFactory)
        .toFactory(context => () => context.container.get<IGameView>(TYPES_BALLAST.IGameView));
    container.bind<IHudView>(TYPES_BALLAST.IHudView)
        .to(ChatView)
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
