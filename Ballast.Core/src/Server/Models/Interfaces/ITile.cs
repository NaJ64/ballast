namespace Ballast.Core.Models.Interfaces
{
    public interface ITile
    {
        ICubicCoordinates CubicCoordinates { get; }
        ITileShape TileShape { get; }
        ITerrain Terrain { get; }
    }
}