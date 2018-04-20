import { injectable, inject } from 'inversify';
import { TYPES_BALLAST } from '../ioc/types';
import { IEventBus } from '../messaging/ievent-bus';
import { } from '../viewport'
import { ComponentBase } from './component-base';
import { RenderingContext } from '../rendering/rendering-context';
import { KeyboardWatcher } from '../input/keyboard-watcher';

type InputFocusEvent = ((this: HTMLElement, event: FocusEvent) => any) | null;

@injectable()
export class ChatComponent extends ComponentBase {

    private chatWindow?: HTMLDivElement;
    private chatHistory?: HTMLUListElement;
    private chatForm?: HTMLFormElement;
    private chatInput?: HTMLInputElement;

    protected onAttach(parent: HTMLElement) {
        let elements = this.createChatElements(parent);
        this.chatWindow = elements["0"];
        this.chatHistory = elements["1"];
        this.chatForm = elements["2"];
        this.chatInput = elements["3"];
        this.addChatEvents();
    }

    private addChatEvents() {
        if (this.chatInput) {
            this.chatInput.onfocus = event => this.suspendKeyboardWatching();
            this.chatInput.onblur = event => this.resumeKeyboardWatching();
            this.chatForm
        }
        if (this.chatForm) {
            this.chatForm.onsubmit = event => {
                this.submitMessage();
                return false;
            };
        }
    }

    private removeChatEvents() {
        if (this.chatInput) {
            this.chatInput.onfocus = null;
            this.chatInput.onblur = null;
        }
        if (this.chatForm) {
            this.chatForm.onsubmit = null;
        }
    }

    private submitMessage() {
        if (this.chatInput) {
            let message = this.chatInput.value || "";
            this.appendMessageToHistory(message);
            this.chatInput.value = "";
            this.chatInput.blur();
        }
    }

    private appendMessageToHistory(message: string) {
        if (this.chatHistory) {
            let item = this.chatHistory.ownerDocument.createElement('li');
            item.innerHTML = message;
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
    
    public dispose() {
        this.removeChatEvents();
    }

    protected onDetach(parent: HTMLElement) {
        this.dispose();
    }

    protected render(parent: HTMLElement, renderingContext: RenderingContext) { }

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
        chatWindow.style.right = '0px';
        chatWindow.style.bottom = '0px';
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