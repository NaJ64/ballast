namespace Ballast.Core.Models.Interfaces
{
    public interface IBoardType
    {
        int Value { get; }
        string Name { get; }
        bool CenterOrigin { get; }
    }
}