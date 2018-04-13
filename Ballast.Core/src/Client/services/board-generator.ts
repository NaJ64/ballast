import { IBoard, Board } from '../models/board';
import { IBoardType, BoardType } from '../models/board-type';
import { ITile, Tile } from '../models/tile';
import { ITileShape, TileShape } from '../models/tile-shape';
import { IAxialCoordinates, AxialCoordinates } from '../models/axial-coordinates';
import { ICubicCoordinates, CubicCoordinates } from '../models/cubic-coordinates';
import { IOffsetCoordinates, OffsetCoordinates} from '../models/offset-coordinates';

export class BoardGenerator {

    public createBoard(
        gameId: string, 
        tileShape: TileShape, 
        boardType: IBoardType, 
        columnsOrSideLength: number, 
        rows?: number
    ) {

        // Determine shape and tile layout
        let useTileShape = TileShape.fromObject(tileShape);
        let useBoardType = BoardType.fromObject(boardType);   

        // Validate column count
        if (useBoardType.centerOrigin && (columnsOrSideLength % 1 < 1)) {
            throw new Error('Board types with centered origin require an odd number of column(s)');
        }

        // Array to store rows of tiles (board)
        let tiles: ITile[] = [];

        // Build Rectangular board (fixed number of tiles per row)
        if (useBoardType.equals(BoardType.Rectangle)) {
            // Calculate width and height
            let columnCount = columnsOrSideLength;
            let rowCount = rows || columnsOrSideLength;  // Default to width (length of side)
            tiles = this.buildRectangle(columnCount, rowCount, tileShape);
        }

        // Build Regular polygon / convex shape board
        if (useBoardType.equals(BoardType.RegularPolygon)) {
            let sideLength = columnsOrSideLength;
            if (useTileShape.equals(TileShape.Square)) {
                tiles = this.buildSquare(sideLength);
            }
            if (useTileShape.equals(TileShape.Octagonal)) {
                tiles = this.buildRegularOctagon(sideLength);
            }
            if (useTileShape.equals(TileShape.Hexagonal)) {
                tiles = this.buildRegularHexagon(sideLength);
            }
        }

        // Create new board 
        let board = Board.fromObject({ 
            boardType: useBoardType,
            gameId: gameId,
            tiles: tiles,
            tileShape: useTileShape
        });

        // return the board
        return board;
        
    }

    private buildRectangle(columnCount: number, rowCount: number, tileShape: TileShape) {
        let rectangle: Tile[] = [];
        let increment = tileShape.doubleIncrement ? 2 : 1;
        for(let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
            let row = rowIndex * increment;
            for (let colIndex = 0; colIndex < columnCount; colIndex++) {
                let col = colIndex * increment;
                let cubicCoordinates = CubicCoordinates.fromOffset(
                    OffsetCoordinates.fromObject({ row: row, col: col })
                );
                rectangle.push(Tile.fromObject({
                    cubicCoordinates: cubicCoordinates,
                    tileShape: tileShape
                }));
            }
        }
        return rectangle;
    }

    private buildSquare(sideLength: number) {
        let square: Tile[] = [];
        let increment = TileShape.Square.doubleIncrement ? 2 : 1;
        for (let rowIndex = 0; rowIndex < sideLength; rowIndex++) {
            let row = rowIndex * increment;
            for (let colIndex = 0; colIndex < sideLength; colIndex++) {
                let col = colIndex * increment;
                let cubicCoordinates = CubicCoordinates.fromOffset(
                    OffsetCoordinates.fromObject({ row: row, col: col })
                );
                square.push(Tile.fromObject({
                    cubicCoordinates: cubicCoordinates,
                    tileShape: TileShape.Square
                }));
            }
        }
        return square;
    }

    private buildRegularOctagon(sideLength: number) {
        let octagon: Tile[] = [];
        // TODO:  Build octagon
        return octagon;
    }

    private buildRegularHexagon(sideLength: number) {
        let hexagon: Tile[] = [];
        // TODO:  Build hexagon
        return hexagon;
    }

}