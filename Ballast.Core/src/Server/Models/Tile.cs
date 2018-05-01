using Ballast.Core.Models.Interfaces;

namespace Ballast.Core.Models
{
    public class Tile : ITile 
    {

        public int[] CubicOrderedTriple => CubicCoordinates.ToOrderedTriple();
        public bool? Inactive { get; private set; }
        public int TileShapeValue => TileShape.Value;
        public int TerrainValue => Terrain.Value;
        
        public CubicCoordinates CubicCoordinates { get; private set; }
        public TileShape TileShape { get; private set; }
        public Terrain Terrain { get; private set; }

        private Tile(int[] cubicOrderedTriple, int tileShapeValue, int terrainValue, bool? inactive = null)
        {
            CubicCoordinates = CubicCoordinates.FromOrderedTriple(cubicOrderedTriple);
            TileShape = Models.TileShape.FromValue(tileShapeValue);
            Terrain = Terrain.FromValue(terrainValue);
            Inactive = inactive ?? false;
        }

        private Tile(ITile state) : this(
            cubicOrderedTriple: state.CubicOrderedTriple,
            tileShapeValue: state.TileShapeValue,
            terrainValue: state.TerrainValue,
            inactive: state.Inactive
        ) { }

        public static Tile FromObject(ITile state) => new Tile(state);

        public static Tile FromProperties(int[] cubicOrderedTriple, int tileShapeValue, int terrainValue, bool? inactive = null) => 
            new Tile(
                cubicOrderedTriple: cubicOrderedTriple,
                tileShapeValue: tileShapeValue,
                terrainValue: terrainValue,
                inactive: inactive
            );

    }
}