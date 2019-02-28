import { ICreateVesselOptions } from "./create-vessel-options";

export interface ICreateGameOptions {
    vesselOptions: ICreateVesselOptions[];
    boardSize: number | null;
    boardType: string | null;
    boardShape: string | null;
    landToWaterRatio: number | null;
}