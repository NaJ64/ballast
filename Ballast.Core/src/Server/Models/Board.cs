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
        public ITileShape TileShape { get; private set; }
    }
}