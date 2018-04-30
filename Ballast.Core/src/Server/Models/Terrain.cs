using Ballast.Core.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Ballast.Core.Models
{
    public class Terrain : StaticListTypeBase<Terrain>, ITerrain
    {
    
        public static Terrain Water = new Terrain(value: 0, name: "Water", passable: false );
        public static Terrain Coast = new Terrain(value: 1, name: "Coast", passable: true );
        public static Terrain Land = new Terrain(value: 2, name: "Land", passable: true );
    
        public bool Passable { get; private set; }

        public Terrain() { } // Default paremeter-less constructor for model-binding
        private Terrain(ITerrain state) : this(
            value: state.Value, 
            name: state.Name, 
            passable: state.Passable
        ) { }
        private Terrain(int value, string name, bool passable) : base(value, name) 
        {
            Passable = passable;
        }

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