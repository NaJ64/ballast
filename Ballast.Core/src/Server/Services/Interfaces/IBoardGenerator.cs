using Ballast.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Ballast.Core.Services
{
    public interface IBoardGenerator : IDisposable
    {
        Board CreateBoard(
            Guid id,
            BoardType boardType,
            TileShape tileShape,
            int columnsOrSideLength,
            int? rows = null,
            decimal? landToWaterRatio = null
        );
    }
}