namespace Ballast.Core.Domain.Models
{
    public class Tile
    {

        public CubicCoordinates CubicCoordinates { get; private set; }
        public TileShape TileShape { get; private set; }
        public Terrain Terrain { get; private set; }

        public Tile(CubicCoordinates cubicCoordinates, TileShape tileShape, Terrain terrain)
        {
            CubicCoordinates = cubicCoordinates;
            TileShape = tileShape;
            Terrain = terrain;
        }

        public void SetTerrain(Terrain terrain)
        {
            this.Terrain = terrain;
        }

    }
}