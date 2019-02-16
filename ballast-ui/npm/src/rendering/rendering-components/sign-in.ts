import { IBallastClientOptions, TYPES as BallastClient } from "ballast-client";
import { ISignInService, TYPES as BallastCore } from "ballast-core";
import { inject, injectable } from "inversify";
import { IRenderingComponent, RenderingComponentBase } from '../rendering-component';
import { IRenderingContext } from '../rendering-context';

@injectable()
export class SignInComponent extends RenderingComponentBase implements IRenderingComponent {

    private readonly _clientOptions: IBallastClientOptions;
    private readonly _signInService: ISignInService;
    
    public constructor(
        @inject(BallastClient.DependencyInjection.IBallastClientOptions) clientOptions: IBallastClientOptions,
        @inject(BallastCore.Application.Services.ISignInService) signInService: ISignInService
    ) {
        super();
        this._clientOptions = clientOptions;
        this._signInService = signInService;
    }
   
    protected onRender(renderingContext: IRenderingContext): void { 
        // No rendering component (currently) but in the future we may render a sign-in window
    }

    private getNowISOString() {
        return new Date(Date.now()).toISOString();
    }

    protected async signInAutomaticallyAsync() {
        if (!this._clientOptions || !this._clientOptions.clientId) {
            throw new Error("Cannot sign in automatically without a client id");
        }
        await this._signInService.signInAsync({
            playerId: this._clientOptions.clientId,
            playerName: null,
            sentOnDateIsoString: this.getNowISOString()
        });
    }

    protected async signOutAsync() {
        if (!this._clientOptions || !this._clientOptions.clientId) {
            throw new Error("Cannot sign-out without a client id");
        }
        await this._signInService.signOutAsync({
            playerId: this._clientOptions.clientId,
            sentOnDateIsoString: this.getNowISOString()
        });
    }

}