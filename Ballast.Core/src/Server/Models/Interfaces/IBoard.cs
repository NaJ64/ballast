using System;
using System.Collections.Generic;

namespace Ballast.Core.Models.Interfaces
{
    public interface IBoard
    {
        IBoardType BoardType { get; }
        Guid Id { get; }
        IEnumerable<ITile> Tiles { get; } 
        ITileShape TileShape { get; }
    }
}