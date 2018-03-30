import { BallastViewport } from '../app/ballast-viewport';
import { IChatView } from '../views/abstractions/ichat-view';
import { IGameView } from '../views/abstractions/igame-view';
import { IHudView } from '../views/abstractions/ihud-view';
import { IMenuView } from '../views/abstractions/imenu-view';
import { ISignInView } from '../views/abstractions/isign-in-view';
import { IEventBus } from '../messaging/ievent-bus';
export declare class RootController {
    protected readonly root: HTMLElement;
    protected readonly eventBus: IEventBus;
    protected readonly chatViewFactory: () => IChatView;
    protected readonly gameViewFactory: () => IGameView;
    protected readonly hudViewFactory: () => IHudView;
    protected readonly menuViewFactory: () => IMenuView;
    protected readonly signInViewFactory: () => ISignInView;
    constructor(viewport: BallastViewport, eventBus: IEventBus, chatViewFactory: () => IChatView, gameViewFactory: () => IGameView, hudViewFactory: () => IHudView, menuViewFactory: () => IMenuView, signInViewFactory: () => ISignInView);
    activateAllViewsAsync(): Promise<void>;
    private subscribeAllViewEvents();
}
