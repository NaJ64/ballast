import { IAddPlayerOptions, ICreateGameOptions, IGameDto, IGameService, IRemovePlayerOptions, IVesselDto, IVesselMoveRequest } from "ballast-core";
import { inject, injectable } from "inversify";
import { TYPES as BallastClient } from "../../dependency-injection/types";
import { ISignalRClientOptions } from "../signalr-client-options";
import { SignalRClientServiceBase } from "../signalr-client-service-base";

@injectable()
export class SignalRClientGameService extends SignalRClientServiceBase implements IGameService {

    public static readonly hubName: string = "gamehub";
    public get hubName() {
        return SignalRClientGameService.hubName;
    }

    public constructor(
        @inject(BallastClient.SignalR.ISignalRClientOptions) serviceOptions: ISignalRClientOptions
    ) {
        super(serviceOptions);
    }
    
    public async getAllGamesAsync(): Promise<IGameDto[]> {
        return await this.createInvocationAsync<IGameDto[]>("getAllGamesAsync");
    }    

    public async getGameAsync(gameId: string): Promise<IGameDto> {
        return await this.createInvocationAsync<IGameDto>("getGameAsync", gameId);
    }

    public async getTestGameIdAsync(): Promise<string> {
        return await this.createInvocationAsync<string>("getTestGameIdAsync");
    }

    public async createGameAsync(options: ICreateGameOptions): Promise<IGameDto> {
        return await this.createInvocationAsync<IGameDto>("createGameAsync", options);
    }

    public async startGameAsync(gameId: string): Promise<IGameDto> {
        return await this.createInvocationAsync<IGameDto>("startGameAsync", gameId);
    }

    public async endGameAsync(gameId: string): Promise<IGameDto> {
        return await this.createInvocationAsync<IGameDto>("endGameAsync", gameId);
    }

    public async deleteGameAsync(gameId: string): Promise<void> {
        await this.createInvocationAsync("deleteGameAsync", gameId);
    }

    public async addPlayerToGameAsync(options: IAddPlayerOptions): Promise<IGameDto> {
        return await this.createInvocationAsync<IGameDto>("addPlayerToGameAsync", options);
    }

    public async removePlayerFromGameAsync(options: IRemovePlayerOptions): Promise<IGameDto> {
        return await this.createInvocationAsync<IGameDto>("removePlayerFromGameAsync", options);
    }

    public async addPlayerToVesselAsync(options: IAddPlayerOptions): Promise<IVesselDto> {
        return await this.createInvocationAsync<IVesselDto>("addPlayerToVesselAsync", options);
    }

    public async removePlayerFromVesselAsync(options: IRemovePlayerOptions): Promise<IVesselDto> {
        return await this.createInvocationAsync<IVesselDto>("removePlayerFromVesselAsync", options);
    }

    public async addPlayerToVesselRoleAsync(options: IAddPlayerOptions): Promise<IVesselDto> {
        return await this.createInvocationAsync<IVesselDto>("addPlayerToVesselRoleAsync", options);
    }

    public async removePlayerFromVesselRoleAsync(options: IRemovePlayerOptions): Promise<IVesselDto> {
        return await this.createInvocationAsync<IVesselDto>("removePlayerFromVesselRoleAsync", options);
    }

    public async moveVesselAsync(request: IVesselMoveRequest): Promise<IVesselDto> {
        return await this.createInvocationAsync<IVesselDto>("moveVesselAsync", request);
    }

}