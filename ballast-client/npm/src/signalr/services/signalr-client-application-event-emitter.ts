import { HubConnection } from "@aspnet/signalr";
import { IApplicationEvent, IApplicationEventEmitter, IEventBus, TYPES as BallastCore } from "ballast-core";
import { inject, injectable } from "inversify";
import { TYPES as BallastClient } from "../../dependency-injection/types";
import { ISignalRClientOptions } from "../signalr-client-options";
import { SignalRClientServiceBase } from "../signalr-client-service-base";

@injectable()
export class SignalRClientApplicationEventEmitter extends SignalRClientServiceBase implements IApplicationEventEmitter {

    public static readonly hubName: string = "eventhub";
    public get hubName() {
        return SignalRClientApplicationEventEmitter.hubName;
    }

    private readonly _eventBus: IEventBus;
    private _isEnabled: boolean;

    public constructor(
        @inject(BallastClient.SignalR.ISignalRClientOptions) serviceOptions: ISignalRClientOptions,
        @inject(BallastCore.Messaging.IEventBus) eventBus: IEventBus
    ) {
        super(serviceOptions);
        this._eventBus = eventBus;
        this._isEnabled = false;
        this.rebindHandlers();
    }

    public get isEnabled(): boolean {
        return this._isEnabled;
    }

    public start(): void {
        this._isEnabled = true;
    }

    public stop(): void {
        this._isEnabled = false;
    }

    protected rebindHandlers() {
        this.onApplicationEvent = this.onApplicationEvent.bind(this);
    }

    protected afterSubscribe(hubConnection: HubConnection) {
        hubConnection.on("IApplicationEvent", this.onApplicationEvent);
    }

    protected beforeUnsubscribe(hubConnection: HubConnection) {
        hubConnection.off("IApplicationEvent");
    }
    
    private onApplicationEvent(evt: IApplicationEvent) {
        if (!this._isEnabled) {
            return Promise.resolve();
        }
        this._eventBus.publishAsync(evt); // Fire and forget
    }

}