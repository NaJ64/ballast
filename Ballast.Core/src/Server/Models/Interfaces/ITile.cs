namespace Ballast.Core.Models.Interfaces
{
    public interface ITile
    {
        ICubicCoordinates CubicCoordinates { get; }
        int TileShapeValue { get; }
        int TerrainValue { get; }
        bool Inactive { get; }
    }
}