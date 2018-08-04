using System;
using System.Collections.Generic;
using System.Linq;

namespace Ballast.Core.Models
{

    public class BoardState
    {
        public Guid Id { get; set; }
        public BoardType BoardType { get; set; }
        public TileShape TileShape { get; set; }
        public IEnumerable<Tile> Tiles { get; set; }
    }

    public class Board
    {

        public BoardType BoardType { get; private set; }
        public Guid Id { get; private set; }
        public IEnumerable<Tile> Tiles { get; private set; }
        public TileShape TileShape { get; private set; }

        private Board(BoardType boardType, Guid id, IEnumerable<Tile> tiles, TileShape tileShape)
        {
            BoardType = boardType;
            Id = id;
            Tiles = tiles;
            TileShape = tileShape;
        }
        
        public static Board FromProperties(BoardType boardType, Guid id, IEnumerable<Tile> tiles, TileShape tileShape) => new Board(
            boardType: boardType,
            id: id,
            tiles:tiles,
            tileShape: tileShape
        );

        public static implicit operator Board(BoardState state) =>
            new Board(state.BoardType, state.Id, state.Tiles, state.TileShape);

        public CubicCoordinates GetRandomPassableCoordinates()
        {
            var passables = Tiles.Where(x => x.Terrain.Passable);
            var index = new Random().Next(1, passables.Count()) - 1;
            return passables.ElementAt(index).CubicCoordinates;
        }

        public Tile GetTileFromCoordinates(CubicCoordinates cubicCoordinates) =>
            Tiles.SingleOrDefault(x => x.CubicCoordinates.Equals(cubicCoordinates));

    }
    
}