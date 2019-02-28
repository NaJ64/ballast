import { IDirection } from "ballast-core";

export interface IVesselCompass {
    getDirection(tileShape: string): IDirection;
}
