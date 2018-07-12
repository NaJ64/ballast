import { IEventBus } from 'ballast-core';
import { inject, injectable } from 'inversify';
import { BallastViewport } from '../app/ballast-viewport';
import { PerspectiveTracker } from '../input/perspective-tracker';
import { TYPES_BALLAST } from '../ioc/types';
import { RenderingContext } from '../rendering/rendering-context';
import { CameraComponent } from './camera';
import { ChatComponent } from './chat';
import { ComponentBase } from './component-base';
import { GameComponent } from './game';
import { SignInComponent } from './sign-in';

@injectable()
export class RootComponent extends ComponentBase {

    private readonly camera: CameraComponent;
    private readonly chat: ChatComponent;
    private readonly game: GameComponent;
    private readonly signIn: SignInComponent

    public constructor(
        @inject(TYPES_BALLAST.BallastViewport) viewport: BallastViewport,
        @inject(TYPES_BALLAST.IEventBus) eventBus: IEventBus,
        @inject(TYPES_BALLAST.PerspectiveTracker) perspectiveTracker: PerspectiveTracker,
        @inject(TYPES_BALLAST.CameraComponentFactory) cameraFactory: () => CameraComponent,
        @inject(TYPES_BALLAST.ChatComponentFactory) chatFactory: () => ChatComponent,
        @inject(TYPES_BALLAST.GameComponentFactory) gameFactory: () => GameComponent,
        @inject(TYPES_BALLAST.SignInComponentFactory) signInFactory: () => SignInComponent,

    ) {
        super(viewport, eventBus, perspectiveTracker);
        this.camera = cameraFactory();
        this.chat = chatFactory();
        this.game = gameFactory();
        this.signIn = signInFactory();
    }

    protected onAttach(parent: HTMLElement) {
        this.signIn.attach(parent);
        this.chat.attach(parent);
        this.camera.attach(parent);
        this.game.attach(parent);
    }
    
    protected onDetach(parent: HTMLElement) {
        this.game.detach();
        this.camera.detach();
        this.chat.detach();
        this.signIn.detach();
    }

    protected render(parent: HTMLElement, renderingContext: RenderingContext) { }

}