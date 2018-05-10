using System;

namespace Ballast.Core.ValueObjects
{
    public class AddPlayerOptions
    {
        public Guid PlayerId { get; set; }
        public string PlayerName { get; set; }
        public Guid GameId { get; set; }
        public Guid? VesselId { get; set; }
        public int[] VesselRoleValues { get; set; }
    }
}