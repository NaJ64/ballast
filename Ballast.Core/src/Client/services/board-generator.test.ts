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

test('has "createBoard()" method', () => {
    expect(boardGenerator.createBoard).not.toBeUndefined();
});

test('rejects board dimensions less than 3x3', () => {
    expect(() => { boardGenerator.createBoard(gameId, BoardType.Rectangle, TileShape.Square, 2, 3); }).toThrowError();
    expect(() => { boardGenerator.createBoard(gameId, BoardType.Rectangle, TileShape.Octagonal, 3, 2); }).toThrowError();
    expect(() => { boardGenerator.createBoard(gameId, BoardType.Rectangle, TileShape.Hexagonal, 1, 1); }).toThrowError();
    expect(() => { boardGenerator.createBoard(gameId, BoardType.RegularPolygon, TileShape.Square, 2, 3); }).toThrowError();
    expect(() => { boardGenerator.createBoard(gameId, BoardType.RegularPolygon, TileShape.Octagonal, 3, 2); }).toThrowError();
    expect(() => { boardGenerator.createBoard(gameId, BoardType.RegularPolygon, TileShape.Hexagonal, 1, 1); }).toThrowError();
});

test('creates 4x4 rectangular board of squares', () => {
    let board = boardGenerator.createBoard(gameId, BoardType.Rectangle, TileShape.Square, 4);
    expect(board.gameId).toBe(gameId);
    expect(board.tileShape).toBe(TileShape.Square);
    expect(board.getTile([0, 0, 0])).not.toBeUndefined();
    expect(board.getTile([1, -1, 0])).toBeUndefined();
    expect(board.getTile([6, -6, 0])).not.toBeUndefined();
    expect(board.getTile([0, -8, 8])).toBeUndefined();
    expect(board.tiles.length).toEqual(16);
});

test('creates 3x5 rectangular board of squares', () => {
    let board = boardGenerator.createBoard(gameId, BoardType.Rectangle, TileShape.Square, 3, 5);
    expect(board.gameId).toBe(gameId);
    expect(board.tileShape).toBe(TileShape.Square);
    expect(board.tiles.length).toEqual(15);
    expect(board.getTile([0, 0, 0])).not.toBeUndefined();
    expect(board.getTile([1, -1, 0])).toBeUndefined();
    expect(board.getTile([6, -6, 0])).toBeUndefined();
    expect(board.getTile([0, -8, 8])).not.toBeUndefined();
});

test('creates 5x3 rectangular board of octagons', () => {
    let board = boardGenerator.createBoard(gameId, BoardType.Rectangle, TileShape.Octagonal, 5, 3);
    expect(board.gameId).toBe(gameId);
    expect(board.tileShape).toBe(TileShape.Octagonal);
    expect(board.tiles.length).toEqual(15);
    expect(board.getTile([0, 0, 0])).not.toBeUndefined();
    expect(board.getTile([1, -1, 0])).toBeUndefined();
    expect(board.getTile([8, -8, 0])).not.toBeUndefined();
    expect(board.getTile([-3, -3, 6])).toBeUndefined();
});

test('creates 4x5 rectangular board of octagons', () => {
    let board = boardGenerator.createBoard(gameId, BoardType.Rectangle, TileShape.Octagonal, 5, 4);
    expect(board.gameId).toBe(gameId);
    expect(board.tileShape).toBe(TileShape.Octagonal);
    expect(board.tiles.length).toEqual(20);
    expect(board.getTile([0, 0, 0])).not.toBeUndefined();
    expect(board.getTile([1, -1, 0])).toBeUndefined();
    expect(board.getTile([8, -8, 0])).not.toBeUndefined();
    expect(board.getTile([-3, -3, 6])).not.toBeUndefined();
});

test('creates 6x3 rectangular board of hexagons', () => {
    let board = boardGenerator.createBoard(gameId, BoardType.Rectangle, TileShape.Hexagonal, 6, 3);
    expect(board.gameId).toBe(gameId);
    expect(board.tileShape).toBe(TileShape.Hexagonal);
    expect(board.tiles.length).toEqual(18);
    expect(board.getTile([0, 0, 0])).not.toBeUndefined();
    expect(board.getTile([1, -1, 0])).not.toBeUndefined();
    expect(board.getTile([5, -5, 0])).not.toBeUndefined();
    expect(board.getTile([6, -6, 0])).toBeUndefined();
    expect(board.getTile([-1, -1, 2])).not.toBeUndefined();
    expect(board.getTile([-1, -2, 3])).toBeUndefined();
});

test('creates 4x6 rectangular board of hexagons', () => {
    let board = boardGenerator.createBoard(gameId, BoardType.Rectangle, TileShape.Hexagonal, 4, 6);
    expect(board.gameId).toBe(gameId);
    expect(board.tileShape).toBe(TileShape.Hexagonal);
    expect(board.tiles.length).toEqual(24);
    expect(board.getTile([0, 0, 0])).not.toBeUndefined();
    expect(board.getTile([1, -1, 0])).not.toBeUndefined();
    expect(board.getTile([3, -3, 0])).not.toBeUndefined();
    expect(board.getTile([4, -4, 0])).toBeUndefined();
    expect(board.getTile([-2, -3, 5])).not.toBeUndefined();
    expect(board.getTile([-3, -3, 6])).toBeUndefined();
});

test('creates regular square with side length 3', () => {
    let board = boardGenerator.createBoard(gameId, BoardType.RegularPolygon, TileShape.Square, 3);
    expect(board.gameId).toBe(gameId);
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

// test('creates regular octagon with side length 3', () => {
//     let board = boardGenerator.createBoard(gameId, BoardType.RegularPolygon, TileShape.Octagonal, 3);
//     //console.log(board.tileMap.keys())
//     expect(board.gameId).toBe(gameId);
//     expect(board.tileShape).toBe(TileShape.Octagonal);
//     expect(board.tiles.length).toEqual(37);
// });