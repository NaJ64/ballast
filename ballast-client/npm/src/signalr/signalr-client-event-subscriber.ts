import { HubConnection } from "@aspnet/signalr";
import { IEvent, IEventBus, TYPES as BallastCore } from "ballast-core";
import { inject, injectable } from "inversify";
import { TYPES as BallastClient } from "./../dependency-injection/types";
import { SignalRClientServiceBase } from "./signalr-client-service-base";
import { ISignalRClientServiceOptions } from "./signalr-client-service-options";

@injectable()
export class SignalRClientEventSubscriber extends SignalRClientServiceBase {

    public static readonly hubName: string = "eventhub";
    public get hubName() {
        return SignalRClientEventSubscriber.hubName;
    }

    private readonly _eventBus: IEventBus;

    public constructor(
        @inject(BallastClient.SignalR.ISignalRServiceOptionsFactory) serviceOptionsFactory: () => ISignalRClientServiceOptions,
        @inject(BallastCore.Messaging.IEventBus) eventBus: IEventBus
    ) {
        super(serviceOptionsFactory);
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