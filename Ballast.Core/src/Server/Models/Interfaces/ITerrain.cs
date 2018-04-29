namespace Ballast.Core.Models.Interfaces
{
    public interface ITerrain : IStaticListType
    {
        bool Passable { get; }
    }
}