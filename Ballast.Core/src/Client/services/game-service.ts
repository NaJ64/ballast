import { IGame } from '../models/game';
import { ICreateVesselOptions } from '../value-objects/create-vessel-options';
import { IVesselMoveRequest } from '../value-objects/vessel-move-request';
import { ITileShape } from '../models/tile-shape';

export interface IGameService {
    
    /**
     * Submits a request to perform a vessel move / position update
     * @param request 
     */
    moveVesselAsync(request: IVesselMoveRequest): Promise<void>;

    /**
     * Requests a new game using the specified options
     * @param vesselOptions 
     * Single-vessel options for initial game configuration
     * @param boardSize 
     * (Optional) Initial board size (must be an odd integer)
     * If not specified, the default board size will be used
     * @param boardShape 
     * (Optional) Initial board/tile shape
     * If not specified a default board/tile shape will be used
     */
    createNewGameAsync(
        vesselOptions: ICreateVesselOptions,
        boardSize: number | undefined,
        boardShape: ITileShape | undefined
    ): Promise<IGame>;

    /**
     * Requests a new game using the specified options
     * @param vesselOptions 
     * Multiple vessel options for initial game configuration
     * @param boardSize 
     * (Optional) Initial board size (must be an odd integer)
     * If not specified, the default board size will be used
     * @param boardShape 
     * (Optional) Initial board/tile shape
     * If not specified a default board/tile shape will be used
     */
    createNewGameAsync(
        vesselOptions: ICreateVesselOptions[],
        boardSize: number | undefined,
        boardShape: ITileShape | undefined
    ): Promise<IGame>;

}