using System;
using System.Collections.Generic;

namespace Ballast.Core.Models.Interfaces 
{
    public interface IGame 
    {
        Guid Id { get; }
        IBoard Board { get; }
        IEnumerable<IVessel> Vessels { get;}

    }
}