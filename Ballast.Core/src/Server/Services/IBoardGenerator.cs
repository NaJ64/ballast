using Ballast.Core.Models;
using Ballast.Core.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Ballast.Core.Services
{
    public interface IBoardGenerator
    {
        Board CreateBoard(
            Guid id,
            IBoardType boardType,
            ITileShape tileShape,
            int columnsOrSideLength,
            int? rows = null,
            decimal? landToWaterRatio = null
        );
    }
}