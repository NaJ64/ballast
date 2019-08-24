import { Guid, IAddPlayerOptions, IGameService, IPlayerDto, ISignInService, TYPES as BallastCore } from "ballast-core";
import { Container } from "inversify";
import { BallastUiContainerModule } from "./dependency-injection/container-module";
import { TYPES as BallastUi } from "./dependency-injection/types";
import { IRenderer } from "./rendering/renderer";
import { IClientBootstrapper, TYPES as BallastClient } from "ballast-client";

export interface IBallastHtmlClient {
    startAsync(): Promise<void>;
}

export class BallastHtmlClient implements IBallastHtmlClient {

    private readonly _clientId: string;
    private readonly _host: HTMLElement;
    private readonly _serverUrl: string;
    private readonly _container: Container;

    public constructor(host: HTMLElement, serverUrl: string) {
        this._clientId = Guid.newGuid();
        this._host = host;
        this._serverUrl = serverUrl;
        this._container = new Container();
        this._container.load(new BallastUiContainerModule(options => {
            options.host = this._host,
            options.serverUrl = this._serverUrl,
            options.clientId = this._clientId
        }));
    }

    public async startAsync(): Promise<void> {
        let renderer = this._container.get<IRenderer>(BallastUi.Rendering.IRenderer);
        renderer.attach();
        renderer.startRenderLoop();
        let clientBootstrapper = this._container.get<IClientBootstrapper>(BallastClient.IClientBootstrapper);
        await clientBootstrapper.connectAsync();
        await this.startTestAsync();
    }

    public async startTestAsync() {
        // Sign in player using client id
        let playerId = this._clientId;
        let signInService = this._container.get<ISignInService>(BallastCore.Application.Services.ISignInService);
        let signedInPlayer: IPlayerDto | null = null;
        signedInPlayer = await signInService.signInAsync({
            playerId: playerId, 
            playerName: null,
            sentOnDateIsoString: new Date(Date.now()).toISOString()
        });
        // Get test game from game service
        let gameService = this._container.get<IGameService>(BallastCore.Application.Services.IGameService);
        let testGameId = await gameService.getTestGameIdAsync();
        let testGame = await gameService.getGameAsync(testGameId);
        // Add player to an empty vessel within the test game
        let nextEmptyVessel = testGame.vessels.find(x => !x.captainId && !x.radiomanId); // Get first empty vessel
        let addPlayerOptions: IAddPlayerOptions = {
            playerId: playerId,
            playerName: signedInPlayer ? signedInPlayer.name : null,
            gameId: testGameId,
            vesselId: nextEmptyVessel ? nextEmptyVessel.id : null,
            vesselRoles: []
        };
        let testGameWithPlayer = await gameService.addPlayerToGameAsync(addPlayerOptions);
        console.log(testGameWithPlayer);
    }

}