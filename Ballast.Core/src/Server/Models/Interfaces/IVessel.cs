using System;

namespace Ballast.Core.Models.Interfaces 
{
    public interface IVessel 
    {
        Guid Id { get; }
        ICubicCoordinates CubicCoordinates { get; }
    }
}