import { inject, injectable } from "inversify";
import { TYPES as BallastUi } from "../../dependency-injection/types";
import { RenderingComponentBase } from '../rendering-component';
import { RenderingMiddleware } from "../rendering-middleware";
import { BoardComponent } from "./board";
import { CameraComponent } from "./camera";
import { ChatComponent } from "./chat";
import { GameComponent } from "./game";
import { SignInComponent } from "./sign-in";
import { WorldComponent } from "./world";

export interface IRootComponentFactory { 
    create(): RootComponent;
}

@injectable()
export class RootComponent extends RenderingComponentBase {

    private readonly _board: BoardComponent;
    private readonly _camera: CameraComponent;
    private readonly _chat: ChatComponent;
    private readonly _game: GameComponent;
    private readonly _signIn: SignInComponent;
    private readonly _world: WorldComponent;

    public constructor(
        @inject(BallastUi.Rendering.Components.BoardComponent) board: BoardComponent,
        @inject(BallastUi.Rendering.Components.CameraComponent) camera: CameraComponent,
        @inject(BallastUi.Rendering.Components.ChatComponent) chat: ChatComponent,
        @inject(BallastUi.Rendering.Components.GameComponent) game: GameComponent,
        @inject(BallastUi.Rendering.Components.SignInComponent) signIn: SignInComponent,
        @inject(BallastUi.Rendering.Components.WorldComponent) world: WorldComponent
    ) {
        super();
        this._board = board;
        this._camera = camera;
        this._chat = chat;
        this._game = game;
        this._signIn = signIn;
        this._world = world;
    }

    protected onAttached(ownerDocument: Document, parent: HTMLElement, gameStyle: HTMLStyleElement, middleware: RenderingMiddleware) {
        // Attach child components
        this._signIn.attach(ownerDocument, parent, gameStyle, middleware);
        this._board.attach(ownerDocument, parent, gameStyle, middleware);
        this._game.attach(ownerDocument, parent, gameStyle, middleware);
        this._camera.attach(ownerDocument, parent, gameStyle, middleware);
        this._world.attach(ownerDocument, parent, gameStyle, middleware);
        this._chat.attach(ownerDocument, parent, gameStyle, middleware);
    }

    protected onDetaching() {
        // Detach child components
        this._chat.detach();
        this._world.detach();
        this._camera.detach();
        this._game.detach();
        this._board.detach();
        this._signIn.detach();
    }
    
}