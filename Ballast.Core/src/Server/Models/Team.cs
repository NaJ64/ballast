using System;
using System.Collections.Generic;

namespace Ballast.Core.Models
{
    public class Team
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<Player> Players { get; set; }
        public IEnumerable<Vessel> Vessels { get; set; }
    }
}
