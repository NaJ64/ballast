import 'jest';
import 'reflect-metadata';
import * as uuid from 'uuid';
import { BoardGenerator } from './board-generator';
import { Board } from '../models/board';
import { BoardType } from '../models/board-type';
import { TileShape } from '../models/tile-shape';

// Rectangle of squares
let boardGenerator = new BoardGenerator();
let gameId = uuid.v4();

test('instance has "createBoard()" method', () => {
    expect(boardGenerator.createBoard).not.toBeUndefined();
});

test('creates 4x4 rectangular board of squares', () => {
    let board = boardGenerator.createBoard(gameId, TileShape.Square, BoardType.Rectangle, 4, 5);
    //console.log(board.tiles);
    expect(board.getTile([0, 0, 0])).not.toBeUndefined();
    expect(board.getTile([1, -1, 0])).toBeUndefined();
});