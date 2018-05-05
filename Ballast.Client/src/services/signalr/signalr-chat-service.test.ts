import 'reflect-metadata';

import { IChatService, IEventBus } from 'ballast-core';
import 'jest';
import { LocalEventBus } from '../../messaging/local-event-bus';
import { SignalRChatService } from './signalr-chat-service';


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