import { IGame } from '../models/game';
import { ICreateVesselOptions } from '../value-objects/create-vessel-options';
import { IVesselMoveRequest } from '../value-objects/vessel-move-request';
import { ITileShape } from '../models/tile-shape';
import { IDisposable } from '../interfaces/disposable';
import { ICreateGameOptions } from '../value-objects/create-game-options';
import { IAddPlayerOptions } from '../value-objects/add-player-options';
import { IRemovePlayerOptions } from '../value-objects/remove-player-options';
import { IVessel } from '../models/vessel';

export interface IGameService {
    getAllGamesAsync(): Promise<IGame[]>;
    getGameAsync(gameId: string): Promise<IGame>;
    createGameAsync(options: ICreateGameOptions): Promise<IGame>;
    startGameAsync(gameId: string): Promise<IGame>;
    endGameAsync(gameId: string): Promise<IGame>;
    deleteGameAsync(gameId: string): Promise<void>;
    addPlayerToGameAsync(options: IAddPlayerOptions): Promise<IGame>;
    removePlayerFromGameAsync(options: IRemovePlayerOptions): Promise<IGame>;
    addPlayerToVesselAsync(options: IAddPlayerOptions): Promise<IVessel>;
    removePlayerFromVesselAsync(options: IRemovePlayerOptions): Promise<IVessel>;
    addPlayerToVesselRoleAsync(options: IAddPlayerOptions): Promise<IVessel>;
    removePlayerFromVesselRoleAsync(options: IRemovePlayerOptions): Promise<IVessel>;
    moveVesselAsync(request: IVesselMoveRequest): Promise<void>;
}