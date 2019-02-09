import { IChatService, IGameService, ISignInService, TYPES as BallastCore } from "ballast-core";
import { inject, injectable } from "inversify";
import { IClientBootstrapper } from "../client-bootstrapper";
import { TYPES as BallastClient } from "../dependency-injection/types";
import { SignalRClientChatService } from "./services/signalr-client-chat-service";
import { SignalRClientGameService } from "./services/signalr-client-game-service";
import { SignalRClientSignInService } from "./services/signalr-client-sign-in-service";
import { ISignalRClientEventSubscriber, SignalRClientEventSubscriber } from "./signalr-client-event-subscriber";

@injectable()
export class SignalRClientBootstrapper implements IClientBootstrapper {

    private readonly _eventSubscriber: SignalRClientEventSubscriber;
    private readonly _chatService: SignalRClientChatService;
    private readonly _gameService: SignalRClientGameService;
    private readonly _signInService: SignalRClientSignInService;

    public constructor(
        @inject(BallastClient.SignalR.ISignalRClientEventSubscriber) eventSubscriber: ISignalRClientEventSubscriber,
        @inject(BallastCore.Application.Services.IChatService) chatService: IChatService,
        @inject(BallastCore.Application.Services.IGameService) gameService: IGameService,
        @inject(BallastCore.Application.Services.ISignInService) signInService: ISignInService
    ) {
        this._eventSubscriber = eventSubscriber as SignalRClientEventSubscriber;
        this._chatService = chatService as SignalRClientChatService;
        this._gameService = gameService as SignalRClientGameService;
        this._signInService = signInService as SignalRClientSignInService;
    }

    public async connectAsync(): Promise<void> {
        await Promise.all([
            this._eventSubscriber.connectAsync(),
            this._chatService.connectAsync(),
            this._gameService.connectAsync(),
            this._signInService.connectAsync()
        ]);
    }

}