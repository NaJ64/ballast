import { injectable, inject } from 'inversify';
import * as signalR from '@aspnet/signalr';
import { TYPES_BALLAST } from '../ioc/types';
import { IEventBus } from '../messaging/event-bus';
import { ISignalRServiceOptions } from './signalr-service-options';

@injectable()
export abstract class SignalRServiceBase {

    protected readonly eventBus: IEventBus;
    private readonly serviceOptionsFactory: () => ISignalRServiceOptions;
    private hubConnection?: signalR.HubConnection;

    public constructor(
        @inject(TYPES_BALLAST.IEventBus) eventBus: IEventBus,
        @inject(TYPES_BALLAST.ISignalRServiceOptionsFactory) serviceOptionsFactory: () => ISignalRServiceOptions
    ) {
        this.eventBus = eventBus;
        this.serviceOptionsFactory = serviceOptionsFactory;
    }

    public dispose() {
        if (this.hubConnection) {
            this.disconnectAsync(); // Fire and forget
        }
        this.onDispose();
    }

    public get isConnected() {
        return !!this.hubConnection;
    }

    public async connectAsync() {
        if (this.hubConnection) {
            await this.disconnectAsync();
        }
        let options = this.serviceOptionsFactory();
        let hub = this.getHubName();
        this.hubConnection = new signalR.HubConnection(`${options.serverUrl}/${hub}`);
        this.subscribeToHubEvents(this.hubConnection);
        await this.hubConnection.start();
    }

    public async disconnectAsync() {
        if (this.hubConnection) {
            this.unsubscribeFromHubEvents(this.hubConnection);
            await this.hubConnection.stop();
        }
        this.hubConnection = undefined;
    }

    protected async invokeOnHubAsync<TData extends any>(method: string, options: any) {
        if (this.hubConnection) {
            await this.hubConnection.invoke(method, options);
        }
    }

    protected onDispose() { };
    protected abstract getHubName(): string;
    protected abstract subscribeToHubEvents(hubConnection: signalR.HubConnection): void;
    protected abstract unsubscribeFromHubEvents(hubConnection: signalR.HubConnection): void;

}