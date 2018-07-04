namespace Ballast.Core.Models
{

    public class TileState 
    {
        public CubicCoordinates CubicCoordinates { get; set; }
        public TileShape TileShape { get; set; }
        public Terrain Terrain { get; set; }
    }

    public class Tile
    {

        public CubicCoordinates CubicCoordinates { get; private set; }
        public TileShape TileShape { get; private set; }
        public Terrain Terrain { get; private set; }

        private Tile(CubicCoordinates cubicCoordinates, TileShape tileShape, Terrain terrain)
        {
            CubicCoordinates = cubicCoordinates;
            TileShape = tileShape;
            Terrain = terrain;
        }

        public static Tile FromProperties(CubicCoordinates cubicCoordinates, TileShape tileShape, Terrain terrain) => 
            new Tile(
                cubicCoordinates: cubicCoordinates,
                tileShape: tileShape,
                terrain: terrain
            );

        public static implicit operator Tile(TileState state) =>
            new Tile(state.CubicCoordinates, state.TileShape, state.Terrain);

    }

}