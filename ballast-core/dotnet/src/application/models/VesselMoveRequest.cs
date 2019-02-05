using System;

namespace Ballast.Core.ValueObjects
{
    public class VesselMoveRequest
    {
        public Guid GameId { get; set; }
        public Guid VesselId { get; set; }
        public string SentOnDateIsoString { get; set; }
        public int[] SourceOrderedTriple { get; set; }
        public int[] TargetOrderedTriple { get; set; }
        public Direction Direction { get; set; }
    }
}