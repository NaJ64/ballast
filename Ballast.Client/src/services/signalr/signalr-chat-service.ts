import * as signalR from '@aspnet/signalr';
import { ChatMessageSentEvent, IChatMessage, IEventBus, IChatMessageSentEvent } from 'ballast-core';
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
        //hubConnection.on('messageReceived', this.onMessageReceived.bind(this));
        hubConnection.on('ChatMessageSent', this.onChatMessageSent.bind(this))
    }

    protected beforeUnsubscribe(hubConnection: signalR.HubConnection) {
        //hubConnection.off('messageReceived');
        hubConnection.off('ChatMessageSent');
    }

    // private onMessageReceived(message: IChatMessage) {
    //     this.receiveMessageAsync(message); // Fire and forget
    // }

    private onChatMessageSent(evt: IChatMessageSentEvent) {
        let chatMessageSent = ChatMessageSentEvent.fromObject(evt);
        //alert('chat message sent');
        this.eventBus.publishAsync(chatMessageSent); // Fire and forget
    }

    public async sendMessageAsync(message: IChatMessage): Promise<void> {
        await this.createInvocationAsync('sendMessageAsync', message);
        let chatMessageSent = ChatMessageSentEvent.fromMessage(message);
        await this.eventBus.publishAsync(chatMessageSent);
    }

    // public async receiveMessageAsync(message: IChatMessage) {
    //     if (!this.isConnected) {
    //         await this.connectAsync();
    //     }
    //     // Make sure we are not the current sender before saving the message into history
    //     let isCurrentSender = false;
    //     if (this.sender && message.from.toLocaleLowerCase() != this.sender) {
    //         isCurrentSender = true;
    //     }
    //     if (!isCurrentSender) {
    //         let chatMessageReceived = ChatMessageReceivedEvent.fromMessage(message);
    //         await this.eventBus.publishAsync(chatMessageReceived);
    //     }
    // }

}