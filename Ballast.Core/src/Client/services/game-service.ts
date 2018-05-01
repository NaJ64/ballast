import { IVesselMoveRequest } from '../value-objects/vessel-move-request';

export interface IGameService {
    
    /**
     * Submits a request to perform a vessel move / position update
     * @param request 
     */
    moveVesselAsync(request: IVesselMoveRequest): Promise<void>;

}