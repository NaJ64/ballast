import { inject, injectable } from "inversify";
import { TYPES as BallastUi } from "../../dependency-injection/types";
import { RenderingComponentBase } from '../rendering-component';
import { IRenderingContext } from "../rendering-context";
import { ChatComponent } from "./chat";
import { SignInComponent } from "./sign-in";

@injectable()
export class RootComponent extends RenderingComponentBase {

    // private readonly _camera: CameraComponent;
    private readonly _chat: ChatComponent;
    // private readonly _game: GameComponent;
    private readonly _signIn: SignInComponent;

    public constructor(
        //@inject(BallastUi.Rendering.RenderingComponents.CameraComponent) camera: CameraComponent,
        @inject(BallastUi.Rendering.RenderingComponents.ChatComponent) chat: ChatComponent,
        //@inject(BallastUi.Rendering.RenderingComponents.GameComponent) game: GameComponent,
        @inject(BallastUi.Rendering.RenderingComponents.SignInComponent) signIn: SignInComponent
    ) {
        super();
        this._chat = chat;
        this._signIn = signIn;
    }

    protected onAttached(parent: HTMLElement) {
        this._signIn.attach(parent);
        //this._game.attach(parent);
        //this._camera.attach(parent);
        this._chat.attach(parent);
    }

    protected onDetaching(parent: HTMLElement) {
        this._chat.detach();
        //this._camera.detach();
        //this._game.detach();
        this._signIn.detach();
    }

    protected onRender(renderingContext: IRenderingContext): void {
        // Root component does not enlist in render loop
    }

}