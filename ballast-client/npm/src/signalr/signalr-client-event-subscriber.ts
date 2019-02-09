import { HubConnection } from "@aspnet/signalr";
import { IDisposable, IEvent, IEventBus, TYPES as BallastCore } from "ballast-core";
import { inject, injectable } from "inversify";
import { TYPES as BallastClient } from "./../dependency-injection/types";
import { ISignalRClientOptions } from "./signalr-client-options";
import { SignalRClientServiceBase } from "./signalr-client-service-base";

export interface ISignalRClientEventSubscriber extends IDisposable { }

@injectable()
export class SignalRClientEventSubscriber extends SignalRClientServiceBase implements ISignalRClientEventSubscriber {

    public static readonly hubName: string = "eventhub";
    public get hubName() {
        return SignalRClientEventSubscriber.hubName;
    }

    private readonly _eventBus: IEventBus;

    public constructor(
        @inject(BallastClient.SignalR.ISignalRClientOptions) serviceOptions: ISignalRClientOptions,
        @inject(BallastCore.Messaging.IEventBus) eventBus: IEventBus
    ) {
        super(serviceOptions);
        this._eventBus = eventBus;
    }

    protected afterSubscribe(hubConnection: HubConnection) {
        hubConnection.on("Event", this.onApplicationEvent);
    }

    private onApplicationEvent(evt: IEvent) {
        this._eventBus.publishAsync(evt); // Fire and forget
    }

    protected beforeUnsubscribe(hubConnection: HubConnection) {
        hubConnection.off("Event");
    }
    
}