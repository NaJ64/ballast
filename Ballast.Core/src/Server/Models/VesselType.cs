using System;
using System.Collections.Generic;
using System.Linq;

namespace Ballast.Core.Models
{
    public class VesselType
    {
        public static VesselType Submarine => new VesselType(0, "Submarine", 100, false);

        public int Value { get; private set; }
        public string Name { get; private set; }
        public int BaseHP { get; private set; }
        public bool CanReverse { get; set; }

        private VesselType(int val, string name, int baseHP, bool canReverse)
        {
            Value = val;
            Name = name;
            BaseHP = baseHP;
            CanReverse = canReverse;
        }

        public static IEnumerable<VesselType> List()
        {
            // alternately, use a dictionary keyed by value
            return new[] {
                Submarine
            };
        }

        public static VesselType FromString(string value)
        {
            return List().Single(x => String.Equals(x.Name, value, StringComparison.OrdinalIgnoreCase));
        }

        public static VesselType FromValue(int value)
        {
            return List().Single(x => x.Value == value);
        }
    }
}
