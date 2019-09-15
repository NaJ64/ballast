import { IBoardDto } from "./board";
import { IPlayerDto } from "./player";
import { IVesselDto } from "./vessel";

export interface IGameDto {
    id: string;
    board: IBoardDto;
    vessels: IVesselDto[];
    players: IPlayerDto[];
    createdOnDateIsoString: string;
    startedOnDateIsoString: string | null;
    endedOnDateIsoString: string | null;
}