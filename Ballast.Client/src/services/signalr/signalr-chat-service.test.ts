import 'jest';
import 'reflect-metadata';

import { IEventBus } from '../../messaging/event-bus';
import { LocalEventBus } from '../../messaging/local-event-bus';
import { IChatService } from 'ballast-core';
import { SignalRChatService } from './signalr-chat-service';
import { ISignalRServiceOptions } from './signalr-service-options';

let eventBus: IEventBus = new LocalEventBus();
let optionsFactory = () => { // TODO:  Replace with a mock implementation
   return { serverUrl: '' }
};
let chatService: IChatService = new SignalRChatService(eventBus, optionsFactory);

test('has method sendMessageAsync()', () => {
    expect(chatService["sendMessageAsync"]).not.toBeUndefined();
});

test('has method receiveMessageAsync()', () => {
    expect(chatService["receiveMessageAsync"]).not.toBeUndefined();
});