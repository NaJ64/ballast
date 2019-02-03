using Ballast.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Ballast.Core.Domain.Services
{    
    public interface IBoardGenerator : IDisposable
    {
        Board CreateBoard(
            Guid id,
            BoardType boardType,
            TileShape tileShape,
            int columnsOrSideLength,
            int? rows = null,
            double? landToWaterRatio = null
        );
    }
    public class BoardGenerator : IBoardGenerator
    {

        public void Dispose() { }

        public Board CreateBoard(
            Guid id,
            BoardType boardType,
            TileShape tileShape,
            int columnsOrSideLength,
            int? rows = null,
            double? landToWaterRatio = null
        )
        {

            // Determine shape and tile layout
            var useTileShape = tileShape;
            var useBoardType = boardType;

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
            if (useBoardType.Equals(BoardType.Rectangle))
            {
                // Calculate width and height
                var columnCount = columnsOrSideLength;
                var rowCount = (int)((rows != null) ? rows : columnsOrSideLength);  // Default to width (length of side)
                tiles = BuildRectangle(columnCount, rowCount, useTileShape);
            }

            // Build Regular polygon / convex shape board
            if (useBoardType.Equals(BoardType.RegularPolygon))
            {
                var sideLength = columnsOrSideLength;
                if (useTileShape.Equals(TileShape.Square))
                {
                    tiles = BuildSquare(sideLength, useBoardType.CenterOrigin);
                }
                if (useTileShape.Equals(TileShape.Octagon))
                {
                    tiles = BuildRegularOctagon(sideLength, useBoardType.CenterOrigin);
                }
                if (useTileShape.Equals(TileShape.Hexagon) || useTileShape.Equals(TileShape.Circle))
                {
                    tiles = BuildRegularHexagon(sideLength, useBoardType.CenterOrigin, useTileShape);
                }
            }

            // Get a terrain type for each tile
            var impassableTerrain = Terrain.List().Where(x => !x.Passable);
            var passableTerrain = Terrain.List().Where(x => x.Passable);
            foreach (var tile in tiles) 
            {
                var terrain = GetRandomTerrain(landToWaterRatio, impassableTerrain, passableTerrain);
                tile.SetTerrain(terrain);
            }

            // Create new board 
            var board = Board.FromProperties(
                boardType: useBoardType,
                id: id,
                tiles: tiles,
                tileShape: useTileShape
            );

            // return the board
            return board;

        }

        private Terrain GetRandomTerrain(
            double? landToWaterRatio = null, 
            IEnumerable<Terrain> impassableTerrain = null, 
            IEnumerable<Terrain> passableTerrain = null
        ) 
        {

            // Definitively set land-to-water ratio & percentages
            var useLandToWaterRatio = (landToWaterRatio.GetValueOrDefault() > 0) ? landToWaterRatio.GetValueOrDefault() : 1;
            var impassablePercentage = useLandToWaterRatio / (useLandToWaterRatio + 1);
            var passablePercentage = 1 - impassablePercentage;

            // Get passable terrain types to use when figuring land/water tile ratio
            var useImpassableTerrain = (impassableTerrain ?? Terrain.List().Where(x => !x.Passable)).ToList();
            var usePassableTerrain = (passableTerrain ?? Terrain.List().Where(x => x.Passable)).ToList();

            // Determine if the terrain should be passable or impassable
            IList<Terrain> terrainChoices = null;
            var randomPercentage = new Random().NextDouble();

            // Compare random percentage against weighted probability of each choice (ascending in order of greatest choice probability)
            var total = 0.0;
            if (passablePercentage >= impassablePercentage) {
                // Passable
                total += passablePercentage;
                if (terrainChoices == null && total >= randomPercentage)
                {
                    terrainChoices = usePassableTerrain;
                }
                // Impassable
                total += impassablePercentage;
                if (terrainChoices == null && total >= randomPercentage)
                {
                    terrainChoices = useImpassableTerrain;
                }
            } else {
                // Impassable
                total += impassablePercentage;
                if (terrainChoices == null && total >= randomPercentage)
                {
                    terrainChoices = useImpassableTerrain;
                }
                // Passable
                total += passablePercentage;
                if (terrainChoices == null && total >= randomPercentage)
                {
                    terrainChoices = usePassableTerrain;
                }
            }

            // Return a random terrain from the chosen array
            var terrain = terrainChoices[new Random().Next(terrainChoices.Count)];
            return terrain;

        }

        private IList<Tile> BuildRectangle(int columnCount, int rowCount, TileShape tileShape)
        {
            var rectangle = new List<Tile>();
            var increment = (tileShape.DoubleIncrement ?? false) ? 2 : 1;
            for (var rowIndex = 0; rowIndex < rowCount; rowIndex++)
            {
                var row = rowIndex * increment;
                for (var colIndex = 0; colIndex < columnCount; colIndex++)
                {
                    var col = colIndex * increment;
                    var cubicCoordinates = CubicCoordinates.FromOffset(
                        OffsetCoordinates.FromProperties(row: row, col: col)
                    );
                    rectangle.Add(Tile.FromProperties(
                        cubicCoordinates: cubicCoordinates,
                        tileShape: tileShape,
                        terrain: Terrain.Water
                    ));
                }
            }
            return rectangle;
        }

        private IList<Tile> BuildSquare(int sideLength, bool centerOrigin)
        {

            var square = new List<Tile>();
            var increment = (TileShape.Square.DoubleIncrement ?? false) ? 2 : 1;
            var centerOffset = centerOrigin ? (((sideLength * increment) / 2) - 1) : 0;

            // Loop through rows x columns
            for (var rowIndex = 0; rowIndex < sideLength; rowIndex++)
            {
                var row = (rowIndex * increment) - centerOffset;
                for (var colIndex = 0; colIndex < sideLength; colIndex++)
                {
                    var col = (colIndex * increment) - centerOffset;
                    var cubicCoordinates = CubicCoordinates.FromOffset(
                        OffsetCoordinates.FromProperties(row: row, col: col)
                    );
                    square.Add(Tile.FromProperties(
                        cubicCoordinates: cubicCoordinates,
                        tileShape: TileShape.Square,
                        terrain: Terrain.Water
                    ));
                }
            }

            // return the square tiles
            return square;

        }

        private IList<Tile> BuildRegularOctagon(int sideLength, bool centerOrigin)
        {

            var octagon = new List<Tile>();
            var increment = (TileShape.Octagon.DoubleIncrement ?? false) ? 2 : 1;
            var maxLength = sideLength + 2 * (sideLength - 1);
            var centerOffset = centerOrigin ? (((maxLength * increment) / 2) - 1) : 0;

            // Build top portion of octagon
            var rowLength = sideLength - 2;
            var rowIndex = -1;
            while (rowLength < (maxLength - 2))
            {
                rowLength += 2;
                rowIndex++;
                var row = (rowIndex * increment) - centerOffset;
                var colOffset = (maxLength - rowLength) / 2;
                for (var colIndex = 0; colIndex < rowLength; colIndex++)
                {
                    var col = ((colIndex + colOffset) * increment) - centerOffset;
                    octagon.Add(Tile.FromProperties(
                        cubicCoordinates: CubicCoordinates.FromOffset(
                            OffsetCoordinates.FromProperties(row: row, col: col)
                        ),
                        tileShape: TileShape.Octagon,
                        terrain: Terrain.Water
                    ));
                }
            }

            // Build middle portion of octagon
            rowIndex++;
            var middleRowCount = rowIndex + sideLength;
            int middleRowIndex;
            for (middleRowIndex = rowIndex; middleRowIndex < middleRowCount; middleRowIndex++)
            {
                rowLength = maxLength;
                var row = (middleRowIndex * increment) - centerOffset;
                for (var colIndex = 0; colIndex < rowLength; colIndex++)
                {
                    var col = (colIndex * increment) - centerOffset;
                    octagon.Add(Tile.FromProperties(
                        cubicCoordinates: CubicCoordinates.FromOffset(
                            OffsetCoordinates.FromProperties(row: row, col: col)
                        ),
                        tileShape: TileShape.Octagon,
                        terrain: Terrain.Water
                    ));
                }
            }
            rowIndex = middleRowIndex;

            // Build bottom portion of octagon
            rowIndex--;
            while (rowLength > sideLength)
            {
                rowLength -= 2;
                rowIndex++;
                var row = (rowIndex * increment) - centerOffset;
                var colOffset = (maxLength - rowLength) / 2;
                for (var colIndex = 0; colIndex < rowLength; colIndex++)
                {
                    var col = ((colIndex + colOffset) * increment) - centerOffset;
                    octagon.Add(Tile.FromProperties(
                        cubicCoordinates: CubicCoordinates.FromOffset(
                            OffsetCoordinates.FromProperties(row: row, col: col)
                        ),
                        tileShape: TileShape.Octagon,
                        terrain: Terrain.Water
                    ));
                }
            }

            // return the octagon tiles
            return octagon;

        }

        private IList<Tile> BuildRegularHexagon(int sideLength, bool centerOrigin, TileShape tileShape = null)
        {

            var hexagon = new List<Tile>();
            var increment = (TileShape.Hexagon.DoubleIncrement ?? false) ? 2 : 1;
            var maxLength = (2 * sideLength) - 1;
            var centerOffset = centerOrigin ? ((sideLength * increment) - 1) : 0;
            if (tileShape == null)
            {
                tileShape = TileShape.Hexagon;
            }

            // Build top portion of hexagon
            var rowLength = sideLength - 1;
            var rowIndex = -1;
            while (rowLength < (maxLength - 1))
            {
                rowLength++;
                rowIndex++;
                var topRow = (rowIndex * increment) - centerOffset;
                var colOffset = Convert.ToInt32(Math.Floor((maxLength - rowLength) / 2.0)); // TODO:  Fix bug where column offset produces fractional value
                for (var colIndex = 0; colIndex < rowLength; colIndex++)
                {
                    var col = ((colIndex + colOffset) * increment) - centerOffset;
                    hexagon.Add(Tile.FromProperties(
                        cubicCoordinates: CubicCoordinates.FromOffset(
                            OffsetCoordinates.FromProperties(row: topRow, col: col)
                        ),
                        tileShape: tileShape,
                        terrain: Terrain.Water
                    ));
                }
            }

            // Build middle row of hexagon
            rowIndex++;
            rowLength = maxLength;
            var middleRow = (rowIndex * increment) - centerOffset;
            for (var colIndex = 0; colIndex < rowLength; colIndex++)
            {
                var col = (colIndex * increment) - centerOffset;
                hexagon.Add(Tile.FromProperties(
                    cubicCoordinates: CubicCoordinates.FromOffset(
                        OffsetCoordinates.FromProperties(row: middleRow, col: col)
                    ),
                    tileShape: tileShape,
                    terrain: Terrain.Water
                ));
            }

            // Build bottom portion of hexagon
            while (rowLength > sideLength)
            {
                rowLength--;
                rowIndex++;
                var bottomRow = (rowIndex * increment) - centerOffset;
                var colOffset = Convert.ToInt32(Math.Floor((maxLength - rowLength) / 2.0)); // TODO:  Fix bug where column offset produces fractional value
                for (var colIndex = 0; colIndex < rowLength; colIndex++)
                {
                    var col = ((colIndex + colOffset) * increment) - centerOffset;
                    hexagon.Add(Tile.FromProperties(
                        cubicCoordinates: CubicCoordinates.FromOffset(
                            OffsetCoordinates.FromProperties(row: bottomRow, col: col)
                        ),
                        tileShape: tileShape,
                        terrain: Terrain.Water
                    ));
                }
            }

            // return the hexagon tiles
            return hexagon;

        }

    }
}