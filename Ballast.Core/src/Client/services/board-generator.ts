import { IBoard, Board } from '../models/board';
import { IBoardType, BoardType } from '../models/board-type';
import { ITile, Tile } from '../models/tile';
import { ITileShape, TileShape } from '../models/tile-shape';
import { IAxialCoordinates, AxialCoordinates } from '../models/axial-coordinates';
import { ICubicCoordinates, CubicCoordinates } from '../models/cubic-coordinates';
import { IOffsetCoordinates, OffsetCoordinates} from '../models/offset-coordinates';

export class BoardGenerator {

    public createBoard(tileShape: TileShape, boardType: IBoardType, sizeWidth: number, sizeHeight?: number) {

        // Determine shape and tile layout
        let useTileShape = TileShape.fromObject(tileShape);
        let useBoardType = BoardType.fromObject(boardType);   

        // Calculate width and height (number of tiles on board)
        let width = sizeWidth;
        let height = sizeHeight || sizeWidth;  
        if (useBoardType.equals(BoardType.RegularPolygon) && sizeWidth != sizeHeight) {
            throw new Error('Regular polygon board(s) cannot specify different width/height values');
        }

        // Array to store rows of tiles (board)
        let tiles: ITile[][] = [];

        // Build Rectangular board (fixed number of tiles per row)
        if (useBoardType.equals(BoardType.Rectangle)) {
            tiles = this.buildRectangle(width, height, tileShape);
        }

        // Build Regular polygon / convex shape board
        if (useBoardType.equals(BoardType.RegularPolygon)) {
            if (useTileShape.equals(TileShape.Square)) {

            }
            if (useTileShape.equals(TileShape.Octagonal)) {

            }
            if (useTileShape.equals(TileShape.Hexagonal)) {
                
            }
        }
        
    }

    private buildRectangle(width: number, height: number, tileShape: TileShape) {
        let rectangle: Tile[][] = [];
        let increment = tileShape.doubleIncrement ? 2 : 1;
        for(let rowIndex = 0; rowIndex < height; rowIndex++) {
            let row = rowIndex * increment;
            let newRow: Tile[] = [];
            for (let colIndex = 0; colIndex < width; colIndex++) {
                let col = colIndex * increment;
                let cubicCoordinates = CubicCoordinates.fromOffset(
                    OffsetCoordinates.fromObject({ row: row, col: col })
                );
                let newTile = Tile.fromObject({
                    cubicCoordinates: cubicCoordinates,
                    tileShape: tileShape
                });
                newRow.push(newTile);
            }
            rectangle.push(newRow);
        }
        return rectangle;
    }

}