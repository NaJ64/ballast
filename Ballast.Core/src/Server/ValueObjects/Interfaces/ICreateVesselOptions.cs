namespace Ballast.Core.ValueObjects
{
    public interface ICreateVesselOptions
    {
        int[] StartOrderedTriple { get; }
        string RequestedName { get; }
    }
}