import { ChatMessageSentEvent, IChatMessage, IChatMessageSentEvent, IChatService, IEventBus, IPlayerAddedToVesselRoleEvent, IPlayerJoinedGameEvent, IPlayerLeftGameEvent, IVesselMovedInDirectionEvent, PlayerAddedToVesselRoleEvent, PlayerJoinedGameEvent, PlayerLeftGameEvent, TYPES as BallastCore, VesselMovedInDirectionEvent, IDirection } from "ballast-core";
import { inject, injectable } from "inversify";
import { IBallastAppState } from "../../app-state";
import { TYPES as BallastUi } from "../../dependency-injection/types";
import { KeyboardWatcher } from "../../input/keyboard-watcher";
import { RenderingComponentBase } from "../rendering-component";
import { IRenderingContext } from "../rendering-context";
import { BallastAppConstants } from "../../app-constants";

@injectable()
export class ChatComponent extends RenderingComponentBase {

    private readonly _app: IBallastAppState;
    private readonly _eventBus: IEventBus;
    private readonly _chatService: IChatService;
    private readonly _keyboardWatcher: KeyboardWatcher;

    private _chatWindow?: HTMLDivElement;
    private _chatHistory?: HTMLUListElement;
    private _chatForm?: HTMLFormElement;
    private _chatInput?: HTMLInputElement;

    public constructor(
        @inject(BallastUi.IBallastAppState) app: IBallastAppState,
        @inject(BallastUi.Input.KeyboardWatcher) keyboardWatcher: KeyboardWatcher,
        @inject(BallastCore.Messaging.IEventBus) eventBus: IEventBus,
        @inject(BallastCore.Application.Services.IChatService) chatService: IChatService
    ) {
        super();
        this.rebindAllHandlers();
        this._app = app;
        this._eventBus = eventBus;
        this._chatService = chatService;
        this._keyboardWatcher = keyboardWatcher;
    }
     
    protected onDisposing() {
        this.unsubscribeAll();
        this.destroyDomElements();
    }

    private rebindAllHandlers() {
        this.onChatMessageSentAsync = this.onChatMessageSentAsync.bind(this);
        this.onPlayerAddedToVesselRoleEventAsync = this.onPlayerAddedToVesselRoleEventAsync.bind(this);
        this.onPlayerJoinedGameEventAsync = this.onPlayerJoinedGameEventAsync.bind(this);
        this.onPlayerLeftGameEventAsync = this.onPlayerLeftGameEventAsync.bind(this);
        this.onVesselMovedInDirectionEventAsync = this.onVesselMovedInDirectionEventAsync.bind(this);
        this.onChatInputFocus = this.onChatInputFocus.bind(this);
        this.onChatInputBlur = this.onChatInputBlur.bind(this);
        this.onChatFormSubmit = this.onChatFormSubmit.bind(this);
    }

    private subscribeAll() {
        this._eventBus.subscribe(ChatMessageSentEvent.id, this.onChatMessageSentAsync);
        this._eventBus.subscribe(PlayerAddedToVesselRoleEvent.id, this.onPlayerAddedToVesselRoleEventAsync);
        this._eventBus.subscribe(PlayerJoinedGameEvent.id, this.onPlayerJoinedGameEventAsync);
        this._eventBus.subscribe(PlayerLeftGameEvent.id, this.onPlayerLeftGameEventAsync);
        this._eventBus.subscribe(VesselMovedInDirectionEvent.id, this.onVesselMovedInDirectionEventAsync);
    }

    private unsubscribeAll() {
        this._eventBus.unsubscribe(ChatMessageSentEvent.id, this.onChatMessageSentAsync);
        this._eventBus.unsubscribe(PlayerAddedToVesselRoleEvent.id, this.onPlayerAddedToVesselRoleEventAsync);
        this._eventBus.unsubscribe(PlayerJoinedGameEvent.id, this.onPlayerJoinedGameEventAsync);
        this._eventBus.unsubscribe(PlayerLeftGameEvent.id, this.onPlayerLeftGameEventAsync);
        this._eventBus.unsubscribe(VesselMovedInDirectionEvent.id, this.onVesselMovedInDirectionEventAsync);
    }

    private createDomElements(ownerDocument: Document) {
        let chatElements = this.createChatElements(ownerDocument);
        this._chatWindow = chatElements["0"];
        this._chatHistory = chatElements["1"];
        this._chatForm = chatElements["2"];
        this._chatForm.addEventListener("submit", this.onChatFormSubmit);
        this._chatInput = chatElements["3"];
        this._chatInput.addEventListener("focus", this.onChatInputFocus);
        this._chatInput.addEventListener("blur", this.onChatInputBlur);
    }

    private destroyDomElements() {
        if (this._chatForm) {
            this._chatForm.removeEventListener("submit", this.onChatFormSubmit);
            this._chatForm = undefined;
        }
        if (this._chatInput) {
            this._chatInput.removeEventListener("focus", this.onChatInputFocus);
            this._chatInput.removeEventListener("blur", this.onChatInputBlur);
            this._chatInput = undefined;
        }
        if (this._chatHistory) {
            this._chatHistory = undefined;
        }
        if (this._chatWindow) {
            this._chatWindow = undefined;
        }
    }

    private async onChatMessageSentAsync(evt: IChatMessageSentEvent) {
        this.appendMessageToHistory(evt.message);
    }

    private async onPlayerJoinedGameEventAsync(evt: IPlayerJoinedGameEvent) {
        let messageText = `${evt.player.name} has joined the game`;
        this.appendGameNotificationToHistory(messageText);
    }

    private async onPlayerLeftGameEventAsync(evt: IPlayerLeftGameEvent) {
        let messageText = `${evt.player.name} has left the game`;
        this.appendGameNotificationToHistory(messageText);
    }

    private async onPlayerAddedToVesselRoleEventAsync(evt: IPlayerAddedToVesselRoleEvent) {
        let messageText = `${evt.player.name} is ${evt.vesselRole.toLocaleLowerCase()} of ${evt.vessel.name}`;
        this.appendGameNotificationToHistory(messageText);
    }

    private async onVesselMovedInDirectionEventAsync(evt: IVesselMovedInDirectionEvent) {
        if (this._app.currentVessel && evt.vessel.id == this._app.currentVessel.id) {
            return; // Don't display movemenents for our own vessel
        }
        if (this._app.currentVesselRoles.lastIndexOf(BallastAppConstants.VESSEL_ROLE_RADIOMAN) < 0) {
            return; // Don't display movements unless the player has the "Radioman" role
        }
        let directionalText = this.getDirectionalText(evt.direction);
        let messageText = `${evt.vessel.name} ⟴ ${directionalText}`;
        this.appendGameNotificationToHistory(messageText);
    }

    private getDirectionalText(direction: IDirection) {
        if (direction.north && direction.east) {
            return "NE";
        } else if (direction.north && direction.west) {
            return "NW";
        } else if (direction.north) {
            return "N";
        } else if (direction.south && direction.east) {
            return "SE";
        } else if (direction.south && direction.west) {
            return "SW";
        } else if(direction.south) {
            return "S";
        } else if (direction.east) {
            return "E";
        } else if (direction.west) {
            return "W";
        } else {
            return "";
        }
    }

    protected onAttached(ownerDocument: Document, parent: HTMLElement) {
        // Check if we need to create the chat window (and other elements)
        if (!this._chatWindow) {
            this.createDomElements(ownerDocument);
        }
        // Attach to parent DOM element
        if (this._chatWindow) {
            parent.appendChild(this._chatWindow);
        }
        // Subscribe to all application events
        this.subscribeAll();
    }

    protected onDetaching() {
        // Unsubscribe from all application events
        this.unsubscribeAll();
        // Remove from parent DOM element
        if (this._parent && this._chatWindow) {
            this._parent.removeChild(this._chatWindow);
        }            
    }

    protected onRender(renderingContext: IRenderingContext) {
        // Check if the user has hit the "enter" key to talk while not already on the chat input 
        let focusedElement = this._chatInput && this._chatInput.ownerDocument!.activeElement;
        let chatInputHasFocus = this._chatInput && focusedElement && (focusedElement == this._chatInput);
        if (!chatInputHasFocus && renderingContext.keyboard.enterIsDown()) {
            (<HTMLInputElement>this._chatInput).focus(); // Place input on chat window
        }
    }
    
    private createChatElements(ownerDocument: Document): [
        HTMLDivElement,
        HTMLUListElement,
        HTMLFormElement,
        HTMLInputElement
    ] {

        let chatWindow = ownerDocument.createElement("div");
        chatWindow.style.cssFloat = "right";
        chatWindow.style.position = "absolute";
        chatWindow.style.zIndex = "1000";
        chatWindow.style.right = "12px"; // parent has 2px border
        chatWindow.style.bottom = "12px"; // parent has 2px border
        chatWindow.style.height = "66%";
        chatWindow.style.width = "calc(40% - 2px)";
        chatWindow.style.borderWidth = "1px";
        chatWindow.style.borderStyle = "none"; //"solid";
        chatWindow.style.borderColor = "rgba(255, 255, 255, 0.1)";
        //chatWindow.style.backgroundColor = "rgba(0, 0, 0, 0.3)";

        let chatHistory = ownerDocument.createElement("ul");
        chatHistory.style.color = "white";
        chatHistory.style.textShadow = "1px 1px 2px rgb(0, 0, 0), -1px 1px 2px rgb(0, 0, 0), 1px -1px 2px rgb(0, 0, 0), -1px -1px 2px rgb(0, 0, 0)";
        chatHistory.style.marginTop = "10px";
        chatHistory.style.marginBottom = "10px";
        chatHistory.style.marginLeft = "5px";
        chatHistory.style.marginRight = "5px";
        chatHistory.style.padding = "0px";
        chatHistory.style.listStyle = "none";
        chatHistory.style.position = "absolute";
        chatHistory.style.bottom = "26px";
        chatHistory.style.right = "0px";
        chatHistory.style.left = "0px";
        chatHistory.style.overflowY = "auto";
        chatHistory.style.maxHeight = "calc(100% - 46px)";
        chatWindow.appendChild(chatHistory);

        let chatForm = ownerDocument.createElement("form");
        chatWindow.appendChild(chatForm);

        let chatInput = ownerDocument.createElement("input");
        chatInput.style.cssFloat = "bottom";
        chatInput.style.position = "absolute";
        chatInput.style.zIndex = "1001";
        chatInput.style.right = "0px";
        chatInput.style.bottom = "0px";
        chatInput.style.height = "25px";
        chatInput.style.width = "100%";
        chatInput.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
        chatInput.style.borderStyle = "solid";
        // chatInput.style.borderBottomStyle = "none";
        // chatInput.style.borderLeftStyle = "none";
        // chatInput.style.borderRightStyle = "none";
        chatInput.style.borderColor = "rgba(255, 255, 255, 0.1)";
        chatInput.style.color = "white";
        chatForm.appendChild(chatInput);

        return [chatWindow, chatHistory, chatForm, chatInput];
    }

    private onChatInputFocus(ev: FocusEvent) {
        this.suspendKeyboardWatching();
    }

    private onChatInputBlur(ev: FocusEvent) {
        setTimeout(() => {
            this.resumeKeyboardWatching();
        }, 250);
    }

    private onChatFormSubmit(ev: Event) {
        this.submitMessage();
        ev.preventDefault();
        return false;
    }

    private suspendKeyboardWatching() {
        this._keyboardWatcher.suspend();
    }

    private resumeKeyboardWatching() {
        this._keyboardWatcher.resume();
    }

    private appendTextToChatHistory(text: string, noFade?: boolean) {
        if (!this._chatHistory) {
            console.log("Chat history could not be displayed", text);
            return;
        }
        let item = this._chatHistory.ownerDocument!.createElement("li");
        item.innerText = text;
        this._chatHistory.appendChild(item);
        this._chatHistory.scrollTop = this._chatHistory.scrollHeight;
        if (!noFade) {
            this.fadeOutChildElement(this._chatHistory, item, 7.5);
        }
    }

    private fadeOutChildElement(parent: HTMLElement, item: HTMLElement, fadeSeconds: number) {
        var itemStyle = item.style;
        itemStyle.opacity = "1";
        var increment = (fadeSeconds * 1000) / 20;
        let fade = () => {
            var opacity = parseFloat(itemStyle.opacity || "0") - 0.05;
            itemStyle.opacity = opacity.toString();
            if (opacity < 0) {
                itemStyle.display="none";
                parent.removeChild(item);
            } else {
                setTimeout(fade, increment);
            }
        };
        fade();
    }

    private appendGameNotificationToHistory(notification: string) {
        this.appendTextToChatHistory(`${notification}`);
    }

    private appendMessageToHistory(message: IChatMessage) {
        this.appendTextToChatHistory(`[${message.fromPlayerName}]:  ${message.text}`);
    }

    private submitMessage() {
        if (this._chatInput) {
            let messageText = this._chatInput.value || "";
            if (!!messageText) {
                this.sendMessageFromTextAsync(messageText); // Fire and forget
            }
            this._chatInput.value = "";
            this._chatInput.blur();
        }
    }

    private getNowISOString() {
        return new Date(Date.now()).toISOString();
    }

    private async sendMessageFromTextAsync(text: string) {
        let game = this._app.currentGame;
        let player = this._app.currentPlayer;
        if (!game || !player) {
            return; // Player is not signed into a game
        }
        let channel = "global";
        try {
            await this._chatService.sendMessageAsync({
                gameId: game.id,
                channel: channel,
                fromPlayerId: player.id,
                fromPlayerName: player.name || null,
                sentOnDateIsoString: this.getNowISOString(),
                text: text
            });
        } catch {
            // TODO:  Display error that message could not be delivered
        }
    }

}