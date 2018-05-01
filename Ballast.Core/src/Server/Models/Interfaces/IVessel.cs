using System;

namespace Ballast.Core.Models.Interfaces 
{
    public interface IVessel 
    {
        Guid Id { get; }
        int[] CubicOrderedTriple { get; }
    }
}