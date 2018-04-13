import { injectable, inject } from 'inversify';
import { BoardGenerator, TileShape, BoardType } from 'ballast-core';
import * as uuid from 'uuid';
import { TYPES_BALLAST } from '../ioc/types';
import { ComponentBase } from './component-base';
import { RenderingContext } from '../rendering/rendering-context';
import { CameraComponent } from './camera';
import { GameComponent } from './game';
import { BallastViewport } from '../app/ballast-viewport';
import { IEventBus } from '../messaging/ievent-bus';

@injectable()
export class RootComponent extends ComponentBase {

    private readonly camera: CameraComponent;
    private readonly game: GameComponent;

    public constructor(
        @inject(TYPES_BALLAST.BallastViewport) viewport: BallastViewport,
        @inject(TYPES_BALLAST.IEventBus) eventBus: IEventBus,
        @inject(TYPES_BALLAST.CameraComponentFactory) cameraFactory: () => CameraComponent,
        @inject(TYPES_BALLAST.GameComponentFactory) gameFactory: () => GameComponent
    ) {
        super(viewport, eventBus);
        this.camera = cameraFactory();
        this.game = gameFactory();
    }

    protected onAttach(parent: HTMLElement) {
        this.game.attach(parent);
        this.camera.attach(parent);

        this.test();

    }
    
    protected onDetach(parent: HTMLElement) {
        this.camera.detach();
        this.game.detach();
    }

    protected render(parent: HTMLElement, renderingContext: RenderingContext) { }

    private test() {
        
    }

}