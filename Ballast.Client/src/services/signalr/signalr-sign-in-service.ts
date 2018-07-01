import * as signalR from '@aspnet/signalr';
import { IEventBus, IPlayerSignInRequest, IPlayerSignOutRequest, IPlayer } from 'ballast-core';
import { inject, injectable } from 'inversify';
import { TYPES_BALLAST } from '../../ioc/types';
import { ISignInClientService } from '../sign-in-client-service';
import { SignalRServiceBase } from './signalr-service-base';
import { ISignalRServiceOptions } from './signalr-service-options';

@injectable()
export class SignalRSignInService extends SignalRServiceBase implements ISignInClientService {

    public constructor(
        @inject(TYPES_BALLAST.IEventBus) eventBus: IEventBus,
        @inject(TYPES_BALLAST.ISignalRServiceOptionsFactory) serviceOptionsFactory: () => ISignalRServiceOptions
    ) {
        super(eventBus, serviceOptionsFactory);
    }

    protected get hubName() {
        return 'signinhub';
    }

    public async signInAsync(request: IPlayerSignInRequest): Promise<IPlayer> {
        return await this.createInvocationAsync<IPlayer>('signInAsync', request);
    }

    public async signOutAsync(request: IPlayerSignOutRequest): Promise<void> {
        return await this.createInvocationAsync<void>('signOutAsync', request);
    }
    
    public async getSignedInPlayerAsync(playerId: string): Promise<IPlayer | null> {
        return await this.createInvocationAsync<IPlayer | null>('getSignedInPlayerAsync', playerId);
    }

}