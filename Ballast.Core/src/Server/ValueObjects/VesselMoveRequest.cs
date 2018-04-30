using System;

namespace Ballast.Core.ValueObjects
{
    public class VesselMoveRequest
    {
        public Guid GameId { get; set; }
        public Guid BoardId { get; set; }
        public Guid VesselId { get; set; }
        public DateTime Timestamp { get; set; }
        public int[] SourceOrderedTriple { get; set; }
        public int[] TargetOrderedTriple { get; set; }
    }
}