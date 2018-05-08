using System;
using System.Collections.Generic;
using System.Linq;

namespace Ballast.Core.Models
{
    public class Terrain : StaticListTypeBase<Terrain>, ITerrain
    {
    
        public readonly static Terrain Water = new Terrain(value: 0, name: "Water", passable: true );
        public readonly static Terrain Coast = new Terrain(value: 1, name: "Coast", passable: false );
        public readonly static Terrain Land = new Terrain(value: 2, name: "Land", passable: false );
    
        public bool Passable { get; private set; }

        private Terrain(int value, string name, bool passable) : base(value, name) 
        {
            Passable = passable;
        }

        private Terrain(ITerrain state) : this(
            value: state.Value, 
            name: state.Name, 
            passable: state.Passable
        ) { }
        
        public static IEnumerable<Terrain> List() => new [] {
            Terrain.Water,
            Terrain.Coast,
            Terrain.Land
        };

        public static Terrain FromObject(ITerrain state) =>
            new Terrain(state);

        public static Terrain FromValue(int value) =>
            Terrain.List().Single(x => x.Value == value);

        public static Terrain FromString(string name) =>
            Terrain.List().Single(x => x.Name.ToLowerInvariant() == name.ToLowerInvariant());

    }
}