using System;
using System.Collections.Generic;

namespace Ballast.Core.Models.Interfaces
{
    public interface IBoard
    {
        int BoardTypeValue { get; }
        Guid Id { get; }
        IEnumerable<ITile> Tiles { get; } 
        int TileShapeValue { get; }
    }
}