import { injectable, inject } from 'inversify';
import * as signalR from '@aspnet/signalr';
import { IChatMessage, IChatService } from 'ballast-core';
import { TYPES_BALLAST } from '../ioc/types';
import { IEventBus } from '../messaging/event-bus';
import { ChatMessageReceivedEvent } from '../messaging/events/services/chat-message-received';
import { ChatMessageSentEvent } from '../messaging/events/services/chat-message-sent';
import { ISignalRServiceOptions } from './signalr-service-options';
import { SignalRServiceBase } from './signalr-service-base';

@injectable()
export class SignalRChatService extends SignalRServiceBase implements IChatService {

    private sender?: string;
    private receiveMessageHandler: (message: IChatMessage) => void;

    public constructor(
        @inject(TYPES_BALLAST.IEventBus) eventBus: IEventBus,
        @inject(TYPES_BALLAST.ISignalRServiceOptionsFactory) serviceOptionsFactory: () => ISignalRServiceOptions
    ) {
        super(eventBus, serviceOptionsFactory);
        this.receiveMessageHandler = this.onReceiveMessage.bind(this);
    }

    protected getHubName() {
        return 'chathub';
    }

    protected subscribeToHubEvents(hubConnection: signalR.HubConnection) {
        hubConnection.on('receiveMessage', this.receiveMessageHandler);
    }

    protected unsubscribeFromHubEvents(hubConnection: signalR.HubConnection) {
        hubConnection.off('receiveMessage', this.receiveMessageHandler);
    }

    private onReceiveMessage(message: IChatMessage) {
        this.receiveMessageAsync(message); // Fire and forget
    }

    public async sendMessageAsync(message: IChatMessage): Promise<void> {
        if (!this.isConnected) {
            await this.connectAsync();
        }
        await this.invokeOnHubAsync('sendMessage', message);
        let chatMessageSent = new ChatMessageSentEvent(message);
        await this.eventBus.publishAsync(chatMessageSent);
    }

    public async receiveMessageAsync(message: IChatMessage) {
        if (!this.isConnected) {
            await this.connectAsync();
        }
        // Make sure we are not the current sender before saving the message into history
        let isCurrentSender = false;
        if (this.sender && message.from.toLocaleLowerCase() != this.sender) {
            isCurrentSender = true;
        }
        if (!isCurrentSender) {
            let chatMessageReceived = new ChatMessageReceivedEvent(message);
            await this.eventBus.publishAsync(chatMessageReceived);
        }
    }

}