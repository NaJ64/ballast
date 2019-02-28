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
        return await this.createInvocationAsync<IGameDto[]>("GetAllGamesAsync");
    }    

    public async getGameAsync(gameId: string): Promise<IGameDto> {
        return await this.createInvocationAsync<IGameDto>("GetGameAsync", gameId);
    }

    public async getTestGameIdAsync(): Promise<string> {
        return await this.createInvocationAsync<string>("GetTestGameIdAsync");
    }

    public async createGameAsync(options: ICreateGameOptions): Promise<IGameDto> {
        return await this.createInvocationAsync<IGameDto>("CreateGameAsync", options);
    }

    public async startGameAsync(gameId: string): Promise<IGameDto> {
        return await this.createInvocationAsync<IGameDto>("StartGameAsync", gameId);
    }

    public async endGameAsync(gameId: string): Promise<IGameDto> {
        return await this.createInvocationAsync<IGameDto>("EndGameAsync", gameId);
    }

    public async deleteGameAsync(gameId: string): Promise<void> {
        await this.createInvocationAsync("DeleteGameAsync", gameId);
    }

    public async addPlayerToGameAsync(options: IAddPlayerOptions): Promise<IGameDto> {
        return await this.createInvocationAsync<IGameDto>("AddPlayerToGameAsync", options);
    }

    public async removePlayerFromGameAsync(options: IRemovePlayerOptions): Promise<IGameDto> {
        return await this.createInvocationAsync<IGameDto>("RemovePlayerFromGameAsync", options);
    }

    public async addPlayerToVesselAsync(options: IAddPlayerOptions): Promise<IVesselDto> {
        return await this.createInvocationAsync<IVesselDto>("AddPlayerToVesselAsync", options);
    }

    public async removePlayerFromVesselAsync(options: IRemovePlayerOptions): Promise<IVesselDto> {
        return await this.createInvocationAsync<IVesselDto>("RemovePlayerFromVesselAsync", options);
    }

    public async addPlayerToVesselRoleAsync(options: IAddPlayerOptions): Promise<IVesselDto> {
        return await this.createInvocationAsync<IVesselDto>("AddPlayerToVesselRoleAsync", options);
    }

    public async removePlayerFromVesselRoleAsync(options: IRemovePlayerOptions): Promise<IVesselDto> {
        return await this.createInvocationAsync<IVesselDto>("RemovePlayerFromVesselRoleAsync", options);
    }

    public async moveVesselAsync(request: IVesselMoveRequest): Promise<IVesselDto> {
        return await this.createInvocationAsync<IVesselDto>("MoveVesselAsync", request);
    }

}