using System;
using System.Collections.Generic;
using System.Linq;

namespace Ballast.Core.Models
{
    public class Board : IBoard
    {

        private readonly IEnumerable<Tile> _tiles;
        private readonly BoardType _boardType;
        private readonly TileShape _tileShape;

        public Guid Id { get; private set; }
        public IEnumerable<ITile> Tiles => _tiles;
        public IBoardType BoardType => _boardType;
        public ITileShape TileShape => _tileShape;

        private Board(IBoardType boardType, Guid id, IEnumerable<ITile> tiles, ITileShape tileShape)
        {
            _boardType = Models.BoardType.FromValue(boardType.Value);
            _tiles = tiles.Select(x => Tile.FromObject(x));
            _tileShape = Models.TileShape.FromValue(tileShape.Value);
            Id = id;
        }

        private Board(IBoard state) : this(
            boardType: state.BoardType,
            id: state.Id,
            tiles: state.Tiles,
            tileShape: state.TileShape
        ) { }
        
        public static Board FromObject(IBoard state) => new Board(state);

        public static Board FromProperties(IBoardType boardType, Guid id, IEnumerable<ITile> tiles, ITileShape tileShape) => new Board(
            boardType: boardType,
            id: id,
            tiles:tiles,
            tileShape: tileShape
        );

        public ICubicCoordinates GetRandomPassableCoordinates()
        {
            var passables = _tiles.Where(x => x.Terrain.Passable);
            var index = new Random().Next(1, passables.Count());
            return passables.ElementAt(index).CubicCoordinates;
        }

        public ITile GetTileFromCoordinates(ICubicCoordinates cubicCoordinates) =>
            _tiles.SingleOrDefault(x => x.CubicCoordinates.Equals(cubicCoordinates));

    }
}