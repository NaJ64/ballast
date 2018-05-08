import * as signalR from '@aspnet/signalr';
import { ChatMessageReceivedEvent, ChatMessageSentEvent, IChatMessage, IEventBus } from 'ballast-core';
import { inject, injectable } from 'inversify';
import { TYPES_BALLAST } from '../../ioc/types';
import { IChatClientService } from '../chat-client-service';
import { SignalRServiceBase } from './signalr-service-base';
import { ISignalRServiceOptions } from './signalr-service-options';

@injectable()
export class SignalRChatService extends SignalRServiceBase implements IChatClientService {

    private sender?: string;

    public constructor(
        @inject(TYPES_BALLAST.IEventBus) eventBus: IEventBus,
        @inject(TYPES_BALLAST.ISignalRServiceOptionsFactory) serviceOptionsFactory: () => ISignalRServiceOptions
    ) {
        super(eventBus, serviceOptionsFactory);
    }

    protected get hubName() {
        return 'chathub';
    }

    protected afterSubscribe(hubConnection: signalR.HubConnection) {
        hubConnection.on('messageReceived', this.onMessageReceived.bind(this));
    }

    protected beforeUnsubscribe(hubConnection: signalR.HubConnection) {
        hubConnection.off('messageReceived');
    }

    private onMessageReceived(message: IChatMessage) {
        this.receiveMessageAsync(message); // Fire and forget
    }

    public async sendMessageAsync(message: IChatMessage): Promise<void> {
        this.createInvocationAsync('sendMessage', message); // Fire and forget
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