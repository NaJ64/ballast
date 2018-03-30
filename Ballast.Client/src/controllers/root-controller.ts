import { injectable, inject } from 'inversify';
import { TYPES_BALLAST } from '../ioc';
import { ControllerBase } from './controller-base';
import { IChatView, IGameView, IHudView, IMenuView, ISignInView } from '../views';
import { IEventBus, GameViewLoadedEvent } from '../messaging';

@injectable()
export class RootController {

    public constructor(
        @inject(TYPES_BALLAST.IEventBus) protected readonly eventBus: IEventBus,
        @inject(TYPES_BALLAST.IChatViewFactory) protected readonly chatViewFactory: () => IChatView,
        @inject(TYPES_BALLAST.IGameViewFactory) protected readonly gameViewFactory: () => IGameView,
        @inject(TYPES_BALLAST.IHudViewFactory) protected readonly hudViewFactory: () => IHudView,
        @inject(TYPES_BALLAST.IMenuViewFactory) protected readonly menuViewFactory: () => IMenuView,
        @inject(TYPES_BALLAST.ISignInViewFactory) protected readonly signInViewFactory: () => ISignInView,
    ) { 
        this.subscribeAllViewEvents();
    }

    private subscribeAllViewEvents() {
        this.eventBus.subscribe<GameViewLoadedEvent>(GameViewLoadedEvent.eventId, event => {
            console.log('Game view was loaded');
        });
    }

}