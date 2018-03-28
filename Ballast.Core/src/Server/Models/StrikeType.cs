using System;
using System.Collections.Generic;
using System.Linq;

namespace Ballast.Core.Models
{
    public class StrikeType
    {
        public static StrikeType Torpedo => new StrikeType(0, "Torpedo", 100, 50);

        public int Value { get; private set; }
        public string Name { get; private set; }
        public int DirectImpactHP { get; private set; }
        public int IndirectImpactHP { get; private set; }

        private StrikeType(int value, string name, int directImpactHP, int indirectImpactHP)
        {
            Value = value;
            Name = name;
            DirectImpactHP = directImpactHP;
            IndirectImpactHP = indirectImpactHP;
        }

        public static IEnumerable<StrikeType> List()
        {
            // alternately, use a dictionary keyed by value
            return new[] {
                Torpedo
            };
        }

        public static StrikeType FromString(string value)
        {
            return List().Single(x => String.Equals(x.Name, value, StringComparison.OrdinalIgnoreCase));
        }

        public static StrikeType FromValue(int value)
        {
            return List().Single(x => x.Value == value);
        }
    }
}
