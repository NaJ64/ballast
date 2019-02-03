import { ITileDto } from "./tile-dto";

export interface IBoardDto {
    type: string;
    centerOrigin: boolean;
    id: string;
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