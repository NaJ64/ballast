import { IBoard, Board } from '../models/board';
import { IBoardType, BoardType } from '../models/board-type';
import { ITileShape, TileShape } from '../models/tile-shape';

export class BoardGenerator {
    public createBoard(tileShape: ITileShape, boardType: IBoardType, sizeWidth: number, sizeHeight?: number) {
        let useTileShape = TileShape.fromObject(tileShape);
        let useBoardType = BoardType.fromObject(boardType);   
        let width = sizeWidth;
        let height = sizeHeight || sizeWidth;  
        if (useBoardType.equals(BoardType.RegularPolygon) && sizeWidth != sizeHeight) {
            throw new Error('Regular polygon board(s) cannot specify different width/height values');
        }
        // TODO:  Create tiles collection here
    }
}