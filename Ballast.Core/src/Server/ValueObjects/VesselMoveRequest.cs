using System;

namespace Ballast.Core.ValueObjects
{
    public class VesselMoveRequest : IVesselMoveRequest
    {
        public Guid GameId { get; set; }
        public Guid BoardId { get; set; }
        public Guid VesselId { get; set; }
        public string TimestampText { get; set; }
        public int[] SourceOrderedTriple { get; set; }
        public int[] TargetOrderedTriple { get; set; }
    }
}