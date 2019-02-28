using System;
using System.Collections.Generic;
using System.Linq;

namespace Ballast.Core.Domain.Models
{
    public class Board
    {

        public BoardType BoardType { get; private set; }
        public Guid Id { get; private set; }
        public IEnumerable<Tile> Tiles { get; private set; }
        public TileShape TileShape { get; private set; }

        public Board(BoardType boardType, Guid id, IEnumerable<Tile> tiles, TileShape tileShape)
        {
            BoardType = boardType;
            Id = id;
            Tiles = tiles;
            TileShape = tileShape;
        }
        
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