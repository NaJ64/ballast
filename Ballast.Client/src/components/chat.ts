import { ChatMessageReceivedEvent, IChatMessage, IEventBus } from 'ballast-core';
import { inject, injectable } from 'inversify';
import { BallastViewport } from '../app/ballast-viewport';
import { PerspectiveTracker } from '../input/perspective-tracker';
import { TYPES_BALLAST } from '../ioc/types';
import { RenderingContext } from '../rendering/rendering-context';
import { IChatClientService } from '../services/chat-client-service';
import { ComponentBase } from './component-base';

@injectable()
export class ChatComponent extends ComponentBase {

    private readonly chatService: IChatClientService;
    private readonly chatMessageReceivedHandler: (event: ChatMessageReceivedEvent) => Promise<void>;
    private readonly chatInputFocusListener: (this: HTMLInputElement, ev: FocusEvent) => any;
    private readonly chatInputBlurListener: (this: HTMLInputElement, ev: FocusEvent) => any;
    private readonly chatFormSubmitListener: (this: HTMLInputElement, ev: Event) => any;
    private readonly chatWindow: HTMLDivElement;
    private readonly chatHistory: HTMLUListElement;
    private readonly chatForm: HTMLFormElement;
    private readonly chatInput: HTMLInputElement;

    public constructor(
        @inject(TYPES_BALLAST.BallastViewport) viewport: BallastViewport, 
        @inject(TYPES_BALLAST.IEventBus) eventBus: IEventBus,
        @inject(TYPES_BALLAST.PerspectiveTracker) perspectiveTracker: PerspectiveTracker,
        @inject(TYPES_BALLAST.IChatClientService) chatService: IChatClientService
    ) {
        super(viewport, eventBus, perspectiveTracker);
        this.chatService = chatService;
        let chatElements = this.createChatElements();
        this.chatWindow = chatElements["0"];
        this.chatHistory = chatElements["1"];
        this.chatForm = chatElements["2"];
        this.chatInput = chatElements["3"];
        this.chatMessageReceivedHandler = this.onChatMessageReceivedAsync.bind(this);
        this.chatInputFocusListener = this.onChatInputFocus.bind(this);
        this.chatInputBlurListener = this.onChatInputBlur.bind(this);
        this.chatFormSubmitListener = this.onChatFormSubmit.bind(this);
    }

    private createChatElements(): [ 
        HTMLDivElement, 
        HTMLUListElement, 
        HTMLFormElement, 
        HTMLInputElement] {

        let ownerDocument = this.viewport.getRoot().ownerDocument;

        let chatWindow = ownerDocument.createElement("div");
        chatWindow.style.cssFloat = 'right';
        chatWindow.style.position = 'absolute';
        chatWindow.style.zIndex = '1000';
        chatWindow.style.right = '12px'; // parent has 2px border
        chatWindow.style.bottom = '12px'; // parent has 2px border
        chatWindow.style.height = '66%';
        chatWindow.style.width = 'calc(40% - 2px)';
        chatWindow.style.borderWidth = '1px';
        chatWindow.style.borderStyle = 'none'; //'solid';
        chatWindow.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        //chatWindow.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';

        let chatHistory = ownerDocument.createElement("ul");
        chatHistory.style.color = "white";
        chatHistory.style.textShadow = '1px 1px 2px rgb(0, 0, 0), -1px 1px 2px rgb(0, 0, 0), 1px -1px 2px rgb(0, 0, 0), -1px -1px 2px rgb(0, 0, 0)';
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

        let chatForm = ownerDocument.createElement('form');
        chatWindow.appendChild(chatForm);

        let chatInput = ownerDocument.createElement("input");
        chatInput.style.cssFloat = 'bottom';
        chatInput.style.position = 'absolute';
        chatInput.style.zIndex = '1001';
        chatInput.style.right = '0px';
        chatInput.style.bottom = '0px';
        chatInput.style.height = '25px';
        chatInput.style.width = '100%';
        chatInput.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        chatInput.style.borderStyle = 'solid';
        // chatInput.style.borderBottomStyle = 'none';
        // chatInput.style.borderLeftStyle = 'none';
        // chatInput.style.borderRightStyle = 'none';
        chatInput.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        chatInput.style.color = 'white';
        chatForm.appendChild(chatInput);

        return [ chatWindow, chatHistory, chatForm, chatInput];
    }
    
    protected onAttach(parent: HTMLElement, renderingContext: RenderingContext) {

        // Add chat window onto page
        parent.appendChild(this.chatWindow);

        // Subscribe to events
        this.subscribeToEvents();

        // Connect to the chat service/hub
        if (!this.chatService.isConnected) {
            this.chatService.connectAsync(); // Fire and forget
        }
        
    }

    protected onDetach(parent: HTMLElement, renderingContext: RenderingContext) {

        // Disconnect from the chat service/hub
        if (this.chatService.isConnected) {
            this.chatService.disconnectAsync(); // Fire and forget
        }

        // Remove the chat window from the page
        parent.removeChild(this.chatWindow);

        // Unsubscribe from events
        this.unsubscribeFromEvents();

    }

    protected render(parent: HTMLElement, renderingContext: RenderingContext) { 

        // Check if the user has hit the "enter" key to talk while not already on the chat input 
        let focusedElement = this.chatInput && this.chatInput.ownerDocument.activeElement;
        let chatInputHasFocus = this.chatInput && focusedElement && (focusedElement == this.chatInput);
        if (!chatInputHasFocus && renderingContext.keyboard.enterIsDown()) {
            (<HTMLInputElement>this.chatInput).focus();
        }

    }

    private subscribeToEvents() {
        this.eventBus.subscribe(ChatMessageReceivedEvent.id, this.chatMessageReceivedHandler);
        this.chatInput.addEventListener('focus', this.chatInputFocusListener);
        this.chatInput.addEventListener('blur', this.chatInputBlurListener);
        this.chatForm.addEventListener('submit', this.chatFormSubmitListener);
    }

    private unsubscribeFromEvents() {
        this.eventBus.unsubscribe(ChatMessageReceivedEvent.id, this.chatMessageReceivedHandler);
        this.chatInput.removeEventListener('focus', this.chatInputFocusListener);
        this.chatInput.removeEventListener('blur', this.chatInputBlurListener);
        this.chatForm.removeEventListener('submit', this.chatFormSubmitListener);
    }

    private async onChatMessageReceivedAsync(event: ChatMessageReceivedEvent) {
        this.appendMessageToHistory(event.message);
    }

    private appendMessageToHistory(message: IChatMessage) {
        if (this.chatHistory) {
            let item = this.chatHistory.ownerDocument.createElement('li');
            let timestampDate = new Date(message.timestampText + 'Z');
            let messageDisplay = `[${message.from}]:  ${message.text}`;
            item.innerText = messageDisplay;
            this.chatHistory.appendChild(item);
            this.chatHistory.scrollTop = this.chatHistory.scrollHeight
        }
    }

    private onChatInputFocus(ev: FocusEvent): any {
        this.suspendKeyboardWatching();
    }

    private suspendKeyboardWatching() {
        this.viewport.getKeyboardWatcher().suspend();
    }
    
    private onChatInputBlur(ev: FocusEvent): any {
        setTimeout(() => {
            this.resumeKeyboardWatching();
        }, 250);
    }

    private resumeKeyboardWatching() {
        this.viewport.getKeyboardWatcher().resume();
    }
    
    private onChatFormSubmit(ev: Event): any {
        this.submitMessage();
        ev.preventDefault();
        return false;
    }

    private submitMessage() {
        if (this.chatInput) {
            let messageText = this.chatInput.value || "";
            if (!!messageText) {
                this.sendMessageFromTextAsync(messageText); // Fire and forget
            }
            this.chatInput.value = "";
            this.chatInput.blur();
        }
    }

    private async sendMessageFromTextAsync(text: string) {
        let game = this.viewport.getRenderingContext().game;
        let gameId: string | null = null;
        if (game) {
            gameId = game.id;
        }
        let channel = 'global';
        let from = 'anonymous';
        let timestamp = new Date(Date.now());
        await this.chatService.sendMessageAsync({
            gameId: gameId,
            channel: channel,
            from: from,
            timestampText: timestamp.toISOString(),
            text: text
        });
    }

}