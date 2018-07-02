using System;

namespace Ballast.Core.ValueObjects
{
    public class RemovePlayerOptions
    {
        public Guid PlayerId { get; set; }
        public Guid? GameId { get; set; }
        public Guid? VesselId { get; set; }
        public int[] VesselRoleValues { get; set; }
    }
}