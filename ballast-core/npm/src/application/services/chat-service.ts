import { IDisposable } from "../../interfaces/disposable";
import { IChatMessage } from "../models/chat-message";
import { IEventBus } from "../../messaging/event-bus";
import { ISignInService } from "./sign-in-service";
import { injectable, inject } from "inversify";
import { TYPES as BallastCore } from "../../dependency-injection/types";
import { ChatMessageSentEvent } from "../events";

export interface IChatService extends IDisposable {
    sendMessageAsync(message: IChatMessage): Promise<void>;
}

@injectable()
export class ChatService implements IChatService {

    private readonly _eventBus: IEventBus;
    private readonly _signInService: ISignInService

    public constructor(
        @inject(BallastCore.Messaging.IEventBus) eventBus: IEventBus,
        @inject(BallastCore.Application.ISignInService) signInService: ISignInService

    ) {
        this._eventBus = eventBus;
        this._signInService = signInService;
    }

    public dispose() { }

    public async sendMessageAsync(message: IChatMessage): Promise<void> {
        var player = await this._signInService.getSignedInPlayerAsync(message.fromPlayerId);
        message.fromPlayerName = player && player.name || message.fromPlayerName;
        await this._eventBus.publishAsync(ChatMessageSentEvent.fromMessage(message));
        //throw new Error("Not implemented.")
    }

}