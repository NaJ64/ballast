import { inject, injectable } from "inversify";
import { TYPES as BallastUi } from "../../dependency-injection/types";
import { RenderingComponentBase } from '../rendering-component';
import { RenderingMiddleware } from "../rendering-middleware";
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

    private readonly _camera: CameraComponent;
    private readonly _chat: ChatComponent;
    private readonly _game: GameComponent;
    private readonly _signIn: SignInComponent;
    private readonly _world: WorldComponent;

    public constructor(
        @inject(BallastUi.Rendering.Components.CameraComponent) camera: CameraComponent,
        @inject(BallastUi.Rendering.Components.ChatComponent) chat: ChatComponent,
        @inject(BallastUi.Rendering.Components.GameComponent) game: GameComponent,
        @inject(BallastUi.Rendering.Components.SignInComponent) signIn: SignInComponent,
        @inject(BallastUi.Rendering.Components.WorldComponent) world: WorldComponent
    ) {
        super();
        this._camera = camera;
        this._chat = chat;
        this._game = game;
        this._signIn = signIn;
        this._world = world;
    }

    protected onAttached(parent: HTMLElement, middleware: RenderingMiddleware) {
        this._signIn.attach(parent, middleware);
        this._game.attach(parent, middleware);
        this._camera.attach(parent, middleware);
        this._world.attach(parent, middleware);
        this._chat.attach(parent, middleware);
    }

    protected onDetaching() {
        this._chat.detach();
        this._world.detach();
        this._camera.detach();
        this._game.detach();
        this._signIn.detach();
    }

    protected onRender(): void {
        // Root component does not enlist in render loop
    }

}