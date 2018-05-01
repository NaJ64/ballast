using Ballast.Core.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Ballast.Core.Models
{
    public class Board : IBoard
    {

        private readonly IEnumerable<Tile> _tiles;

        public int BoardTypeValue => BoardType.Value;
        public Guid Id { get; private set; }
        public IEnumerable<ITile> Tiles => _tiles;
        public int TileShapeValue => TileShape.Value;

        public BoardType BoardType { get; private set; }
        public TileShape TileShape { get; private set; }

        private Board(int boardTypeValue, Guid id, IEnumerable<ITile> tiles, int tileShapeValue)
        {
            BoardType = BoardType.FromValue(boardTypeValue);
            Id = id;
            _tiles = tiles.Select(x => Tile.FromObject(x));
            TileShape = TileShape.FromValue(tileShapeValue);
        }

        private Board(IBoard state) : this(
            boardTypeValue: state.BoardTypeValue,
            id: state.Id,
            tiles: state.Tiles,
            tileShapeValue: state.TileShapeValue
        ) { }
        
        public static Board FromObject(IBoard state) => new Board(state);

        public static Board FromProperties(int boardTypeValue, Guid id, IEnumerable<ITile> tiles, int tileShapeValue) => new Board(
            boardTypeValue: boardTypeValue,
            id: id,
            tiles:tiles,
            tileShapeValue: tileShapeValue
        );

    }
}