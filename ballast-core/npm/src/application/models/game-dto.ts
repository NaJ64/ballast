import { IBoardDto } from "./board-dto";
import { IPlayerDto } from "./player-dto";
import { IVesselDto } from "./vessel-dto";

export interface IGameDto {
    id: string;
    board: IBoardDto;
    vessels: IVesselDto[];
    players: IPlayerDto[];
    createdIsoString: string;
    startedIsoString: string | null;
    endedIsoString: string | null;
}