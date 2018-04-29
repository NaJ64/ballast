using Ballast.Core.Models.Interfaces;

namespace Ballast.Core.Models
{
    public class CubicCoordinates : ICubicCoordinates
    {
        public int X { get; private set; }
        public int Y { get; private set; }
        public int Z { get; private set; }
    }
}