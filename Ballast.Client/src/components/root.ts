import { injectable, inject } from 'inversify';
import { TYPES_BALLAST } from '../ioc/types';
import { BallastViewport } from '../app/ballast-viewport';
import { IEventBus } from '../messaging/event-bus';
import { RenderingContext } from '../rendering/rendering-context';
import { ComponentBase } from './component-base';
import { CameraComponent } from './camera';
import { ChatComponent } from './chat';
import { GameComponent } from './game';
import { PerspectiveTracker } from '../input/perspective-tracker';

@injectable()
export class RootComponent extends ComponentBase {

    private readonly camera: CameraComponent;
    private readonly chat: ChatComponent;
    private readonly game: GameComponent;

    public constructor(
        @inject(TYPES_BALLAST.BallastViewport) viewport: BallastViewport,
        @inject(TYPES_BALLAST.IEventBus) eventBus: IEventBus,
        @inject(TYPES_BALLAST.PerspectiveTracker) perspectiveTracker: PerspectiveTracker,
        @inject(TYPES_BALLAST.CameraComponentFactory) cameraFactory: () => CameraComponent,
        @inject(TYPES_BALLAST.ChatComponentFactory) chatFactory: () => ChatComponent,
        @inject(TYPES_BALLAST.GameComponentFactory) gameFactory: () => GameComponent
    ) {
        super(viewport, eventBus, perspectiveTracker);
        this.camera = cameraFactory();
        this.chat = chatFactory();
        this.game = gameFactory();
    }

    protected onAttach(parent: HTMLElement) {
        this.chat.attach(parent);
        this.camera.attach(parent);
        this.game.attach(parent);
    }
    
    protected onDetach(parent: HTMLElement) {
        this.camera.detach();
        this.chat.detach();
        this.game.detach();
    }

    protected render(parent: HTMLElement, renderingContext: RenderingContext) { }

}