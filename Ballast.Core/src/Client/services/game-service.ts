import { IVesselMoveRequest } from '../value-objects/vessel-move-request';

export interface IGameService {
    
    /**
     * Sends a request for a vessel move / position update to the server
     * @param request 
     */
    requestVesselMoveAsync(request: IVesselMoveRequest): Promise<void>;

}