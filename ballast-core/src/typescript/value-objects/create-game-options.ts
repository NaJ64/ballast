import { ICreateVesselOptions } from './create-vessel-options';

export interface ICreateGameOptions {
    vesselOptions: ICreateVesselOptions[];
    boardSize: number | null;
    boardTypeValue: number | null;
    boardShapeValue: number | null;
    landToWaterRatio: number | null;
}