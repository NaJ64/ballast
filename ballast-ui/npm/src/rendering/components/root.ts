import { inject, injectable } from "inversify";
import { TYPES as BallastUi } from "../../dependency-injection/types";
import { RenderingComponentBase } from '../rendering-component';
import { RenderingMiddleware } from "../rendering-middleware";
import { CameraComponent } from "./camera";
import { ChatComponent } from "./chat";
import { SignInComponent } from "./sign-in";

export interface IRootComponentFactory { 
    create(): RootComponent;
}

@injectable()
export class RootComponent extends RenderingComponentBase {

    private readonly _camera: CameraComponent;
    private readonly _chat: ChatComponent;
    // private readonly _game: GameComponent;
    private readonly _signIn: SignInComponent;

    public constructor(
        @inject(BallastUi.Rendering.Components.CameraComponent) camera: CameraComponent,
        @inject(BallastUi.Rendering.Components.ChatComponent) chat: ChatComponent,
        //@inject(BallastUi.Rendering.Components.GameComponent) game: GameComponent,
        @inject(BallastUi.Rendering.Components.SignInComponent) signIn: SignInComponent
    ) {
        super();
        this._camera = camera;
        this._chat = chat;
        //this._game = game;
        this._signIn = signIn;
    }

    protected onAttached(parent: HTMLElement, middleware: RenderingMiddleware) {
        this._signIn.attach(parent, middleware);
        //this._game.attach(parent, middleware);
        this._camera.attach(parent, middleware);
        this._chat.attach(parent, middleware);
    }

    protected onDetaching(parent: HTMLElement) {
        this._chat.detach();
        this._camera.detach();
        //this._game.detach();
        this._signIn.detach();
    }

    protected onRender(): void {
        // Root component does not enlist in render loop
    }

}