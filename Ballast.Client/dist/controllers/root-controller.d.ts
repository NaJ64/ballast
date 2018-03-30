import { IChatView, IGameView, IHudView, IMenuView, ISignInView } from '../views';
import { IEventBus } from '../messaging';
export declare class RootController {
    protected readonly eventBus: IEventBus;
    protected readonly chatViewFactory: () => IChatView;
    protected readonly gameViewFactory: () => IGameView;
    protected readonly hudViewFactory: () => IHudView;
    protected readonly menuViewFactory: () => IMenuView;
    protected readonly signInViewFactory: () => ISignInView;
    constructor(eventBus: IEventBus, chatViewFactory: () => IChatView, gameViewFactory: () => IGameView, hudViewFactory: () => IHudView, menuViewFactory: () => IMenuView, signInViewFactory: () => ISignInView);
    private subscribeAllViewEvents();
}
