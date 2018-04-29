using Ballast.Core.Models.Interfaces;

namespace Ballast.Core.Models
{
    public class OffsetCoordinates : IOffsetCoordinates
    {
        public int Row { get; private set; }
        public int Col { get; private set; }
    }
}