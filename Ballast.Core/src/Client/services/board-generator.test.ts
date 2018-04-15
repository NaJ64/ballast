import 'jest';
import 'reflect-metadata';
import * as uuid from 'uuid';
import { BoardGenerator } from './board-generator';
import { Board } from '../models/board';
import { BoardType } from '../models/board-type';
import { TileShape } from '../models/tile-shape';

// Rectangle of squares
let boardGenerator = new BoardGenerator();
let boardId = uuid.v4();

test('rejects board dimensions less than 3x3', () => {
    expect(() => { boardGenerator.createBoard(boardId, BoardType.Rectangle, TileShape.Square, 2, 3); }).toThrowError();
    expect(() => { boardGenerator.createBoard(boardId, BoardType.Rectangle, TileShape.Octagon, 3, 2); }).toThrowError();
    expect(() => { boardGenerator.createBoard(boardId, BoardType.Rectangle, TileShape.Hexagon, 1, 1); }).toThrowError();
    expect(() => { boardGenerator.createBoard(boardId, BoardType.RegularPolygon, TileShape.Square, 2, 3); }).toThrowError();
    expect(() => { boardGenerator.createBoard(boardId, BoardType.RegularPolygon, TileShape.Octagon, 3, 2); }).toThrowError();
    expect(() => { boardGenerator.createBoard(boardId, BoardType.RegularPolygon, TileShape.Hexagon, 1, 1); }).toThrowError();
});

test('creates 4x4 rectangular board of squares', () => {
    let board = boardGenerator.createBoard(boardId, BoardType.Rectangle, TileShape.Square, 4);
    expect(board.id).toBe(boardId);
    expect(board.tileShape).toBe(TileShape.Square);
    expect(board.getTile([0, 0, 0])).not.toBeUndefined();
    expect(board.getTile([1, -1, 0])).toBeUndefined();
    expect(board.getTile([6, -6, 0])).not.toBeUndefined();
    expect(board.getTile([0, -8, 8])).toBeUndefined();
    expect(board.tiles.length).toEqual(16);
});

test('creates 3x5 rectangular board of squares', () => {
    let board = boardGenerator.createBoard(boardId, BoardType.Rectangle, TileShape.Square, 3, 5);
    expect(board.id).toBe(boardId);
    expect(board.tileShape).toBe(TileShape.Square);
    expect(board.tiles.length).toEqual(15);
    expect(board.getTile([0, 0, 0])).not.toBeUndefined();
    expect(board.getTile([1, -1, 0])).toBeUndefined();
    expect(board.getTile([6, -6, 0])).toBeUndefined();
    expect(board.getTile([0, -8, 8])).not.toBeUndefined();
});

test('creates 5x3 rectangular board of octagons', () => {
    let board = boardGenerator.createBoard(boardId, BoardType.Rectangle, TileShape.Octagon, 5, 3);
    expect(board.id).toBe(boardId);
    expect(board.tileShape).toBe(TileShape.Octagon);
    expect(board.tiles.length).toEqual(15);
    expect(board.getTile([0, 0, 0])).not.toBeUndefined();
    expect(board.getTile([1, -1, 0])).toBeUndefined();
    expect(board.getTile([8, -8, 0])).not.toBeUndefined();
    expect(board.getTile([-3, -3, 6])).toBeUndefined();
});

test('creates 4x5 rectangular board of octagons', () => {
    let board = boardGenerator.createBoard(boardId, BoardType.Rectangle, TileShape.Octagon, 5, 4);
    expect(board.id).toBe(boardId);
    expect(board.tileShape).toBe(TileShape.Octagon);
    expect(board.tiles.length).toEqual(20);
    expect(board.getTile([0, 0, 0])).not.toBeUndefined();
    expect(board.getTile([1, -1, 0])).toBeUndefined();
    expect(board.getTile([8, -8, 0])).not.toBeUndefined();
    expect(board.getTile([-3, -3, 6])).not.toBeUndefined();
});

test('creates 6x3 rectangular board of hexagons', () => {
    let board = boardGenerator.createBoard(boardId, BoardType.Rectangle, TileShape.Hexagon, 6, 3);
    expect(board.id).toBe(boardId);
    expect(board.tileShape).toBe(TileShape.Hexagon);
    expect(board.tiles.length).toEqual(18);
    expect(board.getTile([0, 0, 0])).not.toBeUndefined();
    expect(board.getTile([1, -1, 0])).not.toBeUndefined();
    expect(board.getTile([5, -5, 0])).not.toBeUndefined();
    expect(board.getTile([6, -6, 0])).toBeUndefined();
    expect(board.getTile([-1, -1, 2])).not.toBeUndefined();
    expect(board.getTile([-1, -2, 3])).toBeUndefined();
});

test('creates 4x6 rectangular board of hexagons', () => {
    let board = boardGenerator.createBoard(boardId, BoardType.Rectangle, TileShape.Hexagon, 4, 6);
    expect(board.id).toBe(boardId);
    expect(board.tileShape).toBe(TileShape.Hexagon);
    expect(board.tiles.length).toEqual(24);
    expect(board.getTile([0, 0, 0])).not.toBeUndefined();
    expect(board.getTile([1, -1, 0])).not.toBeUndefined();
    expect(board.getTile([3, -3, 0])).not.toBeUndefined();
    expect(board.getTile([4, -4, 0])).toBeUndefined();
    expect(board.getTile([-2, -3, 5])).not.toBeUndefined();
    expect(board.getTile([-3, -3, 6])).toBeUndefined();
});

test('creates regular square with side length 3', () => {
    let board = boardGenerator.createBoard(boardId, BoardType.RegularPolygon, TileShape.Square, 3);
    expect(board.id).toBe(boardId);
    expect(board.tileShape).toBe(TileShape.Square);
    expect(board.tiles.length).toEqual(9);
    expect(board.getTile([0, 0, 0])).not.toBeUndefined();
    expect(board.getTile([-1, 3, -2])).not.toBeUndefined();
    expect(board.getTile([0, 2, -2])).toBeUndefined();
    expect(board.getTile([3, -1, -2])).not.toBeUndefined();
    expect(board.getTile([5, -3, -2])).toBeUndefined();
    expect(board.getTile([1, -3, 2])).not.toBeUndefined();
    expect(board.getTile([0, -4, 4])).toBeUndefined();
});

test('creates regular octagon with side length 3', () => {
    let board = boardGenerator.createBoard(boardId, BoardType.RegularPolygon, TileShape.Octagon, 3);
    expect(board.id).toBe(boardId);
    expect(board.tileShape).toBe(TileShape.Octagon);
    expect(board.tiles.length).toEqual(37);
    expect(board.getTile([-1, 7, -6])).toBeUndefined();
    expect(board.getTile([3, 3, -6])).not.toBeUndefined();
    expect(board.getTile([9, -3, -6])).toBeUndefined();
    expect(board.getTile([-5, 7, -2])).not.toBeUndefined();
    expect(board.getTile([0, 0, 0])).not.toBeUndefined();
    expect(board.getTile([1, -1, 0])).toBeUndefined();
    expect(board.getTile([5, -7, 2])).not.toBeUndefined();
    expect(board.getTile([-8, 4, 4])).toBeUndefined();
    expect(board.getTile([-6, 2, 4])).not.toBeUndefined();
    expect(board.getTile([2, -6, 4])).not.toBeUndefined();
    expect(board.getTile([4, -8, 4])).toBeUndefined();
    expect(board.getTile([-3, -3, 6])).not.toBeUndefined();
    expect(board.getTile([-7, 1, 6])).toBeUndefined();
    expect(board.getTile([1, -7, 6])).toBeUndefined();
});

test('creates regular hexagon with side length 3', () => {
    let board = boardGenerator.createBoard(boardId, BoardType.RegularPolygon, TileShape.Hexagon, 3);
    expect(board.id).toBe(boardId);
    expect(board.tileShape).toBe(TileShape.Hexagon);
    expect(board.tiles.length).toEqual(19);
    expect(board.getTile([-1, 3, -2])).toBeUndefined();
    expect(board.getTile([0, 2, -2])).not.toBeUndefined();
    expect(board.getTile([-3, 3, 0])).toBeUndefined();
    expect(board.getTile([-2, 2, 0])).not.toBeUndefined();
    expect(board.getTile([0, 0, 0])).not.toBeUndefined();
    expect(board.getTile([2, -2, 0])).not.toBeUndefined();
    expect(board.getTile([3, -3, 0])).toBeUndefined();
    expect(board.getTile([0, -2, 2])).not.toBeUndefined();
    expect(board.getTile([1, -3, 2])).toBeUndefined();
});