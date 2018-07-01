using System;
using System.Collections.Generic;

namespace Ballast.Core.Models 
{
    public interface IGame 
    {
        Guid Id { get; }
        IBoard Board { get; }
        IEnumerable<IVessel> Vessels { get; }
        IEnumerable<IPlayer> Players { get; }
        DateTime CreatedUtc { get; }
        DateTime? StartedUtc { get; }
        DateTime? EndedUtc { get; }
    }
}