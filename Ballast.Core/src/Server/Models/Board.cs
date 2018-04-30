using Ballast.Core.Models.Interfaces;
using System;
using System.Collections.Generic;

namespace Ballast.Core.Models
{
    public class Board : IBoard
    {
        public int BoardTypeValue { get; private set; }
        public BoardType BoardType { get; private set; }
        public Guid Id { get; private set; }
        public IEnumerable<ITile> Tiles { get; private set; }
        public int TileShapeValue { get; private set; }
        public TileShape TileShape { get; private set; }

        private Board(IBoard state) : this(
            boardTypeValue: state.BoardTypeValue,
            id: state.Id,
            tiles: state.Tiles,
            tileShapeValue: state.TileShapeValue
        ) { }
        private Board(int boardTypeValue, Guid id, IEnumerable<ITile> tiles, int tileShapeValue)
        {
            BoardTypeValue = boardTypeValue;
            BoardType = BoardType.FromValue(boardTypeValue);
            Id = id;
            Tiles = tiles;
            TileShapeValue = tileShapeValue;
            TileShape = TileShape.FromValue(tileShapeValue);
        }

        public static Board FromObject(IBoard state) => new Board(state);

        public static Board FromProperties(int boardTypeValue, Guid id, IEnumerable<ITile> tiles, int tileShapeValue) => new Board(
            boardTypeValue: boardTypeValue,
            id: id,
            tiles:tiles,
            tileShapeValue: tileShapeValue
        );

    }
}