import { IAddPlayerOptions, ICreateGameOptions, IGameDto, IGameService, IRemovePlayerOptions, IVesselDto, IVesselMoveRequest } from "ballast-core";

export class SignalRClientGameService implements IGameService {
    dispose(): void {
        throw new Error("Method not implemented.");
    }
    getAllGamesAsync(): Promise<IGameDto[]> {
        throw new Error("Method not implemented.");
    }    
    getGameAsync(gameId: string): Promise<IGameDto> {
        throw new Error("Method not implemented.");
    }
    getTestGameIdAsync(): Promise<string> {
        throw new Error("Method not implemented.");
    }
    createGameAsync(options: ICreateGameOptions): Promise<IGameDto> {
        throw new Error("Method not implemented.");
    }
    startGameAsync(gameId: string): Promise<IGameDto> {
        throw new Error("Method not implemented.");
    }
    endGameAsync(gameId: string): Promise<IGameDto> {
        throw new Error("Method not implemented.");
    }
    deleteGameAsync(gameId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    addPlayerToGameAsync(options: IAddPlayerOptions): Promise<IGameDto> {
        throw new Error("Method not implemented.");
    }
    removePlayerFromGameAsync(options: IRemovePlayerOptions): Promise<IGameDto> {
        throw new Error("Method not implemented.");
    }
    addPlayerToVesselAsync(options: IAddPlayerOptions): Promise<IVesselDto> {
        throw new Error("Method not implemented.");
    }
    removePlayerFromVesselAsync(options: IRemovePlayerOptions): Promise<IVesselDto> {
        throw new Error("Method not implemented.");
    }
    addPlayerToVesselRoleAsync(options: IAddPlayerOptions): Promise<IVesselDto> {
        throw new Error("Method not implemented.");
    }
    removePlayerFromVesselRoleAsync(options: IRemovePlayerOptions): Promise<IVesselDto> {
        throw new Error("Method not implemented.");
    }
    moveVesselAsync(request: IVesselMoveRequest): Promise<IVesselDto> {
        throw new Error("Method not implemented.");
    }
}