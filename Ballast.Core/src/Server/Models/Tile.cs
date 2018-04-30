using Ballast.Core.Models.Interfaces;

namespace Ballast.Core
{
    public class Tile : ITile 
    {
        public ICubicCoordinates CubicCoordinates { get; private set; }
        public bool Inactive { get; private set; }
        public int TileShapeValue { get; private set; }
        public int TerrainValue { get; private set; }
        
        public ITileShape TileShape { get; private set; }
        public ITerrain Terrain { get; private set; }
    }
}