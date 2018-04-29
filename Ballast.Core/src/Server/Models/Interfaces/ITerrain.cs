namespace Ballast.Core.Models.Interfaces
{
    public interface ITerrain
    {
        int Value { get; }
        string Name { get; }
        bool Passable { get; }
    }
}