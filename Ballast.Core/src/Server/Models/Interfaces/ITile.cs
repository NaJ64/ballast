namespace Ballast.Core.Models.Interfaces
{
    public interface ITile
    {
        int[] CubicOrderedTriple { get; }
        bool? Inactive { get; }
        int TileShapeValue { get; }
        int TerrainValue { get; }
    }
}