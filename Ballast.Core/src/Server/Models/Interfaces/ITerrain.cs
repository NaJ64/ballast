namespace Ballast.Core.Models
{
    public interface ITerrain : IStaticListType
    {
        bool Passable { get; }
    }
}