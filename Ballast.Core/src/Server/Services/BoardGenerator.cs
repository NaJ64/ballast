using Ballast.Core.Models;
using Ballast.Core.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Ballast.Core.Services
{
    public class BoardGenerator 
    {
        
        public Board CreateBoard(
            Guid id, 
            IBoardType boardType,
            ITileShape tileShape,
            int columnsOrSideLength,
            int? rows = null,
            decimal? landToWaterRatio = null
        ) 
        {
            
            // Get passable terrain types to use when figuring land/water tile ratio
            var passableTerrain = Terrain.List().Where(x => x.Passable);
            var impassableTerrain = Terrain.List().Where(x => !x.Passable);

            // Determine shape and tile layout
            var useTileShape = TileShape.FromObject(tileShape);
            var useBoardType = BoardType.FromObject(boardType);   

            // Validate column count
            if (columnsOrSideLength < 3)
                throw new Exception("Not enough tile column(s) were specified");

            // Validate row count
            if ((rows != null ? rows : columnsOrSideLength) < 3)
                throw new Exception("Not enough row column(s) were specified");
            
            // regular polygon boards enforce an odd number of column(s)
            if (useBoardType.CenterOrigin && ((columnsOrSideLength & 1) < 1))
                throw new Exception("Board types with centered origin require an odd number of column(s)");

            // Array to store rows of tiles (board)
            IList<Tile> tiles = new List<Tile>();

            // Build Rectangular board (fixed number of tiles per row)
            if (useBoardType.Equals(BoardType.Rectangle)) {
                // Calculate width and height
                var columnCount = columnsOrSideLength;
                var rowCount = (int)((rows != null) ? rows : columnsOrSideLength);  // Default to width (length of side)
                tiles = BuildRectangle(columnCount, rowCount, useTileShape);
            }

            // Build Regular polygon / convex shape board
            if (useBoardType.Equals(BoardType.RegularPolygon)) {
                var sideLength = columnsOrSideLength;
                if (useTileShape.Equals(TileShape.Square)) {
                    tiles = BuildSquare(sideLength, useBoardType.CenterOrigin);
                }
                if (useTileShape.Equals(TileShape.Octagon)) {
                    tiles = BuildRegularOctagon(sideLength, useBoardType.CenterOrigin);
                }
                if (useTileShape.Equals(TileShape.Hexagon) || useTileShape.Equals(TileShape.Circle)) {
                    tiles = BuildRegularHexagon(sideLength, useBoardType.CenterOrigin, useTileShape);
                }
            }

            // Create new board 
            var board = Board.FromProperties(
                boardTypeValue: useBoardType.Value,
                id: id,
                tiles: tiles,
                tileShapeValue: useTileShape.Value
            );

            // return the board
            return board;

        }

    private IList<Tile> BuildRectangle(int columnCount, int rowCount, TileShape tileShape) {
        var rectangle = new List<Tile>();
        var increment = (tileShape.DoubleIncrement ?? false) ? 2 : 1;
        for(var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
            var row = rowIndex * increment;
            for (var colIndex = 0; colIndex < columnCount; colIndex++) {
                var col = colIndex * increment;
                var cubicCoordinates = CubicCoordinates.FromOffset(
                    OffsetCoordinates.FromProperties(row: row, col: col)
                );
                rectangle.Add(Tile.FromProperties(
                    cubicCoordinates: cubicCoordinates,
                    tileShapeValue: tileShape.Value,
                    terrainValue: Terrain.Water.Value
                ));
            }
        }
        return rectangle;
    }

    // private buildSquare(sideLength: number, centerOrigin: boolean) {

    //     let square: Tile[] = [];
    //     let increment = TileShape.Square.doubleIncrement ? 2 : 1;
    //     let centerOffset = centerOrigin ? (((sideLength * increment) / 2) - 1) : 0;

    //     // Loop through rows x columns
    //     for (let rowIndex = 0; rowIndex < sideLength; rowIndex++) {
    //         let row = (rowIndex * increment) - centerOffset;
    //         for (let colIndex = 0; colIndex < sideLength; colIndex++) {
    //             let col = (colIndex * increment) - centerOffset;
    //             let cubicCoordinates = CubicCoordinates.fromOffset(
    //                 OffsetCoordinates.fromObject({ row: row, col: col })
    //             );
    //             square.push(Tile.fromObject({
    //                 cubicCoordinates: cubicCoordinates,
    //                 tileShapeValue: TileShape.Square.value,
    //                 terrainValue: Terrain.Water.value
    //             }));
    //         }
    //     }

    //     // return the square tiles
    //     return square;

    // }

    // private buildRegularOctagon(sideLength: number, centerOrigin: boolean) {

    //     let octagon: Tile[] = [];
    //     let increment = TileShape.Octagon.doubleIncrement ? 2 : 1;
    //     let maxLength = sideLength + 2 * (sideLength - 1);
    //     let centerOffset = centerOrigin ? (((maxLength * increment) / 2) - 1) : 0;
        
    //     // Build top portion of octagon
    //     let rowLength = sideLength - 2;
    //     let rowIndex = -1;
    //     while(rowLength < (maxLength - 2)) {
    //         rowLength += 2;
    //         rowIndex++;
    //         let row = (rowIndex * increment) - centerOffset;
    //         let colOffset = (maxLength - rowLength) / 2;
    //         for(let colIndex = 0; colIndex < rowLength; colIndex++) {
    //             let col = ((colIndex + colOffset) * increment) - centerOffset;
    //             octagon.push(Tile.fromObject({
    //                 cubicCoordinates: CubicCoordinates.fromOffset(
    //                     OffsetCoordinates.fromObject({ row: row, col: col })
    //                 ),
    //                 tileShapeValue: TileShape.Octagon.value,
    //                 terrainValue: Terrain.Water.value
    //             }));
    //         }
    //     }

    //     // Build middle portion of octagon
    //     rowIndex++;
    //     let middleRowCount = rowIndex + sideLength;
    //     for(rowIndex; rowIndex < middleRowCount; rowIndex++) {
    //         rowLength = maxLength;
    //         let row = (rowIndex * increment) - centerOffset;
    //         for(let colIndex = 0; colIndex < rowLength; colIndex++) {
    //             let col = (colIndex * increment) - centerOffset;
    //             octagon.push(Tile.fromObject({
    //                 cubicCoordinates: CubicCoordinates.fromOffset(
    //                     OffsetCoordinates.fromObject({ row: row, col: col })
    //                 ),
    //                 tileShapeValue: TileShape.Octagon.value,
    //                 terrainValue: Terrain.Water.value
    //             }));
    //         }
    //     }

    //     // Build bottom portion of octagon
    //     rowIndex--;
    //     while(rowLength > sideLength) {
    //         rowLength -= 2;
    //         rowIndex++;
    //         let row = (rowIndex * increment) - centerOffset;
    //         let colOffset = (maxLength - rowLength) / 2;
    //         for(let colIndex = 0; colIndex < rowLength; colIndex++) {
    //             let col = ((colIndex + colOffset) * increment) - centerOffset;
    //             octagon.push(Tile.fromObject({
    //                 cubicCoordinates: CubicCoordinates.fromOffset(
    //                     OffsetCoordinates.fromObject({ row: row, col: col })
    //                 ),
    //                 tileShapeValue: TileShape.Octagon.value,
    //                 terrainValue: Terrain.Water.value
    //             }));
    //         }
    //     }

    //     // return the octagon tiles
    //     return octagon;

    // }

    // private buildRegularHexagon(sideLength: number, centerOrigin: boolean, tileShape?: TileShape) {

    //     let hexagon: Tile[] = [];
    //     let increment = TileShape.Hexagon.doubleIncrement ? 2 : 1;
    //     let maxLength = (2 * sideLength) - 1;
    //     let centerOffset = centerOrigin ? ((sideLength * increment) - 1) : 0;
    //     if (typeof tileShape == 'undefined') {
    //         tileShape = TileShape.Hexagon;
    //     }

    //     // Build top portion of hexagon
    //     let rowLength = sideLength - 1;
    //     let rowIndex = -1;
    //     while(rowLength < (maxLength - 1)) {
    //         rowLength++;
    //         rowIndex++;
    //         let row = (rowIndex * increment) - centerOffset;
    //         let colOffset = Math.floor((maxLength - rowLength) / 2); // TODO:  Fix bug where column offset produces fractional value
    //         for(let colIndex = 0; colIndex < rowLength; colIndex++) {
    //             let col = ((colIndex + colOffset) * increment) - centerOffset;
    //             hexagon.push(Tile.fromObject({
    //                 cubicCoordinates: CubicCoordinates.fromOffset(
    //                     OffsetCoordinates.fromObject({ row: row, col: col })
    //                 ),
    //                 tileShapeValue: tileShape.value,
    //                 terrainValue: Terrain.Water.value
    //             }));
    //         }
    //     }
        
    //     // Build middle row of hexagon
    //     rowIndex++;
    //     rowLength = maxLength;
    //     let row = (rowIndex * increment) - centerOffset;
    //     for(let colIndex = 0; colIndex < rowLength; colIndex++) {
    //         let col = (colIndex * increment) - centerOffset;
    //         hexagon.push(Tile.fromObject({
    //             cubicCoordinates: CubicCoordinates.fromOffset(
    //                 OffsetCoordinates.fromObject({ row: row, col: col })
    //             ),
    //             tileShapeValue: tileShape.value,
    //             terrainValue: Terrain.Water.value
    //         }));
    //     }

    //     // Build bottom portion of hexagon
    //     while(rowLength > sideLength) {
    //         rowLength--;
    //         rowIndex++;
    //         let row = (rowIndex * increment) - centerOffset;
    //         let colOffset = Math.floor((maxLength - rowLength) / 2); // TODO:  Fix bug where column offset produces fractional value
    //         for(let colIndex = 0; colIndex < rowLength; colIndex++) {
    //             let col = ((colIndex + colOffset) * increment) - centerOffset;
    //             hexagon.push(Tile.fromObject({
    //                 cubicCoordinates: CubicCoordinates.fromOffset(
    //                     OffsetCoordinates.fromObject({ row: row, col: col })
    //                 ),
    //                 tileShapeValue: tileShape.value,
    //                 terrainValue: Terrain.Water.value
    //             }));
    //         }
    //     }

    //     // return the hexagon tiles
    //     return hexagon;
        
    // }

    }
}