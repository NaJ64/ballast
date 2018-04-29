using Ballast.Core.Models.Interfaces;
using System;

namespace Ballast.Core.Models
{
    public class Vessel : IVessel
    {
        public Guid Id { get; private set; }
        public ICubicCoordinates CubicCoordinates { get; private set; }
    }
}