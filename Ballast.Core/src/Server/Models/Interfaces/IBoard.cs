using System;
using System.Collections.Generic;

namespace Ballast.Core.Models.Interfaces
{
    public interface IBoard
    {
        Guid Id { get; }
        IBoardType BoardType { get; }
        IEnumerable<ITile> Tiles { get; } 
        ITileShape TileShape { get; }
    }
}