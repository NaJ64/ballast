namespace Ballast.Core.Application.Models
{
    public class CreateVesselOptions
    {
        public int[] StartOrderedTriple { get; set; }
        public string RequestedName { get; set; }
    }
}