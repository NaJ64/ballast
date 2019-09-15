import { TerrainName } from "./terrain";
import { TileShapeName } from "./tile-shape";

export interface ITileDto {
    orderedTriple: number[];
    tileShape: TileShapeName;
    terrain: TerrainName;
    passable: boolean;
}