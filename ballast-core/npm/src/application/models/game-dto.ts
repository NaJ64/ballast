import { IBoardDto } from "./board-dto";
import { IPlayerDto } from "./player-dto";
import { IVesselDto } from "./vessel-dto";

export interface IGameDto {
    id: string;
    board: IBoardDto;
    vessels: IVesselDto[];
    players: IPlayerDto[];
    createdOnDateIsoString: string;
    startedOnDateIsoString: string | null;
    endedOnDateIsoString: string | null;
}