import { IDisposable } from "../../interfaces/disposable";
import { IAddPlayerOptions } from "../models/add-player-options";
import { ICreateGameOptions } from "../models/create-game-options";
import { IGameDto } from "../models/game-dto";
import { IRemovePlayerOptions } from "../models/remove-player-options";
import { IVesselDto } from "../models/vessel-dto";
import { IVesselMoveRequest } from "../models/vessel-move-request";

export interface IGameService extends IDisposable {
    getAllGamesAsync(): Promise<IGameDto[]>;
    getGameAsync(gameId: string): Promise<IGameDto>;
    getTestGameIdAsync(): Promise<string>;
    createGameAsync(options: ICreateGameOptions): Promise<IGameDto>;
    startGameAsync(gameId: string): Promise<IGameDto>;
    endGameAsync(gameId: string): Promise<IGameDto>;
    deleteGameAsync(gameId: string): Promise<void>;
    addPlayerToGameAsync(options: IAddPlayerOptions): Promise<IGameDto>;
    removePlayerFromGameAsync(options: IRemovePlayerOptions): Promise<IGameDto>;
    addPlayerToVesselAsync(options: IAddPlayerOptions): Promise<IVesselDto>;
    removePlayerFromVesselAsync(options: IRemovePlayerOptions): Promise<IVesselDto>;
    addPlayerToVesselRoleAsync(options: IAddPlayerOptions): Promise<IVesselDto>;
    removePlayerFromVesselRoleAsync(options: IRemovePlayerOptions): Promise<IVesselDto>;
    moveVesselAsync(request: IVesselMoveRequest): Promise<IVesselDto>;
}
