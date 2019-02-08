import * as signalR from '@aspnet/signalr';
import { Guid, IDisposable, IEventBus, IEvent } from 'ballast-core';
import { injectable } from 'inversify';
import { ISignalRClientServiceOptions } from './signalr-client-service-options';

type InvocationResolver<TValue extends any> = (value?: TValue) => void;
type InvocationRejector = (reason?: string) => void;

@injectable()
export abstract class SignalRClientServiceBase implements IDisposable {

    protected readonly _optionsFactory: () => ISignalRClientServiceOptions;
    protected readonly _methods: Map<string, string>;
    protected readonly _subscriptions: Map<string, string>;
    protected readonly _invocations: Map<string, Map<string, any>>;
    protected _hubConnection?: signalR.HubConnection;
    protected _hubConnectionState: 'disconnected' | 'connected' | 'connecting';

    protected abstract get hubName(): string;

    protected afterSubscribe(hubConnection: signalR.HubConnection): void { }
    protected beforeUnsubscribe(hubConnection: signalR.HubConnection): void { }
    protected onDispose() { }

    public constructor(optionsFactory: () => ISignalRClientServiceOptions) {
        this._optionsFactory = optionsFactory;
        this._methods = new Map<string, string>();
        this._subscriptions = new Map<string, string>();
        this._invocations = new Map<string, Map<string, any>>();
        this._hubConnectionState = 'disconnected';
    }

    public dispose() {
        if (this._hubConnection) {
            this.disconnectAsync(); // Fire and forget
        }
        this.onDispose();
    }

    public get isConnected() {
        return (!!this._hubConnection && this._hubConnectionState == 'connected');
    }

    public get isConnecting() {
        return (!!this._hubConnection && this._hubConnectionState == 'connecting');
    }

    public createHubConnection() {
        let options = this._optionsFactory();
        let hubName = this.hubName;
        let hub = `${options.serverUrl}/${hubName}`;
        let connectionBuilder = new signalR.HubConnectionBuilder();
        let connection = connectionBuilder.withUrl(hub).build();
        return connection;
    }

    public async connectAsync() {
        if (this.isConnected) {
            await this.disconnectAsync();
        }
        this._hubConnectionState = 'connecting';
        this._hubConnection = this.createHubConnection();
        this.resubscribeToHubEvents();
        await this._hubConnection.start();
        this._hubConnectionState = 'connected';
        await this.registerClientAsync();
    }

    private async registerClientAsync() {
        let options = this._optionsFactory();
        let clientId = options.clientId;
        await this.createInvocationAsync('registerClientAsync', clientId);
    }

    public async disconnectAsync() {
        if (this._hubConnection) {
            this.unsubscribeFromHubEvents();
            await this._hubConnection.stop();
        }
        this._hubConnection = undefined;
        this._hubConnectionState = 'disconnected';
    }

    protected registerHubMethod(method: string) {
        this._methods.set(method, method);
        this.registerCallbackForHubMethod(method);
    }

    private registerCallbackForHubMethod(methodName: string) {
        // Do not proceed unless are have a hub connection
        if (!this._hubConnection) {
            return;
        }
        // Register fulfillment (callback) subscription for the current method
        let callback = `${methodName}Callback`;
        this._subscriptions.set(callback, callback);
        this._hubConnection.on(callback, (invocationId: string, reason?: null | string, value?: null | any) => {
            // Get the list of all currently running/live method invocations
            let currentInvocations = this.getInvocationList(methodName);
            let foundInvocation = currentInvocations.get(invocationId);
            if (!foundInvocation) {
                return;
            }
            let resolve = foundInvocation["0"] as InvocationResolver<any>;
            let reject = foundInvocation["1"] as InvocationRejector;
            if (!!reason) {
                // Reject the promise
                reject(reason);
            } else {
                // Resolve the promise
                resolve(value || undefined);
            }
            // Remove from the list of invocations (promise has reached fulfilled state)
            currentInvocations.delete(invocationId);
        });
    }

    protected onConnectionClosed() {
        // Try to re-open
        this._hubConnectionState = 'disconnected';
        if (this._hubConnection) {
            this._hubConnectionState = 'connecting';
            this._hubConnection.start()
                .then(() => this._hubConnectionState = 'connected');
        }
    }

    protected resubscribeToHubEvents() {
        // Unsubscribe from all (if already subscribed)
        this.unsubscribeFromHubEvents();
        // Make sure we have a hub connection instance
        if (!this._hubConnection) {
            throw new Error('Cannot (re)subscribe to hub events without a hub connection');
        }
        // Iterate through registered hub methods
        this._methods.forEach(methodName => this.registerCallbackForHubMethod(methodName));
        this.afterSubscribe(this._hubConnection);
        this._hubConnection.onclose = this.onConnectionClosed.bind(this);
    }

    protected unsubscribeFromHubEvents() {
        if (this._hubConnection) {
            this.beforeUnsubscribe(this._hubConnection);
            let subscriptions = Array.from(this._subscriptions.keys());
            for (let subscription of subscriptions) {
                this._hubConnection.off(subscription);
            }
        }
        this._subscriptions.clear();
    }

    protected createInvocationId() {
        return Guid.newGuid();
    }

    protected getInvocationList(method: string) {
        if (!this._invocations.has(method)) {
            this._invocations.set(method, new Map());
        }
        return this._invocations.get(method)!;
    }

    protected async createInvocationAsync<TValue extends any>(method: string, ...args: any[]) {
        if (!this._methods.has(method)) {
            this.registerHubMethod(method);
        }
        if (this.isConnecting) {
            throw new Error('Invocation could not be created because the service is still attempting to establish a connection')
        }
        if (!this.isConnected) {
            await this.connectAsync();
        }
        return await new Promise<TValue>((resolve, reject) => {
            let invocationList = this.getInvocationList(method);
            let invocationId = this.createInvocationId();
            invocationList.set(invocationId, [resolve, reject]);
            this.invokeOnHubAsync(method, invocationId, ...args)
                .catch((err: Error) => this.cancelInvocation(method, invocationId, err.message)); // Fire and forget
        });
    }

    private cancelInvocation(method: string, invocationId: string, cancellationReason: string) {
        // Get the list of all currently running/live method invocations
        let currentInvocations = this.getInvocationList(method);
        let foundInvocation = currentInvocations.get(invocationId);
        if (!foundInvocation) {
            return;
        }
        let reject = foundInvocation["1"] as InvocationRejector;
        // Reject the promise
        reject(cancellationReason);
        // Remove from the list of invocations (promise has reached fulfilled state)
        currentInvocations.delete(invocationId);
    }

    private async invokeOnHubAsync(method: string, invocationId: string, ...args: any[]) {
        if (this.isConnecting) {
            throw new Error('Invocation could not take place because the service is still attempting to establish a connection')
        }
        if (!this.isConnected) {
            await this.connectAsync()
        } 
        if (this.isConnected) {
            let invocationIdPlusArgs = (<any[]>[invocationId]).concat(args);
            await this._hubConnection!.invoke(method, ...invocationIdPlusArgs);
        }
    }

}