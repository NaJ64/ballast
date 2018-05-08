namespace Ballast.Core.Models
{
    public interface IBoardType : IStaticListType
    {
        bool CenterOrigin { get; }
    }
}