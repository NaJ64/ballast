namespace Ballast.Core.Models
{
    public interface ITile
    {
        ICubicCoordinates CubicCoordinates { get; }
        ITileShape TileShape { get; }
        ITerrain Terrain { get; }
    }
}