using System;
using System.Collections.Generic;
using System.Linq;

namespace Ballast.Core.Models
{
    public class VesselRole : StaticListTypeBase<VesselRole>, IVesselRole
    {
    
        public readonly static VesselRole Captain = new VesselRole(value: 0, name: nameof(Captain));
        public readonly static VesselRole Radioman = new VesselRole(value: 1, name: nameof(Radioman));
    
        public bool Passable { get; private set; }

        private VesselRole(int value, string name) : base(value, name) { }

        private VesselRole(IVesselRole state) : this(
            value: state.Value, 
            name: state.Name
        ) { }
        
        public static IEnumerable<VesselRole> List() => new [] {
            VesselRole.Captain,
            VesselRole.Radioman
        };

        public static VesselRole FromObject(IVesselRole state) =>
            new VesselRole(state);

        public static VesselRole FromValue(int value) =>
            VesselRole.List().Single(x => x.Value == value);

        public static VesselRole FromString(string name) =>
            VesselRole.List().Single(x => x.Name.ToLowerInvariant() == name.ToLowerInvariant());

    }
}