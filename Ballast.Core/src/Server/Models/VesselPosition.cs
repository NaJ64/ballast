using System;
using System.Collections.Generic;

namespace Ballast.Core.Models
{
    public class VesselPosition
    {
        public BoardSpace Space { get; set; }
        public Vessel Vessel { get; set; }
        public Direction ArrivalDirection { get; set; }
        public DateTime ArrivalUtc { get; set; }
        public Direction ExitDirection { get; set; }
        public DateTime? ExitUtc { get; set; }
        public VesselPosition Previous { get; set; }
        public VesselPosition Next { get; set; }
        public bool IsSpawn { get; set; }
        public IEnumerable<Strike> IncurredStrikes { get; set; }
    }
}
