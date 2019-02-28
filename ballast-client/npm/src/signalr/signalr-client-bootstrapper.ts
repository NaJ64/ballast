import { IApplicationEventEmitter, IChatService, IGameService, ISignInService, TYPES as BallastCore } from "ballast-core";
import { inject, injectable } from "inversify";
import { IClientBootstrapper } from "../client-bootstrapper";
import { SignalRClientApplicationEventEmitter } from "./services/signalr-client-application-event-emitter";
import { SignalRClientChatService } from "./services/signalr-client-chat-service";
import { SignalRClientGameService } from "./services/signalr-client-game-service";
import { SignalRClientSignInService } from "./services/signalr-client-sign-in-service";

@injectable()
export class SignalRClientBootstrapper implements IClientBootstrapper {

    private readonly _applicationEventEmitter: SignalRClientApplicationEventEmitter;
    private readonly _chatService: SignalRClientChatService;
    private readonly _gameService: SignalRClientGameService;
    private readonly _signInService: SignalRClientSignInService;

    public constructor(
        @inject(BallastCore.Application.Services.IApplicationEventEmitter) applicationEventEmitter: IApplicationEventEmitter,
        @inject(BallastCore.Application.Services.IChatService) chatService: IChatService,
        @inject(BallastCore.Application.Services.IGameService) gameService: IGameService,
        @inject(BallastCore.Application.Services.ISignInService) signInService: ISignInService
    ) {
        this._applicationEventEmitter = applicationEventEmitter as SignalRClientApplicationEventEmitter;
        this._chatService = chatService as SignalRClientChatService;
        this._gameService = gameService as SignalRClientGameService;
        this._signInService = signInService as SignalRClientSignInService;
    }

    public async connectAsync(): Promise<void> {
        await Promise.all([
            this._applicationEventEmitter.connectAsync(),
            this._chatService.connectAsync(),
            this._gameService.connectAsync(),
            this._signInService.connectAsync()
        ]);
        this._applicationEventEmitter.start();
    }

}