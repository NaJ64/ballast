using System;
using System.Collections.Generic;

namespace Ballast.Core.Models
{
    public class Game
    {
        public DateTime? StartUtc { get; set; }
        public DateTime? EndUtc { get; set; }
        public IEnumerable<Team> Teams { get; set; }
        public int TotalMoves { get; set; }
    }
}
