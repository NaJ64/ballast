import { ITileDto } from "./tile-dto";

export interface IBoardDto {
    id: string;
    type: string;
    centerOrigin: boolean;
    tiles: ITileDto[];
    tileShape: string;
    applyHexRowScaling: boolean;
    doubleIncrement: boolean;
    hasDirectionNorth: boolean;
    hasDirectionSouth: boolean;
    hasDirectionWest: boolean;
    hasDirectionEast: boolean;
    hasDirectionNorthWest: boolean;
    hasDirectionNorthEast: boolean;
    hasDirectionSouthWest: boolean;
    hasDirectionSouthEast: boolean;
}