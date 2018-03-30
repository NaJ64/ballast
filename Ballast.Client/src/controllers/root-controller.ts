import { injectable, inject } from 'inversify';
import { TYPES_BALLAST } from '../ioc';
import { BallastViewport } from '../app/ballast-viewport';
import { ControllerBase } from './controller-base';
import { IChatView } from '../views/abstractions/ichat-view';
import { IGameView } from '../views/abstractions/igame-view';
import { IHudView } from '../views/abstractions/ihud-view';
import { IMenuView } from '../views/abstractions/imenu-view';
import { ISignInView } from '../views/abstractions/isign-in-view';
import { IEventBus } from '../messaging/ievent-bus';
import { GameViewLoadedEvent } from '../messaging/events/views/game-view-loaded';

@injectable()
export class RootController {

    protected readonly root: HTMLElement;
    protected readonly eventBus: IEventBus;
    protected readonly chatViewFactory: () => IChatView;
    protected readonly gameViewFactory: () => IGameView;
    protected readonly hudViewFactory: () => IHudView;
    protected readonly menuViewFactory: () => IMenuView;
    protected readonly signInViewFactory: () => ISignInView;

    public constructor(
        @inject(TYPES_BALLAST.BallastViewport) viewport: BallastViewport,
        @inject(TYPES_BALLAST.IEventBus) eventBus: IEventBus,
        @inject(TYPES_BALLAST.IChatViewFactory) chatViewFactory: () => IChatView,
        @inject(TYPES_BALLAST.IGameViewFactory) gameViewFactory: () => IGameView,
        @inject(TYPES_BALLAST.IHudViewFactory) hudViewFactory: () => IHudView,
        @inject(TYPES_BALLAST.IMenuViewFactory) menuViewFactory: () => IMenuView,
        @inject(TYPES_BALLAST.ISignInViewFactory) signInViewFactory: () => ISignInView,
    ) { 
        this.root = viewport.getRoot();
        this.eventBus = eventBus;
        this.chatViewFactory = chatViewFactory;
        this.gameViewFactory = gameViewFactory;
        this.hudViewFactory = hudViewFactory;
        this.menuViewFactory = menuViewFactory;
        this.signInViewFactory = signInViewFactory;
        this.subscribeAllViewEvents();
    }

    public async activateAllViewsAsync(): Promise<void> {
        let gameView = this.gameViewFactory()
        gameView.attach(this.root);
        gameView.show();
    }

    private subscribeAllViewEvents() {
        this.eventBus.subscribe<GameViewLoadedEvent>(GameViewLoadedEvent.eventId, event => {
            console.log('Game view was loaded');
        });
    }

}