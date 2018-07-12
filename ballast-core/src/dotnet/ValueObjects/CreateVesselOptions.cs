using System;

namespace Ballast.Core.ValueObjects
{
    public class CreateVesselOptions
    {
        public int[] StartOrderedTriple { get; set; }
        public string RequestedName { get; set; }
    }
}