import { ICreateVesselOptions } from './create-vessel-options';

export interface ICreateGameOptions {
    vesselOptions: ICreateVesselOptions[];
    boardSize?: number;
    boardShapeValue?: number;
}