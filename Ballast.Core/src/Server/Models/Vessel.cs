using System.Collections.Generic;
using System.Linq;

namespace Ballast.Core.Models
{
    public class Vessel
    {
        public bool Active { get; set; }
        public Team Team { get; set; }
        public VesselType VesselType { get; set; }
        public Player Captain { get; set; }
        public Player Radioman { get; set; }
        public VesselPosition StartingPosition => PositionHistory
            .OrderBy(x => x.ArrivalUtc)
            .FirstOrDefault();
        public VesselPosition CurrentPosition => PositionHistory
            .OrderByDescending(x => x.ArrivalUtc)
            .FirstOrDefault();
        public IEnumerable<VesselPosition> PositionHistory { get; set; }
        public int RemainingHP { get; set; }
        public int Kills { get; set; }

    }
}
