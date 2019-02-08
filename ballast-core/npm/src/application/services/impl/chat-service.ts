import { inject, injectable } from "inversify";
import { TYPES as BallastCore } from "../../../dependency-injection/types";
import { IEventBus } from "../../../messaging/event-bus";
import { ChatMessageSentEvent } from "../../events";
import { IChatMessage } from "../../models/chat-message";
import { IChatService } from "../chat-service";
import { ISignInService } from "./../sign-in-service";

@injectable()
export class DomainChatService implements IChatService {

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