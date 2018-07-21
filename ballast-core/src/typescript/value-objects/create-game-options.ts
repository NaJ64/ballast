import { ICreateVesselOptions } from './create-vessel-options';

export interface ICreateGameOptions {
    vesselOptions: ICreateVesselOptions[];
    boardSize?: number;
    boardTypeValue?: number;
    boardShapeValue?: number;
}