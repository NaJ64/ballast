using System;
using System.Collections.Generic;

namespace Ballast.Core.Models
{
    public class Strike
    {
        public DateTime? StartUtc { get; set; }
        public DateTime? EndUtc { get; set; }
        public Move Move { get; set; }
        public Vessel Source { get; set; }
        public IEnumerable<Vessel> Affected { get; set; }
        public int TotalDamageHP { get; set; }
        public string Name { get; set; }
    }
}
