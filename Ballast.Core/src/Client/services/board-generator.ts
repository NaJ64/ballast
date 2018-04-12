import { IBoard, Board } from '../models/board';
import { IBoardType, BoardType } from '../models/board-type';
import { ITile, Tile } from '../models/tile';
import { ITileShape, TileShape } from '../models/tile-shape';
import { IAxialCoordinates, AxialCoordinates } from '../models/axial-coordinates';
import { ICubicCoordinates, CubicCoordinates } from '../models/cubic-coordinates';
import { IOffsetCoordinates, OffsetCoordinates} from '../models/offset-coordinates';

export class BoardGenerator {

    public createBoard(tileShape: ITileShape, boardType: IBoardType, sizeWidth: number, sizeHeight?: number) {

        let useTileShape = TileShape.fromObject(tileShape);
        let useBoardType = BoardType.fromObject(boardType);   

        let width = sizeWidth;
        let height = sizeHeight || sizeWidth;  
        if (useBoardType.equals(BoardType.RegularPolygon) && sizeWidth != sizeHeight) {
            throw new Error('Regular polygon board(s) cannot specify different width/height values');
        }

        // Rectangular board (fixed number of tiles per row)
        if (useBoardType.equals(BoardType.Rectangle)) {

            if (useTileShape.equals(TileShape.Square)) {

            }

            if (useTileShape.equals(TileShape.Octagonal)) {

            }

            if (useTileShape.equals(TileShape.Hexagonal)) {

            }

        }

        // Regular polygon / convex shaped board (use side length to determine widest row width)
        if (useBoardType.equals(BoardType.RegularPolygon)) {
            
            if (useTileShape.equals(TileShape.Square)) {

            }

            if (useTileShape.equals(TileShape.Octagonal)) {

            }

            if (useTileShape.equals(TileShape.Hexagonal)) {
                
            }

        }
        
    }

}