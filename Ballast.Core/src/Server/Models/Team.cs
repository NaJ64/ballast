using System.Collections.Generic;

namespace Ballast.Core.Models
{
    public class Team
    {
        public IEnumerable<Player> Players { get; set; }
        public IEnumerable<Vessel> Vessels { get; set; }
    }
}
