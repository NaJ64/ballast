using System;

namespace Ballast.Core.Models 
{
    public interface IVessel 
    {
        Guid Id { get; }
        ICubicCoordinates CubicCoordinates { get; }
    }
}