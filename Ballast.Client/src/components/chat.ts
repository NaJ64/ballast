import { injectable, inject } from 'inversify';
import { TYPES_BALLAST } from '../ioc/types';
import { IEventBus } from '../messaging/event-bus';
import { ComponentBase } from './component-base';
import { RenderingContext } from '../rendering/rendering-context';
import { KeyboardWatcher } from '../input/keyboard-watcher';
import { ChatMessageReceivedEvent } from '../messaging/events/services/chat-message-received';
import { BallastViewport } from '../app/ballast-viewport';
import { IChatService } from '../services/chat/chat-service';
import { IChatMessage } from '../services/chat/chat-message';

type InputFocusEvent = ((this: HTMLElement, event: FocusEvent) => any) | null;

@injectable()
export class ChatComponent extends ComponentBase {

    private readonly chatService: IChatService;
    private readonly chatMessageReceivedHandler: (event: ChatMessageReceivedEvent) => Promise<void>;
    private chatWindow?: HTMLDivElement;
    private chatHistory?: HTMLUListElement;
    private chatForm?: HTMLFormElement;
    private chatInput?: HTMLInputElement;

    public constructor(
        @inject(TYPES_BALLAST.BallastViewport) viewport: BallastViewport, 
        @inject(TYPES_BALLAST.IEventBus) eventBus: IEventBus,
        @inject(TYPES_BALLAST.IChatService) chatService: IChatService
    ) {
        super(viewport, eventBus);
        this.chatService = chatService;
        this.chatMessageReceivedHandler = this.onChatMessageReceivedAsync.bind(this);
    }

    protected onAttach(parent: HTMLElement) {
        let elements = this.createChatElements(parent);
        this.chatWindow = elements["0"];
        this.chatHistory = elements["1"];
        this.chatForm = elements["2"];
        this.chatInput = elements["3"];
        this.subscribeToEvents();
        if (!this.chatService.isConnected) {
            this.chatService.connectAsync(); // Fire and forget
        }
    }

    public dispose() {
        this.unsubscribeFromEvents();
    }

    private subscribeToEvents() {
        this.eventBus.subscribe(ChatMessageReceivedEvent.id, this.chatMessageReceivedHandler);
        if (this.chatInput) {
            this.chatInput.onfocus = event => this.suspendKeyboardWatching();
            this.chatInput.onblur = event => this.resumeKeyboardWatching();
        }
        if (this.chatForm) {
            this.chatForm.onsubmit = event => {
                this.submitMessage();
                event.preventDefault();
                return false;
            };
        }
    }

    private unsubscribeFromEvents() {
        this.eventBus.unsubscribe(ChatMessageReceivedEvent.id, this.chatMessageReceivedHandler);
        if (this.chatInput) {
            this.chatInput.onfocus = null;
            this.chatInput.onblur = null;
        }
        if (this.chatForm) {
            this.chatForm.onsubmit = null;
        }
    }

    private async onChatMessageReceivedAsync(event: ChatMessageReceivedEvent) {
        console.log('got a message received event:');
        console.log(event);
        this.appendMessageToHistory(event.message);
    }

    private submitMessage() {
        if (this.chatInput) {
            let messageText = this.chatInput.value || "";
            this.sendMessageFromTextAsync(messageText); // Fire and forget
            this.chatInput.value = "";
            this.chatInput.blur();
        }
    }

    private async sendMessageFromTextAsync(text: string) {
        let channel = 'global';
        let from = 'testUser';
        let timestamp = new Date(Date.now());
        await this.chatService.sendMessageAsync({
            channel: channel,
            from: from,
            timestamp: timestamp,
            text: text
        });
    }

    private appendMessageToHistory(message: IChatMessage) {
        if (this.chatHistory) {
            let item = this.chatHistory.ownerDocument.createElement('li');
            let timestampDate = new Date(message.timestamp);
            let messageDisplay = `(${timestampDate.toLocaleTimeString()}) ${message.from}: ${message.text}`;
            item.innerHTML = messageDisplay;
            this.chatHistory.appendChild(item);
            this.chatHistory.scrollTop = this.chatHistory.scrollHeight
        }
    }

    private suspendKeyboardWatching() {
        this.viewport.getKeyboardWatcher().suspend();
    }
    
    private resumeKeyboardWatching() {
        this.viewport.getKeyboardWatcher().resume();
    }
    
    protected onDetach(parent: HTMLElement) {
        this.dispose();
    }

    protected render(parent: HTMLElement, renderingContext: RenderingContext) { 

        // Check if the user has hit the "t" key to talk
        let focusedElement = this.chatInput && this.chatInput.ownerDocument.activeElement;
        let chatInputHasFocus = this.chatInput && focusedElement && (focusedElement == this.chatInput);
        if (!chatInputHasFocus && renderingContext.keyboard.tIsDown()) {
            (<HTMLInputElement>this.chatInput).focus();
        }

    }

    private createChatElements(container: HTMLElement): [ 
        HTMLDivElement, 
        HTMLUListElement, 
        HTMLFormElement, 
        HTMLInputElement 
    ] {

        let chatWindow = container.ownerDocument.createElement("div");
        chatWindow.style.cssFloat = 'right';
        chatWindow.style.position = 'absolute';
        chatWindow.style.zIndex = '1000';
        chatWindow.style.right = '2px'; // parent has 2px border
        chatWindow.style.bottom = '2px'; // parent has 2px border
        chatWindow.style.height = '33%';
        chatWindow.style.width = 'calc(33% - 2px)';
        chatWindow.style.borderWidth = '1px';
        chatWindow.style.borderStyle = 'solid';
        chatWindow.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        chatWindow.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';

        let chatHistory = container.ownerDocument.createElement("ul");
        chatHistory.style.color = "white";
        chatHistory.style.marginTop = '10px';
        chatHistory.style.marginBottom = '10px';
        chatHistory.style.marginLeft = '5px';
        chatHistory.style.marginRight = '5px';
        chatHistory.style.padding = '0px';
        chatHistory.style.listStyle = "none";
        chatHistory.style.position = 'absolute';
        chatHistory.style.bottom = '26px';
        chatHistory.style.right = '0px';
        chatHistory.style.left = '0px';
        chatHistory.style.overflowY = 'auto';
        chatHistory.style.maxHeight = 'calc(100% - 46px)';
        chatWindow.appendChild(chatHistory);

        let chatForm = container.ownerDocument.createElement('form');
        chatWindow.appendChild(chatForm);

        let chatInput = container.ownerDocument.createElement("input");
        chatInput.style.cssFloat = 'bottom';
        chatInput.style.position = 'absolute';
        chatInput.style.zIndex = '1001';
        chatInput.style.right = '0px';
        chatInput.style.bottom = '0px';
        chatInput.style.height = '25px';
        chatInput.style.width = '100%';
        chatInput.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        chatInput.style.borderStyle = 'solid';
        chatInput.style.borderBottomStyle = 'none';
        chatInput.style.borderLeftStyle = 'none';
        chatInput.style.borderRightStyle = 'none';
        chatInput.style.borderTopColor = 'rgba(255, 255, 255, 0.1)';
        chatInput.style.color = 'white';
        chatForm.appendChild(chatInput);

        container.appendChild(chatWindow);

        return [ chatWindow, chatHistory, chatForm, chatInput];
    }
    
}