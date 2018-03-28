using System.Collections.Generic;

namespace Ballast.Core.Models
{
    public class Vessel
    {
        public bool Active { get; set; }
        public Team Team { get; set; }
        public VesselType VesselType { get; set; }
        public Player Captain { get; set; }
        public Player Radioman { get; set; }
        public VesselPosition StartingPosition { get; set; }
        public VesselPosition CurrentPosition { get; set; }
        public IEnumerable<VesselPosition> PositionHistory { get; set; }
        public int RemainingHP { get; set; }
        public int Kills { get; set; }

    }
}
