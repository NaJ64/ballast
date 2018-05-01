namespace Ballast.Core.Models.Interfaces
{
    public interface IBoardType : IStaticListType
    {
        bool CenterOrigin { get; }
    }
}