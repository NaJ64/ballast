using System;

namespace Ballast.Core.Models
{
    public class Move
    {
        public Team Team { get; set; }
        public Player Player { get; set; }
        public Player Vessel { get; set; }
        public DateTime? StartUtc { get; set; }
        public DateTime? EndUtc { get; set; }
        public bool IsStrike { get; set; }
        public Strike Strike { get; set; }
    }
}
