import { BoardTypeName } from "./board-type";
import { ITileDto } from "./tile";
import { TileShapeName } from "./tile-shape";

export interface IBoardDto {
    id: string;
    type: BoardTypeName;
    centerOrigin: boolean;
    tiles: ITileDto[];
    tileShape: TileShapeName;
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