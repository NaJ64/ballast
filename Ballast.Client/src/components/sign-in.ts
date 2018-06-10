import { injectable, inject } from 'inversify';
import { RenderingContext } from '../rendering/rendering-context';
import { ComponentBase } from './component-base';
import { TYPES_BALLAST } from '../ioc/types';
import { BallastViewport } from '../app/ballast-viewport';
import { IEventBus } from 'ballast-core';
import { PerspectiveTracker } from '../input/perspective-tracker';
import { ISignInClientService } from '../services/sign-in-client-service';

@injectable()
export class SignInComponent extends ComponentBase {

    protected readonly signInClientService: ISignInClientService;

    public constructor(
        @inject(TYPES_BALLAST.BallastViewport) viewport: BallastViewport,
        @inject(TYPES_BALLAST.IEventBus) eventBus: IEventBus,
        @inject(TYPES_BALLAST.PerspectiveTracker) perspectiveTracker: PerspectiveTracker,
        @inject(TYPES_BALLAST.ISignInClientService) signInClientService: ISignInClientService) {

        super(viewport, eventBus, perspectiveTracker);
        this.signInClientService = signInClientService;

    }
    
    protected render(parent: HTMLElement, renderingContext: RenderingContext) { }

}