using System.Collections.Generic;
using System.Linq;

namespace Ballast.Core.Domain.Models
{

    public class VesselRole : StaticListTypeBase<VesselRole>
    {
    
        public readonly static VesselRole Captain = new VesselRole(value: 0, name: nameof(Captain));
        public readonly static VesselRole Radioman = new VesselRole(value: 1, name: nameof(Radioman));
    
        private VesselRole(int value, string name) : base(value, name) { }

        public static IEnumerable<VesselRole> List() => new [] {
            VesselRole.Captain,
            VesselRole.Radioman
        };

        public static VesselRole FromValue(int value) =>
            VesselRole.List().Single(x => x.Value == value);

        public static VesselRole FromName(string name) =>
            VesselRole.List().Single(x => x.Name.ToLowerInvariant() == name.ToLowerInvariant());

    }
}