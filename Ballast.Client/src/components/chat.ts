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
    private chatInput?: HTMLInputElement;

    protected onAttach(parent: HTMLElement) {
        let chat = this.createChat(parent);
        this.chatWindow = chat["0"];
        this.chatInput = chat["1"];
        this.addChatEvents();
    }

    private addChatEvents() {
        if (this.chatInput) {
            this.chatInput.onfocus = event => this.suspendKeyboardWatching();
            this.chatInput.onblur = event => this.resumeKeyboardWatching();
        }
    }

    private removeChatEvents() {
        if (this.chatInput) {
            this.chatInput.onfocus = null;
            this.chatInput.onblur = null;
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
        
    }

    protected render(parent: HTMLElement, renderingContext: RenderingContext) { 

    }

    private createChat(container: HTMLElement): [ HTMLDivElement, HTMLInputElement ] {
        let chatWindow = container.ownerDocument.createElement("div");
        chatWindow.style.cssFloat = 'right';
        chatWindow.style.position = 'absolute';
        chatWindow.style.zIndex = '1000';
        chatWindow.style.right = '0px';
        chatWindow.style.top = '0px';
        chatWindow.style.height = '100%';
        chatWindow.style.width = '25%';
        chatWindow.style.borderLeftStyle = 'solid';
        chatWindow.style.borderLeftColor = 'rgba(255, 255, 255, 0.25)';
        chatWindow.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        let chatInput = container.ownerDocument.createElement("input");
        chatInput.style.cssFloat = 'bottom';
        chatInput.style.position = 'absolute';
        chatInput.style.zIndex = '1001';
        chatInput.style.right = '0px';
        chatInput.style.bottom = '0px';
        chatInput.style.height = '25px';
        chatInput.style.width = '100%';
        chatInput.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        chatInput.style.borderStyle = 'solid';
        chatInput.style.borderBottomStyle = 'none';
        chatInput.style.borderLeftStyle = 'none';
        chatInput.style.borderRightStyle = 'none';
        chatInput.style.borderTopColor = 'rgba(255, 255, 255, 0.25)';
        chatInput.style.color = 'white';
        chatWindow.appendChild(chatInput);
        container.appendChild(chatWindow);
        return [chatWindow, chatInput];
    }
    
}