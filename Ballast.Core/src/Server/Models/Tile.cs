namespace Ballast.Core.Models
{
    public class Tile : ITile 
    {

        private readonly CubicCoordinates _cubicCoordinates;
        private readonly TileShape _tileShape;
        private readonly Terrain _terrain;
        
        public ICubicCoordinates CubicCoordinates => _cubicCoordinates;
        public ITileShape TileShape => _tileShape;
        public ITerrain Terrain => _terrain;

        private Tile(ICubicCoordinates cubicCoordinates, ITileShape tileShape, ITerrain terrain)
        {
            _cubicCoordinates = Models.CubicCoordinates.FromObject(cubicCoordinates);
            _tileShape = Models.TileShape.FromObject(tileShape);
            _terrain = Models.Terrain.FromObject(terrain);
        }

        private Tile(ITile state) : this(
            cubicCoordinates: state.CubicCoordinates,
            tileShape: state.TileShape,
            terrain: state.Terrain
        ) { }

        public static Tile FromObject(ITile state) => new Tile(state);

        public static Tile FromProperties(ICubicCoordinates cubicCoordinates, ITileShape tileShape, ITerrain terrain) => 
            new Tile(
                cubicCoordinates: cubicCoordinates,
                tileShape: tileShape,
                terrain: terrain
            );

    }
}