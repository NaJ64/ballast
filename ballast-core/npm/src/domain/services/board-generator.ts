import { Board } from "../models/board";
import { BoardType } from "../models/board-type";
import { CubicCoordinates } from "../models/cubic-coordinates";
import { OffsetCoordinates } from "../models/offset-coordinates";
import { Terrain } from "../models/terrain";
import { Tile } from "../models/tile";
import { TileShape } from "../models/tile-shape";

export interface IBoardGenerator {
    createBoard(
        id: string,
        boardType: BoardType,
        tileShape: TileShape,
        columnsOrSideLength: number,
        rows?: number,
        landToWaterRatio?: number
    ): Board;
}

export class BoardGenerator implements IBoardGenerator {

    public createBoard(
        id: string,
        boardType: BoardType,
        tileShape: TileShape,
        columnsOrSideLength: number,
        rows?: number,
        landToWaterRatio?: number
    ) {

        // Validate column count
        if (columnsOrSideLength < 3) {
            throw new Error('Not enough tile column(s) were specified');
        }

        // Validate row count
        if ((rows || columnsOrSideLength) < 3) {
            throw new Error('Not enough row column(s) were specified');
        }

        // regular polygon boards enforce an odd number of column(s)
        if (boardType.centerOrigin && ((columnsOrSideLength & 1) < 1)) {
            throw new Error('Board types with centered origin require an odd number of column(s)');
        }

        // Array to store rows of tiles (board)
        let tiles: Tile[] = [];

        // Build Rectangular board (fixed number of tiles per row)
        if (boardType.equals(BoardType.Rectangle)) {
            // Calculate width and height
            let columnCount = columnsOrSideLength;
            let rowCount = rows || columnsOrSideLength;  // Default to width (length of side)
            tiles = this.buildRectangle(columnCount, rowCount, tileShape);
        }

        // Build Regular polygon / convex shape board
        if (boardType.equals(BoardType.RegularPolygon)) {
            let sideLength = columnsOrSideLength;
            if (tileShape.equals(TileShape.Square)) {
                tiles = this.buildSquare(sideLength, boardType.centerOrigin);
            }
            if (tileShape.equals(TileShape.Octagon)) {
                tiles = this.buildRegularOctagon(sideLength, boardType.centerOrigin);
            }
            if (tileShape.equals(TileShape.Hexagon) || tileShape.equals(TileShape.Circle)) {
                tiles = this.buildRegularHexagon(sideLength, boardType.centerOrigin, tileShape);
            }
        }

        // Get a terrain type for each tile
        let impassableTerrain = Terrain.list().filter(x => !x.passable);
        let passableTerrain = Terrain.list().filter(x => x.passable);
        for (let tile of tiles) {
            let terrain = this.getRandomTerrain(landToWaterRatio, impassableTerrain, passableTerrain)
            tile.terrain = terrain;
        }

        // Create new board 
        let board = new Board(
            id,
            boardType,
            tileShape,
            tiles
        );

        // return the board
        return board;

    }

    private getRandomTerrain(landToWaterRatio?: number, impassableTerrain?: Terrain[], passableTerrain?: Terrain[]): Terrain {

        // Definitively set land-to-water ratio & percentages
        landToWaterRatio = landToWaterRatio || 1;
        let impassablePercentage = landToWaterRatio / (landToWaterRatio + 1);
        let passablePercentage = 1 - impassablePercentage;

        // Get passable terrain types to use when figuring land/water tile ratio
        impassableTerrain = impassableTerrain || Terrain.list().filter(x => !x.passable);
        passableTerrain = passableTerrain || Terrain.list().filter(x => x.passable);

        // Determine if the terrain should be passable or impassable
        let terrainChoices: Terrain[] = [];
        let randomPercentage = Math.random();

        // Compare random percentage against weighted probability of each choice (ascending in order of greatest choice probability)
        var total = 0.0;
        if (passablePercentage >= impassablePercentage) {
            // Passable (higher probability)
            total += passablePercentage;
            if (terrainChoices == null && total >= randomPercentage) {
                terrainChoices = passableTerrain;
            }
            // Impassable (lower probability)
            total += impassablePercentage;
            if (terrainChoices == null && total >= randomPercentage) {
                terrainChoices = impassableTerrain;
            }
        } else {
            // Impassable (higher probability)
            total += impassablePercentage;
            if (terrainChoices == null && total >= randomPercentage) {
                terrainChoices = impassableTerrain;
            }
            // Passable (lower probability)
            total += passablePercentage;
            if (terrainChoices == null && total >= randomPercentage) {
                terrainChoices = passableTerrain;
            }
        }

        // Return a random terrain from the chosen array
        let terrain = terrainChoices[Math.floor(Math.random() * terrainChoices.length)];
        return terrain;

    }

    private buildRectangle(columnCount: number, rowCount: number, tileShape: TileShape) {
        let rectangle: Tile[] = [];
        let increment = tileShape.doubleIncrement ? 2 : 1;
        for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
            let row = rowIndex * increment;
            for (let colIndex = 0; colIndex < columnCount; colIndex++) {
                let col = colIndex * increment;
                let cubicCoordinates = CubicCoordinates.fromOffset(
                    OffsetCoordinates.fromOrderedPair([col, row])
                );
                rectangle.push(new Tile(
                    cubicCoordinates,
                    tileShape,
                    Terrain.Water
                ));
            }
        }
        return rectangle;
    }

    private buildSquare(sideLength: number, centerOrigin: boolean) {

        let square: Tile[] = [];
        let increment = TileShape.Square.doubleIncrement ? 2 : 1;
        let centerOffset = centerOrigin ? (((sideLength * increment) / 2) - 1) : 0;

        // Loop through rows x columns
        for (let rowIndex = 0; rowIndex < sideLength; rowIndex++) {
            let row = (rowIndex * increment) - centerOffset;
            for (let colIndex = 0; colIndex < sideLength; colIndex++) {
                let col = (colIndex * increment) - centerOffset;
                let cubicCoordinates = CubicCoordinates.fromOffset(
                    OffsetCoordinates.fromOrderedPair([col, row])
                );
                square.push(new Tile(
                    cubicCoordinates,
                    TileShape.Square,
                    Terrain.Water
                ));
            }
        }

        // return the square tiles
        return square;

    }

    private buildRegularOctagon(sideLength: number, centerOrigin: boolean) {

        let octagon: Tile[] = [];
        let increment = TileShape.Octagon.doubleIncrement ? 2 : 1;
        let maxLength = sideLength + 2 * (sideLength - 1);
        let centerOffset = centerOrigin ? (((maxLength * increment) / 2) - 1) : 0;

        // Build top portion of octagon
        let rowLength = sideLength - 2;
        let rowIndex = -1;
        while (rowLength < (maxLength - 2)) {
            rowLength += 2;
            rowIndex++;
            let row = (rowIndex * increment) - centerOffset;
            let colOffset = (maxLength - rowLength) / 2;
            for (let colIndex = 0; colIndex < rowLength; colIndex++) {
                let col = ((colIndex + colOffset) * increment) - centerOffset;
                octagon.push(new Tile(
                     CubicCoordinates.fromOffset(
                        OffsetCoordinates.fromOrderedPair([col, row])
                    ),
                    TileShape.Octagon,
                    Terrain.Water
                ));
            }
        }

        // Build middle portion of octagon
        rowIndex++;
        let middleRowCount = rowIndex + sideLength;
        for (rowIndex; rowIndex < middleRowCount; rowIndex++) {
            rowLength = maxLength;
            let row = (rowIndex * increment) - centerOffset;
            for (let colIndex = 0; colIndex < rowLength; colIndex++) {
                let col = (colIndex * increment) - centerOffset;
                octagon.push(new Tile(
                    CubicCoordinates.fromOffset(
                        OffsetCoordinates.fromOrderedPair([col, row])
                    ),
                    TileShape.Octagon,
                    Terrain.Water
                ));
            }
        }

        // Build bottom portion of octagon
        rowIndex--;
        while (rowLength > sideLength) {
            rowLength -= 2;
            rowIndex++;
            let row = (rowIndex * increment) - centerOffset;
            let colOffset = (maxLength - rowLength) / 2;
            for (let colIndex = 0; colIndex < rowLength; colIndex++) {
                let col = ((colIndex + colOffset) * increment) - centerOffset;
                octagon.push(new Tile(
                    CubicCoordinates.fromOffset(
                        OffsetCoordinates.fromOrderedPair([col, row])
                    ),
                    TileShape.Octagon,
                    Terrain.Water
                ));
            }
        }

        // return the octagon tiles
        return octagon;

    }

    private buildRegularHexagon(sideLength: number, centerOrigin: boolean, tileShape?: TileShape) {

        let hexagon: Tile[] = [];
        let increment = TileShape.Hexagon.doubleIncrement ? 2 : 1;
        let maxLength = (2 * sideLength) - 1;
        let centerOffset = centerOrigin ? ((sideLength * increment) - 1) : 0;
        if (typeof tileShape == 'undefined') {
            tileShape = TileShape.Hexagon;
        }

        // Build top portion of hexagon
        let rowLength = sideLength - 1;
        let rowIndex = -1;
        while (rowLength < (maxLength - 1)) {
            rowLength++;
            rowIndex++;
            let row = (rowIndex * increment) - centerOffset;
            let colOffset = Math.floor((maxLength - rowLength) / 2); // TODO:  Fix bug where column offset produces fractional value
            for (let colIndex = 0; colIndex < rowLength; colIndex++) {
                let col = ((colIndex + colOffset) * increment) - centerOffset;
                hexagon.push(new Tile(
                    CubicCoordinates.fromOffset(
                        OffsetCoordinates.fromOrderedPair([col, row])
                    ),
                    tileShape,
                    Terrain.Water
                ));
            }
        }

        // Build middle row of hexagon
        rowIndex++;
        rowLength = maxLength;
        let row = (rowIndex * increment) - centerOffset;
        for (let colIndex = 0; colIndex < rowLength; colIndex++) {
            let col = (colIndex * increment) - centerOffset;
            hexagon.push(new Tile(
                CubicCoordinates.fromOffset(
                    OffsetCoordinates.fromOrderedPair([col, row])
                ),
                tileShape,
                Terrain.Water
            ));
        }

        // Build bottom portion of hexagon
        while (rowLength > sideLength) {
            rowLength--;
            rowIndex++;
            let row = (rowIndex * increment) - centerOffset;
            let colOffset = Math.floor((maxLength - rowLength) / 2); // TODO:  Fix bug where column offset produces fractional value
            for (let colIndex = 0; colIndex < rowLength; colIndex++) {
                let col = ((colIndex + colOffset) * increment) - centerOffset;
                hexagon.push(new Tile(
                    CubicCoordinates.fromOffset(
                        OffsetCoordinates.fromOrderedPair([col, row])
                    ),
                    tileShape,
                    Terrain.Water
                ));
            }
        }

        // return the hexagon tiles
        return hexagon;

    }

}