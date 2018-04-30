import { IVesselMoveRequest } from '../value-objects/vessel-move-request';

export interface IGameService {
    
    /**
     * Submits a request to perform a vessel move / position update
     * @param request 
     */
    requestVesselMoveAsync(request: IVesselMoveRequest): Promise<void>;

}