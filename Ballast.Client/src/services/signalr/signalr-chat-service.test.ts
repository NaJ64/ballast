import 'jest';
import 'reflect-metadata';

import { IEventBus } from '../../messaging/event-bus';
import { LocalEventBus } from '../../messaging/local-event-bus';
import { IChatService } from '../chat/chat-service';
import { SignalRChatService } from './signalr-chat-service';
import { ISignalRServiceOptions } from './signalr-service-options';

let eventBus: IEventBus = new LocalEventBus();
let options = { serverUrl: '' }; // TODO:  Replace with a mock implementation
let chatService: IChatService = new SignalRChatService(eventBus, options);

test('has method sendMessageAsync()', () => {
    expect(chatService["sendMessageAsync"]).not.toBeUndefined();
});

test('has method receiveMessageAsync()', () => {
    expect(chatService["receiveMessageAsync"]).not.toBeUndefined();
});