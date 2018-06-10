import { injectable, inject } from 'inversify';
import { RenderingContext } from '../rendering/rendering-context';
import { ComponentBase } from './component-base';
import { TYPES_BALLAST } from '../ioc/types';
import { BallastViewport } from '../app/ballast-viewport';
import { IEventBus, IPlayerSignInRequest, IPlayerSignOutRequest, getUtcNow } from 'ballast-core';
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

    protected onAttach(parent: HTMLElement, renderingContext: RenderingContext) {
        
        // Connect to the sign-in service/hub and initiate sign in
        this.connectAndSignInAsync() // Fire and forget
        
    }
    
    protected onDetach(parent: HTMLElement, renderingContext: RenderingContext) {
        
        // Initiate sign out and disconnect from the service/hub
        this.signOutAndDisconnectAsync() // Fire and forget
        
    }

    protected render(parent: HTMLElement, renderingContext: RenderingContext) { }

    protected async connectAndSignInAsync() {
        let signInRequest: IPlayerSignInRequest = {
            playerId: this.viewport.getClientId(),
            playerName: null,
            timestampText: getUtcNow().toISOString()
        };
        if (!this.signInClientService.isConnected) {
            await this.signInClientService.connectAsync();
        }
        await this.signInClientService.signInAsync(signInRequest);
    }

    protected async signOutAndDisconnectAsync() {
        let signOutRequest: IPlayerSignOutRequest = {
            playerId: this.viewport.getClientId(),
            timestampText: getUtcNow().toISOString()
        }
        if (this.signInClientService.isConnected) {
            await this.signInClientService.signOutAsync(signOutRequest);
            await this.signInClientService.disconnectAsync();
        }

    }

}